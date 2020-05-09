import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../servicio/user.service';
import { UserLog, JWToken } from '../dominio/jwt.domain';
import { SecurityBreachService } from '../servicio/breach.service';
import { Breach } from '../dominio/breach.domain';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.html',
    styleUrls: ['./login-dialog.css']
  })
  export class LoginDialog implements OnInit{

    email = new FormControl('', { validators: [Validators.required, Validators.email]});
    pass = new FormControl('', { validators: [Validators.required] });
    showPass : boolean = false;
    warning: string;
    breach: Breach;
    activated: boolean;

    disabled: boolean;


    constructor(
      public dialogRef: MatDialogRef<LoginDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService,
      private securityBreachService: SecurityBreachService) {}


    ngOnInit(): void {
      this.securityBreachService.getSecurityBreach().subscribe((breach: Breach) => {
        this.breach = breach;
        this.activated = breach.activated;
        if (this.activated) {
          this.warning = breach.message;
        }
      });

    }

    cancel(): void {
      this.dialogRef.close();
    }

    login() : void {
      this.disabled = true;
      let user : UserLog = {username: this.email.value, password: this.pass.value}
      this.userService.getToken(user).subscribe((token: JWToken)=>{
        sessionStorage.setItem("loginToken", token.token);
        this.dialogRef.close();
      }, (error) => {
        this.disabled = false;
        this.pass.setErrors({invalid: true});
      });
    }

    updateValidationInvalidPassword(): void {
      this.pass.setErrors({invalid: true});
      this.pass.updateValueAndValidity();
    }

    validForm(): boolean{
      let valid: boolean = true;

        valid = valid && this.email.valid;
        valid = valid && this.pass.valid;
      

      return valid
    }
    
    abled(): boolean{
      if(this.disabled){
        return true;
      }else{
        return !this.validForm();
      }
    }

    changePassState(){
        this.showPass = !this.showPass;
    }

    getErrorMessageEmail() : string{
      return this.email.hasError('required')? "Debe introducir un email": this.email.hasError('email') ? "El email debe tener un formato válido": "";
    }
    getErrorMessagePass(): string{
      return this.pass.hasError('required')? "Debe introducir una contraseña": this.pass.hasError('invalid')? "Email o contraseña no encontrado, verifique los datos.":"";
    }

}
