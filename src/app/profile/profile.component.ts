import { Component, OnInit } from '@angular/core';
import { UserService } from '../servicio/user.service';
import { ProfileService } from '../servicio/profile.service';
import { User, UserIdUser } from '../dominio/user.domain';
import { Profile, ProfileSave } from '../dominio/profile.domain';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { UserLogged } from '../dominio/jwt.domain';

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

  constructor(private userService: UserService, private profileService: ProfileService, private router: Router, private _snackBar: MatSnackBar, private _location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

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

}
