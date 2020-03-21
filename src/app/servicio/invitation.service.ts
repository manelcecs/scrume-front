import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { InvitationDisplay, InvitationDto, AnswerInvitation } from '../dominio/invitation.domain';

@Injectable({providedIn:'root'})

export class InvitationService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getInvitations(idUser: number) : Observable<InvitationDisplay[]> {
        return this.httpClient.get<InvitationDisplay[]>(this.cabeceraService.getCabecera() + "api/project", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    createInvitation(invitation : InvitationDto) : Observable<InvitationDto> {
      return this.httpClient.post<InvitationDto>(this.cabeceraService.getCabecera() + "api/project", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    answerInvitation(answer : AnswerInvitation) : Observable<AnswerInvitation>{
      return this.httpClient.post<AnswerInvitation>(this.cabeceraService.getCabecera() + "api/project", {headers: this.cabeceraService.getBasicAuthentication()});

    }


}

