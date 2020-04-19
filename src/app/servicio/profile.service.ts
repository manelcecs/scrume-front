import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { Profile, ProfileSave } from '../dominio/profile.domain';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({providedIn:'root'})

export class ProfileService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    editProfile(profile: Profile): Observable<Profile> {
        return this.httpClient.put<Profile>(this.cabeceraService.getCabecera() + "api/user/" + profile.id, profile, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProfile(idPro: number): Observable<Profile> {
        return this.httpClient.get<Profile>(this.cabeceraService.getCabecera()+ "api/user/" + idPro, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    createProfile(profile: ProfileSave): Observable<ProfileSave> {
        return this.httpClient.post<ProfileSave>(this.cabeceraService.getCabecera()+ "api/user" , profile, {headers: this.cabeceraService.getBasicAuthentication()});
    }
}

@Injectable({providedIn: 'root'})
export class ProfileResolverService implements Resolve<any>{

    constructor(private profileService: ProfileService, private userService: UserService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        let userId = this.userService.getUserLogged().idUser;
        return this.profileService.getProfile(userId);
    }
}