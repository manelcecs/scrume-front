import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { Code } from '../dominio/box.domain';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn:'root'})

export class CodeService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    validateCode(code: string): Observable<number> {
        return this.httpClient.get<number>(this.cabeceraService.getCabecera() 
            + "api/discount-code/isAValidCode/" + code);

    }


    createCode(code: Code): Observable<Code> {
        return this.httpClient.post<Code>(this.cabeceraService.getCabecera() 
        + "api/discount-code/", code, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllCodes(): Observable<Code []> {
        return this.httpClient.get<Code []>(this.cabeceraService.getCabecera() 
        + "api/discount-code/showAll", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteCode(code: Code): Observable<void> {
        return this.httpClient.delete<void>(this.cabeceraService.getCabecera() 
        + "api/discount-code/" + code.id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

}

@Injectable({providedIn: 'root'})
export class CodeResolverService implements Resolve<any>{

    constructor(private code: CodeService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        return this.code.getAllCodes();
    }
}