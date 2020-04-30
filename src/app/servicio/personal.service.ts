import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CabeceraService } from './cabecera.service';
import { PersonalDataAll } from '../dominio/personal.domain';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn:'root'})

export class PersonalService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getAllMyData(): Observable<PersonalDataAll> {
        return this.httpClient.get<PersonalDataAll>(this.cabeceraService.getCabecera() + "api/user/all-my-data", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAnonymize(): any {
        return this.httpClient.get<any>(this.cabeceraService.getCabecera() + "api/user/anonymize", {headers: this.cabeceraService.getBasicAuthentication()});
    }

}

@Injectable({providedIn: 'root'})
export class PersonalResolverService implements Resolve<any>{

    constructor(private personalService: PersonalService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.personalService.getAllMyData();
    }
}