import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { createContentChild } from '@angular/compiler/src/core';
import { NoteDisplay } from '../dominio/note.domain';

@Injectable({providedIn:'root'})

export class NoteService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

        /*createNote(note: NoteDisplay): Observable<NoteDisplay>{
            return this.httpClient.post<NoteDisplay>(this.cabeceraService.getCabecera), note,  {headers: this.cabeceraService.getBasicAuthentication()});

        }*/
}