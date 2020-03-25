import { Component, OnInit, Inject, ViewChild  } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.html',
    styleUrls: ['./login-dialog.css']
  })
  export class LoginDialog implements OnInit{
  
    email = new FormControl('', { validators: [Validators.required, Validators.email]});
    pass = new FormControl('', { validators: [Validators.required] });
    showPass : boolean = false;
  

    
    constructor(
      public dialogRef: MatDialogRef<LoginDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  
    ngOnInit(): void {
    }
  
    cancel(): void {
      this.dialogRef.close();
    }
  
    login() : void {
      //TODO: petición para verificar la autenticacion
      sessionStorage.setItem("loginToken", btoa(this.email.value+":"+this.pass.value));
      this.dialogRef.close();
    }

    validForm(): boolean{
      let valid: boolean = true;

      valid = valid && this.email.valid;
      valid = valid && this.pass.valid;

      return valid
    }
    changePassState(){
        this.showPass = !this.showPass;
    }

    getErrorMessageEmail() : string{
      return "";
    }
    getErrorMessagePass(): string{
      return "";
    }
  
}