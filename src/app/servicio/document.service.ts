import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../dominio/document.domain'

@Injectable({ providedIn: 'root' })

export class DocumentService {

    constructor(private httpClient: HttpClient, private cabeceraService: CabeceraService) { }

    createDocument(idSprint: number, doc: Document): Observable<Document> {
        return this.httpClient.post<Document>(this.cabeceraService.getCabecera() + "api/document/" + idSprint, doc, { headers: this.cabeceraService.getBasicAuthentication() });
    }

    editDocument(doc: Document): Observable<Document> {
        return this.httpClient.put<Document>(this.cabeceraService.getCabecera() + "api/document/" + doc.id, doc, { headers: this.cabeceraService.getBasicAuthentication() });
    }

    deleteDocument(id: number): Observable<Document> {
        return this.httpClient.delete<Document>(this.cabeceraService.getCabecera() + "api/document/" + id, { headers: this.cabeceraService.getBasicAuthentication() });
    }

    getDocumentsBySprint(idSprint: number): Observable<Document[]> {
        return this.httpClient.get<Document[]>(this.cabeceraService.getCabecera() + "api/document/sprint/" + idSprint, { headers: this.cabeceraService.getBasicAuthentication() });
    }

    getDocuments(idDoc: number): Observable<Document> {
        return this.httpClient.get<Document>(this.cabeceraService.getCabecera() + "api/document/doc/" + idDoc, { headers: this.cabeceraService.getBasicAuthentication() });
    }

    downloadDocument(id: number): any {
        return this.httpClient.get(this.cabeceraService.getCabecera() + "api/document/doc-pdf/" + id, { responseType: 'blob', headers: this.cabeceraService.getBasicAuthentication() });
    }

    getTodayDaily(idsprint: number): Observable<number> {
        return this.httpClient.get<number>(this.cabeceraService.getCabecera() + "api/document/daily/" + idsprint, { headers: this.cabeceraService.getBasicAuthentication() });
    }

}