import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { createContentChild } from '@angular/compiler/src/core';
import { NoteDisplay } from '../dominio/note.domain';
import { User } from '../dominio/user.domain';

@Injectable({providedIn:'root'})

export class NoteService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

        listNotes(): Observable<NoteDisplay[]> {
            return this.httpClient.get<NoteDisplay[]>(this.cabeceraService.getCabecera() + "api/personalList", {headers: this.cabeceraService.getBasicAuthentication()});
        }

        deleteNote(idNote: number): Observable<NoteDisplay>{
            return this.httpClient.delete<NoteDisplay>(this.cabeceraService.getCabecera() + "api/personalList" + idNote, {headers: this.cabeceraService.getBasicAuthentication()});
        }

        createNote(content: string): Observable<NoteDisplay>{
            return this.httpClient.post<NoteDisplay>(this.cabeceraService.getCabecera() + "api/personalList", content, {headers: this.cabeceraService.getBasicAuthentication()});
        }

        updateNote(idNote: number, content: string): Observable<NoteDisplay>{
            return this.httpClient.put<NoteDisplay>(this.cabeceraService.getCabecera() + "api/listPersonal" + idNote, {headers: this.cabeceraService.getBasicAuthentication()});
        }
}