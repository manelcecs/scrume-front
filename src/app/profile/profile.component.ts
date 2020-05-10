import { Component, OnInit } from '@angular/core';
import { UserService } from '../servicio/user.service';
import { ProfileService } from '../servicio/profile.service';
import { User, Renovation } from '../dominio/user.domain';
import { Profile, ProfileSave } from '../dominio/profile.domain';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { PersonalService } from '../servicio/personal.service';
import { PersonalDataAll } from '../dominio/personal.domain';
import { MatDialog } from '@angular/material/dialog';
import { UserLogged, JWToken } from '../dominio/jwt.domain';
import { Box } from '../dominio/box.domain';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ValidationService } from '../servicio/validation.service';
import { CodeService } from '../servicio/code.service';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  profile: Profile;
  profileSave: ProfileSave;
  idUserAccount: number;

  preNick: string;

  name: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25)] });
  nick: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25), Validators.pattern(/^\S+$/)] });
  surnames: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25)] });
  photo: FormControl = new FormControl('', { validators: [Validators.pattern(/^(https?:\/\/)/), Validators.maxLength(255), Validators.pattern(/\.(jpeg|jpg|gif|png)$/)] });
  gitUser: FormControl = new FormControl('', {validators: [Validators.pattern(/^\S+$/)]});
  lastPass: FormControl = new FormControl('');
  newPass: FormControl = new FormControl('', { validators: [Validators.pattern(/\d/),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[A-Z]/),
    Validators.minLength(8)] });

  codeControl: FormControl = new FormControl('',);
  codeId: number;

  newPassword: string;
  showPass: boolean = false;
  showPassLast: boolean = false;

  personal: PersonalDataAll;

  userLogged: UserLogged;
  boxesName = ["BASIC", "STANDARD", "PRO"];
  boxes: Box[];
  selectBoxFormControl: FormControl = new FormControl('',{validators: [Validators.required]});
  public payPalConfig?: IPayPalConfig;
  isBoxExpired: boolean;

  constructor(private userService: UserService, private profileService: ProfileService, private router: Router,
    private _snackBar: MatSnackBar, private _location: Location, private activatedRoute: ActivatedRoute,
    private personalService: PersonalService,public dialog: MatDialog, private validationService: ValidationService,
    private codeService: CodeService ) { 

      
        this.profile = this.activatedRoute.snapshot.data.profile;

        this.preNick = this.profile.nick;

        this.name.setValue(this.profile.name);
        this.nick.setValue(this.profile.nick);
        this.surnames.setValue(this.profile.surnames);
        this.photo.setValue(this.profile.photo);
        this.gitUser.setValue(this.profile.gitUser);


    }

  ngOnInit(): void {

    this.userLogged = this.userService.getUserLogged();
    this.selectBoxFormControl.setValue(this.userLogged.nameBox);
    this.userService.getAllBoxes().subscribe((boxes: Box[]) => {
      this.boxes = boxes;
      this.initConfig();
    });

    this.isBoxExpired = this.validationService.isBoxExpired();

  }

  editProfile(){

    this.profile.name = this.name.value;
    this.profile.nick = this.nick.value;
    this.profile.photo = this.photo.value;
    this.profile.surnames = this.surnames.value;
    this.profile.gitUser = this.gitUser.value;
    this.profile.previousPassword = this.lastPass.value;
    this.profile.newPassword = this.newPass.value;

    this.newPassword = this.newPass.value;

    this.profile = {
      id: this.profile.id,
      gitUser: this.profile.gitUser,
      name: this.profile.name,
      nick: this.profile.nick,
      photo: this.profile.photo,
      surnames: this.profile.surnames,
      previousPassword: this.profile.previousPassword,
      newPassword: this.profile.newPassword
    }

    this.profileService.editProfile(this.profile).subscribe((pro: Profile) => {
      this.profile = pro;
      this.openSnackBar("Perfil actualizado.", "Cerrar");


    }, (error) => {
      if(error.error.message == "The current password does not match the one stored in the database") {
        this.lastPass.setErrors({ invalid: true });
      }else if(error.error.message == "The new password must have an uppercase, a lowercase, a number and at least 8 characters"){
        this.newPass.setErrors({ invalid: true });
      }else if(error.error.message == "The nick is not unique"){
        this.nick.setErrors({ unique: true });
      }
    },
      () => {
        if (this.newPass.value != "") {
          let email = atob(sessionStorage.getItem("loginToken")).split(":")[0];
          sessionStorage.setItem("loginToken", btoa(email + ":" + this.newPassword));
        }
      });



  }

  cancelEditProfile() {
    this._location.back();
  }

  validForm(): boolean {

    let valid: boolean = true;

    valid = valid && this.name.valid && this.nick.valid && this.surnames.valid && this.photo.valid && this.newPass.valid && this.lastPass.valid;
    return valid;

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openSnackBarAndRedirect() {
    this._snackBar.open("Su plan se ha renovado con éxito.", "Cerrar", {
      duration: 4000,
    }).afterDismissed().subscribe(() => {
      (this.navigateTo("teams"));
    });
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  getErrorMessageName(): string {
    return this.name.hasError('required') ? 'Este campo es requerido.' :
    this.name.hasError('maxlength') ? 'No puede tener más de 25 caracteres.' :
    this.photo.hasError('pattern') ? 'Debe de ser una imagen que empieza por https y termine en un formato de imagen válido.' :
    this.photo.hasError('maxlength') ? 'No puede tener más de 256 caracteres.' :
    this.nick.hasError('maxlength') ? 'No puede tener más de 25 caracteres.' :
    this.nick.hasError('pattern') ? 'No puede tener espacios en blanco.' :
    this.nick.hasError('required') ? 'Este campo es requerido.' :
    this.nick.hasError('unique') ? 'Este nick ya está en uso. Pruebe otro.' :
    this.surnames.hasError('maxlength') ? 'No puede tener más de 25 caracteres.' :
    this.surnames.hasError('required') ? 'Este campo es requerido.' :
    this.gitUser.hasError('pattern') ? 'No puede tener espacios en blanco.' :
    this.newPass.hasError('minlength') ? 'El tamaño debe ser mayor a 8 caracteres.':
    this.newPass.hasError('invalid') ? 'No puedes ser vacia.' :
    this.newPass.getError("pattern")["requiredPattern"] == "/[A-Z]/" ? "Debe tener una mayúscula." :
    this.newPass.getError("pattern")["requiredPattern"] == "/[a-z]/" ? "Debe tener una minúscula." :
    this.newPass.getError("pattern")["requiredPattern"] == "/\\d/" ? "Debe tener un dígito." : '';

  }

  changePassState() {
    this.showPass = !this.showPass;
  }

  changePassStateLast() {
    this.showPassLast = !this.showPassLast;
  }

  getErrorLastPass() {
    return this.lastPass.hasError('invalid') ? 'La contraseña es incorrecta.' : '';
  }

  //Personal Data

  openPersonalData(){
    this.router.navigate(['personal']);
  }

  saveAsProject(){
    this.personalService.getAllMyData().subscribe((per: PersonalDataAll)=>{
      this.personal = per;
      let string = JSON.stringify(this.personal);
      //you can enter your own file name and extension
      this.writeContents(string, 'PersonalData '+ this.personal.name +'.txt', 'text/plain');
    })
  }

  writeContents(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "250px",
      data: "¿Estás seguro que quieres borrar tu perfil? Esto significa que eliminaremos tus datos de la aplicación y por tanto no podrás acceder nunca más con esta cuenta. Esta opción es irreversible."
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if(res){
        this.personalService.getAnonymize().subscribe(()=> {
          this.logOut();
        });
      }
    });
  }

  logOut(): void{
    sessionStorage.setItem("loginToken", "");
    this.user = undefined;
    window.location.reload();
  }

  //Renovación del plan------------------------------------------------------------------------------------------
  initConfig(): void {
    let paymentInfo;
    let priceSelectedBox : number;
    let selectedBox : number = this.boxes.filter(box => box.name == this.selectBoxFormControl.value)[0].id;
    priceSelectedBox = this.boxes.filter(box => box.name == this.selectBoxFormControl.value)[0].price;
    let paypal:IPayPalConfig;
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
              name: this.selectBoxFormControl + " - Scrume",
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
      let expiredDate : string;
      let today : number = new Date().getTime();
      if(this.userLogged.endingBoxDate.getTime() > today){
        expiredDate = new Date(this.userLogged.endingBoxDate.getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
      }else{
        expiredDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
      }
      let renovation : Renovation = {id: 0, box: selectedBox, expiredDate: expiredDate, orderId: paymentInfo["orderID"], payerId: paymentInfo["payerID"]};
      this.userService.renovateBox(renovation).subscribe((token: JWToken) => {
        sessionStorage.setItem("loginToken", token.token);
        this.openSnackBarAndRedirect();

      }, (error) =>{
        this.openSnackBar("Se ha producido un error al actualizar su plan. Pruebe de nuevo.", "Cerrar");
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
    let selectedBox : number = this.boxes.filter(box => box.name == 'BASIC')[0].id;

    let expiredDate : string;
    let today : number = new Date().getTime();
    if(this.userLogged.endingBoxDate.getTime() > today){
      expiredDate = new Date(this.userLogged.endingBoxDate.getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    }else{
      expiredDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    }
    
    let renovation : Renovation = {id: 0, box: selectedBox, expiredDate: expiredDate};
    this.userService.renovateBox(renovation).subscribe((token: JWToken) => {
      sessionStorage.setItem("loginToken", token.token);
      this.openSnackBarAndRedirect();
    }, (error) =>{
      this.openSnackBar("Se ha producido un error al actualizar su plan. Pruebe de nuevo.", "Cerrar");
    });
  }

  validateCode(){
    if(this.codeControl.value != undefined && this.codeControl.value.trim() != ''){
      this._validateCode(this.codeControl.value.trim());
    }else{
      this.codeControl.updateValueAndValidity();
    }
  }


  private _validateCode(code: string) {
    if ( code != undefined || code.trim() != '' ){

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

    }else{
      this.codeControl.updateValueAndValidity();
    }
    
  }

  getErrorCode() : string {
    return this.codeControl.hasError('invalid') ? this.codeControl.getError('invalid') : '' ;
  }

  savePlanCode(){
    let selectedBox : number = this.boxes.filter(box => box.name == this.selectBoxFormControl.value)[0].id;
    
    let expiredDate : string;
    let today : number = new Date().getTime();
    if(new Date(this.userLogged.endingBoxDate).getTime() > today){
      expiredDate = new Date(new Date(this.userLogged.endingBoxDate).getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    }else{
      expiredDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    }

    let renovation : Renovation = {id: 0, box: selectedBox, expiredDate: expiredDate, codeId:this.codeId};


    this.userService.renovateBox(renovation).subscribe((token: JWToken) => {
      sessionStorage.setItem("loginToken", token.token);
      this.openSnackBarAndRedirect();
    }, (error) =>{
      this.openSnackBar("Se ha producido un error al actualizar su plan. Pruebe de nuevo.", "Cerrar");
    });
  }

}