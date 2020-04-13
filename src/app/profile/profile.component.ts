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
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UserLogged, JWToken } from '../dominio/jwt.domain';
import { Box } from '../dominio/box.domain';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ValidationService } from '../servicio/validation.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  message: string;
  close: string;

  profile: Profile;
  profileSave: ProfileSave;
  idUserAccount: number;

  name: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25)] });
  nick: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25), Validators.pattern(/^\S+$/)] });
  surnames: FormControl = new FormControl('', { validators: [Validators.required, Validators.maxLength(25)] });
  photo: FormControl = new FormControl('', { validators: [Validators.pattern(/^(https?:\/\/)/), Validators.maxLength(255)] });
  gitUser: FormControl = new FormControl('', {validators: [Validators.pattern(/^\S+$/)]});
  lastPass: FormControl = new FormControl('');
  newPass: FormControl = new FormControl('', { validators: [Validators.pattern(/\d/),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[A-Z]/),
    Validators.minLength(8)] });

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
    private personalService: PersonalService,public dialog: MatDialog, private validationService: ValidationService ) { }

  ngOnInit(): void {

    this.userLogged = this.userService.getUserLogged();
    this.selectBoxFormControl.setValue(this.userLogged.nameBox);
    this.userService.getAllBoxes().subscribe((boxes: Box[]) => {
      this.boxes = boxes;
      this.initConfig();
    });

    this.isBoxExpired = this.validationService.isBoxExpired();

    this.activatedRoute.queryParams.subscribe(params => {

      this.idUserAccount = params.id;

      if(params.id != undefined){

        this.profileSave = {
          id: 0,
          gitUser: "",
          idUserAccount: this.idUserAccount,
          name: "",
          nick: "",
          photo: "",
          surnames: ""
        }

        this.profileService.createProfile(this.profileSave).subscribe((profile: ProfileSave)=>{
          this.profileSave = profile;
        });

      }


        this.profileService.getProfile(this.userService.getUserLogged().idUser).subscribe((profile: Profile) => {
          this.profile = profile;

          this.message = "Perfil actualizado.";
          this.close = "Cerrar";

          this.name.setValue(this.profile.name);
          this.nick.setValue(this.profile.nick);
          this.surnames.setValue(this.profile.surnames);
          this.photo.setValue(this.profile.photo);
          this.gitUser.setValue(this.profile.gitUser);

        });
      });

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


    }, (error) => {
      if(error.error.message == "The current password does not match the one stored in the database") {
        this.lastPass.setErrors({ invalid: true });
      }else if(error.error.message == "The new password must have an uppercase, a lowercase, a number and at least 8 characters"){
        this.newPass.setErrors({ invalid: true });
      }
    },
      () => {
        if (this.newPass.value == "") {
          console.log("se queda igual la contraseña");
        } else {
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
    this.photo.hasError('pattern') ? 'Debe de ser una imagen que empieza por http.' :
    this.photo.hasError('maxlength') ? 'No puede tener más de 256 caracteres.' :
    this.nick.hasError('maxlength') ? 'No puede tener más de 25 caracteres.' :
    this.nick.hasError('pattern') ? 'No puede tener espacios en blanco.' :
    this.nick.hasError('required') ? 'Este campo es requerido.' :
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
      console.log(this.personal);
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
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: "250px",
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log("holii");
    });
  }

  //Renovación del plan------------------------------------------------------------------------------------------
  initConfig(): void {
    let paymentInfo;
    let priceSelectedBox : number;
    let selectedBox : number = this.boxes.filter(box => box.name == this.selectBoxFormControl.value)[0].id;
    priceSelectedBox = this.boxes.filter(box => box.name == this.selectBoxFormControl.value)[0].price;
    console.log("Selected",selectedBox);
    console.log("Price", priceSelectedBox);
    console.log("FormControl", this.selectBoxFormControl.value);
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
      let expiredDate : string = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
      let renovation : Renovation = {id: 0, box: selectedBox, expiredDate: expiredDate, orderId: paymentInfo["orderID"], payerId: paymentInfo["payerID"]};
      this.userService.renovateBox(renovation).subscribe((token: JWToken) => {
        sessionStorage.setItem("loginToken", token.token);
        this.openSnackBarAndRedirect();

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
    let expiredDate : string = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString();
    let renovation : Renovation = {id: 0, box: selectedBox, expiredDate: expiredDate};
    this.userService.renovateBox(renovation).subscribe((token: JWToken) => {
      sessionStorage.setItem("loginToken", token.token);
      this.openSnackBarAndRedirect();
    });
  }

}

//Dialog de Confirmation-----------------------------------------------------------------------------------------

@Component({
  selector: "confirmation",
  templateUrl: "confirmation.html",
  styleUrls: ["./confirmation.css"]
})
export class ConfirmationDialog implements OnInit {

  routes: Object[] = [];
  user: User;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>, private personalService: PersonalService, private router: Router) {}

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.personalService.getAnonymize().subscribe(()=> {
      this.dialogRef.close();
      this.logOut();
    })
  }

  logOut(): void{
    sessionStorage.setItem("loginToken", "");
    this.user = undefined;
    window.location.reload();
  }

  navigateTo(route: string, method?: string, id?: number): void{
    if(method==undefined && id == undefined){
      this.router.navigate([route]);
    }else if(method != undefined && id == undefined){
      this.router.navigate([route], {queryParams:{method: method}});
    }else if(method == undefined && id != undefined){
      this.router.navigate([route], {queryParams:{id: id}});
    }else if(method != undefined && id != undefined){
      this.router.navigate([route], {queryParams:{method: method, id: id}});
    }
  }

}
