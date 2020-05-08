import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Box } from '../dominio/box.domain';
import { UserService } from '../servicio/user.service';
import { UserRegister } from '../dominio/user.domain';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodeService } from '../servicio/code.service';

// El selector es la forma de instanciar al componente desde otro html que no es el que aparece en la línea de abajo.
// Por ejemplo, en el app.component.ts, el selector es app-root y en index.html es llamado poniendo <app-root></app-root>
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html', //El html que se gestionará
  styleUrls: ['./register.component.css'] //Los css que harán referencia al html (Pueden ser varios, por eso es un array)
})
export class RegisterComponent implements OnInit {

  message: string;
  close: string;

  //Aqui se definen variables que se usarán más adelante
  signUpFormGroup: FormGroup;
  selectPlanFormGroup: FormGroup;
  personalDataFormGroup: FormGroup;
  isOptional = true;
  termsAccepted = false;
  public payPalConfig?: IPayPalConfig;
  selectedPlan : string;
  boxes : Box[];
  showPass : boolean = false;
  showConfirmPass : boolean = false;

  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$')]);

  confirmPasswordControl: FormControl = new FormControl('', [Validators.required, this.samePasswordValidator(this.passwordControl)]);
  acceptTerms : FormControl = new FormControl(false, [Validators.requiredTrue]);

  codeControl : FormControl = new FormControl('',);
  codeId : number;

  constructor(private _formBuilder: FormBuilder, 
    private userService : UserService, private router : Router, 
    private _snackBar: MatSnackBar, private codeService : CodeService) { }

  ngOnInit(): void {

    this.userService.getAllBoxes().subscribe((res : Box[]) => {
      this.boxes = res;
    });

    this.signUpFormGroup = this._formBuilder.group({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      confirmPasswordControl: this.confirmPasswordControl,
      codeControl : this.codeControl,
      accetpTerms: this.acceptTerms
    });

    this.selectPlanFormGroup = this._formBuilder.group({
    });

  }

  samePasswordValidator(pass: FormControl) {
    return (control: AbstractControl): {[key: string]: any} | null => {
       let res = control.value != pass.value ? {'notSamePassword': "Las contraseñas no son iguales"} : null;
       return res;
     };
  }

  validEmailValidator() {
    this.userService.isValidEmail(this.emailControl.value).subscribe((res : boolean) => {
      if (!res) {
        this.emailControl.setErrors({'usedEmail': true});
      } else {
        this.emailControl.updateValueAndValidity();
      }
    });
  }
  
  registerWithCode(){
    let expiredDate : string = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    let selectedBox : number = this.boxes.filter(box => box.name == "PRO")[0].id;
    let user : UserRegister= {
      id: 0, 
      box: selectedBox, 
      expiredDate: expiredDate, 
      orderId: "DISCOUNT_CODE", 
      password: this.passwordControl.value, 
      payerId: "DISCOUNT_CODE", 
      username: this.emailControl.value,
      codeId: this.codeId
    };

    this.userService.registerUser(user).subscribe(() => {
      this.message = "Se ha registrado con éxito. Ya puede usar Scrume. Será redirigido en 5 segundos.";
      this.close = "Cerrar";
      this.openSnackBar(this.message, this.close);
    });

  }

  validateCode(){
    this._validateCode(this.codeControl.value);
  }


  private _validateCode(code: string) {
    this.codeService.validateCode(code).subscribe((idCode : number) =>  {
      if(idCode === undefined){
        this.codeId = null;
        this.codeControl.setErrors({'invalid' : "Este código no es válido."});
      }else{
        this.codeControl.updateValueAndValidity();
        this.codeId = idCode;
      }
    }, (error)=>{
      this.codeControl.setErrors({'invalid' : "Este código no es válido."});
    });

  }

  getErrorCode() : string {
    return this.codeControl.hasError('invalid') ? this.codeControl.getError('invalid') : '' ;
  }


  getErrorMessageEmail() {
    return this.emailControl.hasError('required') ? 'Este campo es requerido.':
    this.emailControl.hasError('email') ? 'El email debe tener un formato válido: ejemplo@ejemplo.es':
    this.emailControl.hasError('usedEmail') ? 'Este email ya está en uso': '';
  }

  getErrorMessagePassword(){
    return this.passwordControl.hasError('required') ? 'Este campo es requerido.':
    this.passwordControl.hasError('minlength') ? 'El tamaño debe ser mayor a 8 caracteres.':
    this.passwordControl.hasError("pattern") ? 'La contraseña debe tener 8 caracteres entre números, mayúsculas y minúsculas.' :'';
  }

  getErrorMessageConfirmPassword(){
    return this.confirmPasswordControl.hasError('required') ? 'Este campo es requerido.':
    this.confirmPasswordControl.hasError('notSamePassword') ? 'Las contraseñas no coinciden.' : '';
  }

  getErrorAcceptTerms(){
    return this.acceptTerms.hasError('required') ? 'Debe leer y aceptar los términos y usos.':'';
  }

  notNullSelectedPlan(): boolean {
    let inputRadioButton = document.querySelector('input[name="selected-plan"]:checked');
    if (inputRadioButton != null) {
      this.selectedPlan = String(inputRadioButton["value"]);
      let valueRadioButton = inputRadioButton["value"];
      return valueRadioButton == 'BASIC' || valueRadioButton == 'PRO' || valueRadioButton == 'STANDARD';
    } else {
      return false;
    }
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  changePassState(){
    this.showPass = !this.showPass;
  }
  changeConfirmPassState() {
    this.showConfirmPass = !this.showConfirmPass;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    }).afterDismissed().subscribe(() => {
      this.navigateTo("bienvenida");
    }
    );
  }

  initConfig(): void {
    let paymentInfo;
    let priceSelectedBox : number;
    let selectedBox : number = this.boxes.filter(box => box.name == this.selectedPlan)[0].id;
    if (this.selectedPlan == 'STANDARD') {
      priceSelectedBox = this.boxes.filter(box => box.name == 'STANDARD')[0].price;
    } else if (this.selectedPlan == 'PRO'){
      priceSelectedBox = this.boxes.filter(box => box.name == 'PRO')[0].price;
    }
    let paypal:IPayPalConfig
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'AWOURCDQ1p1qNlLYj9Y_hMW2WsNcOSvLQ4MD-iRdJCqohyLebl1W7_V7ONq0wh_UfhpuZCQtFQZ_0mQi',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: priceSelectedBox.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: priceSelectedBox.toString()
              }
            }
          },
          items: [
            {
              name: this.selectedPlan + " - Scrume",
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: priceSelectedBox.toString(),
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true',
    },
    style: {
      label: 'paypal',
      layout: "horizontal",
      size: "responsive"
    },
    onApprove: (data, actions) => {
      paymentInfo = data;
      actions.order.get();
    },
    onClientAuthorization: (data) => {
      let expiredDate : string = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
      let user : UserRegister = {id: 0, box: selectedBox, expiredDate: expiredDate, orderId: paymentInfo["orderID"], password: this.passwordControl.value, payerId: paymentInfo["payerID"], username: this.emailControl.value};
      this.userService.registerUser(user).subscribe(() => {
        this.message = "Se ha registrado con éxito. Ya puede usar Scrume. Será redirigido en 5 segundos.";
        this.close = "Cerrar";
        this.openSnackBar(this.message, this.close);
      });
    },
    onCancel: (data, actions) => {
    },
    onError: err => {
    },
    onClick: (data, actions) => {
    },
  };
  }

  saveBasicPlan(){
    let selectedBox : number = this.boxes.filter(box => box.name == this.selectedPlan)[0].id;
    let expiredDate : string = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    let user : UserRegister = {id: 0, box: selectedBox, expiredDate: expiredDate, password: this.passwordControl.value,  username: this.emailControl.value}
    this.userService.registerUser(user).subscribe(() => {
      this.message = "Se ha registrado con éxito. Ya puede usar Scrume. Será redirigido en 5 segundos.";
      this.close = "Cerrar";
      this.openSnackBar(this.message, this.close);
    });
  }

}
