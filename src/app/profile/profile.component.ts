import { Component, OnInit } from '@angular/core';
import { UserService } from '../servicio/user.service';
import { ProfileService } from '../servicio/profile.service';
import { UserNick } from '../dominio/user.domain';
import { Profile } from '../dominio/profile.domain';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  message: string;
  close: string;

  profile: Profile;

  name: FormControl = new FormControl('',{validators: [Validators.required]});
  nick: FormControl = new FormControl('',{validators: [Validators.required]});
  surnames: FormControl = new FormControl('',{validators: [Validators.required]});
  photo: FormControl = new FormControl('', {validators: [Validators.pattern(/^(https?:\/\/)/)]});
  gitUser: FormControl = new FormControl('');

  constructor(private userService: UserService, private profileService: ProfileService, private router: Router, private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit(): void {

    this.userService.findUserAuthenticated().subscribe((user: UserNick)=>{
      this.profileService.getProfile(user.idUser).subscribe((profile: Profile)=>{
        this.profile = profile;

        this.message = "Perfil actualizado."
        this.close = "Cerrar"

        console.log(JSON.stringify(this.profile));

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

    this.profile = { id: this.profile.id,
      idUserAccount: this.profile.idUserAccount,
      gitUser: this.profile.gitUser,
      name: this.profile.name,
      nick: this.profile.nick,
      photo: this.profile.photo,
      surnames: this.profile.surnames
    }

    this.profileService.editProfile(this.profile).subscribe((pro: Profile)=> {
      this.profile = pro;
    });

  }

  cancelEditProfile(){
    this._location.back();
  }

  validForm():boolean {

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
    return this.name.hasError('required')?'Este campo es requerido.':
    this.nick.hasError('required')?'Este campo es requerido.':
    this.surnames.hasError('required')?'Este campo es requerido.':
    this.photo.hasError('pattern')?'Debe de ser una imagen.':'';
  }

}
