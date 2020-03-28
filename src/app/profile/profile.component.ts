import { Component, OnInit } from '@angular/core';
import { UserService } from '../servicio/user.service';
import { ProfileService } from '../servicio/profile.service';
import { UserNick } from '../dominio/user.domain';
import { Profile } from '../dominio/profile.domain';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: Profile;

  constructor(private userService: UserService, private profileService: ProfileService) { }

  ngOnInit(): void {

    this.userService.findUserAuthenticated().subscribe((user: UserNick)=>{
      this.profileService.getProfile(user.idUser).subscribe((profile: Profile)=>{
        this.profile = profile;
        console.log(JSON.stringify(this.profile));
      });
    });

  }

}
