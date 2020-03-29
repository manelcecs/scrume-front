import { Component, OnInit } from '@angular/core';
import { UserService } from '../servicio/user.service';
import { ProfileService } from '../servicio/profile.service';
import { UserNick, User, UserIdUser } from '../dominio/user.domain';
import { Profile, ProfileSave } from '../dominio/profile.domain';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

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

  name: FormControl = new FormControl('', { validators: [Validators.required] });
  nick: FormControl = new FormControl('', { validators: [Validators.required] });
  surnames: FormControl = new FormControl('', { validators: [Validators.required] });
  photo: FormControl = new FormControl('', { validators: [Validators.pattern(/^(https?:\/\/)/), Validators.maxLength(256)] });
  gitUser: FormControl = new FormControl('');
  lastPass: FormControl = new FormControl('');
  newPass: FormControl = new FormControl('', { validators: [Validators.pattern(/^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/)] });

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

      this.userService.findUserAuthenticated().subscribe((user: UserIdUser) => {
        this.profileService.getProfile(user.idUser).subscribe((profile: Profile) => {
          this.profile = profile;

          this.message = "Perfil actualizado.";
          this.close = "Cerrar";

          console.log(JSON.stringify(this.profile));

          this.name.setValue(this.profile.name);
          this.nick.setValue(this.profile.nick);
          this.surnames.setValue(this.profile.surnames);
          this.photo.setValue(this.profile.photo);
          this.gitUser.setValue(this.profile.gitUser);

          let token = sessionStorage.getItem("loginToken");

        });
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

    console.log(JSON.stringify("la editada " + JSON.stringify(this.profile)));

    this.profileService.editProfile(this.profile).subscribe((pro: Profile) => {
      this.profile = pro;


    }, (error) => {
      this.lastPass.setErrors({ invalid: true });
      this.newPass.setErrors({ invalid: true });
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

    valid = valid && this.name.valid && this.nick.valid && this.surnames.valid;
    return valid;

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getErrorMessageName(): String {
    return this.name.hasError('required') ? 'Este campo es requerido.' :
      this.nick.hasError('required') ? 'Este campo es requerido.' :
        this.surnames.hasError('required') ? 'Este campo es requerido.' :
          this.photo.hasError('pattern') ? 'Debe de ser una imagen.' :
            this.photo.hasError('maxlength') ? 'No puede tener más de 256 caracteres.' :
              this.newPass.hasError('pattern') ? 'Debe de contener al menos 8 caracteres, una mayuscula, una minuscula y un número.' : '';
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

  getErrorNewPass() {
    return this.lastPass.hasError('invalid') ? 'La contraseña es incorrecta.' : '';
  }

}
