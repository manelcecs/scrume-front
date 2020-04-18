import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { NoteDisplay } from '../dominio/note.domain';

@Injectable({providedIn:'root'})

export class NoteService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

        listNotes(): Observable<NoteDisplay[]> {
            return this.httpClient.get<NoteDisplay[]>(this.cabeceraService.getCabecera() + "api/note/showAll", {headers: this.cabeceraService.getBasicAuthentication()});
        }

        getNote(idNote: number): Observable<NoteDisplay> {
            return this.httpClient.get<NoteDisplay>(this.cabeceraService.getCabecera() + "api/note/" + idNote, {headers: this.cabeceraService.getBasicAuthentication()});
        }

        deleteNote(idNote: number): Observable<NoteDisplay>{
            return this.httpClient.delete<NoteDisplay>(this.cabeceraService.getCabecera() + "api/note/" + idNote, {headers: this.cabeceraService.getBasicAuthentication()});
        }

        createNote(note: NoteDisplay): Observable<NoteDisplay>{
            return this.httpClient.post<NoteDisplay>(this.cabeceraService.getCabecera() + "api/note", note, {headers: this.cabeceraService.getBasicAuthentication()});
        }

        updateNote(note: NoteDisplay, idNote: number): Observable<NoteDisplay>{
            return this.httpClient.put<NoteDisplay>(this.cabeceraService.getCabecera() + "api/note/" + idNote, note, {headers: this.cabeceraService.getBasicAuthentication()});
        }
}