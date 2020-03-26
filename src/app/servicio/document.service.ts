import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../dominio/document.domain'

@Injectable({providedIn:'root'})

export class DocumentService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    createDocument(idSprint: number): Observable<Document> {
        return this.httpClient.post<Document>(this.cabeceraService.getCabecera() + "api/document/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editBoard(doc: Document): Observable<Document> {
        return this.httpClient.put<Document>(this.cabeceraService.getCabecera() + "api/document/" + doc.id, doc, {headers: this.cabeceraService.getBasicAuthentication()});
    }
    
    deleteBoard(id: number): Observable<Document> {
        return this.httpClient.delete<Document>(this.cabeceraService.getCabecera() + "api/document/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getDocumentsBySprint(idSprint: number): Observable<Document[]> {
        return this.httpClient.get<Document[]>(this.cabeceraService.getCabecera() + "api/document/sprint/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }
}