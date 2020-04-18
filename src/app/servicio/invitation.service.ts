import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { InvitationDisplay, InvitationDto, AnswerInvitation } from '../dominio/invitation.domain';
import { UserNick } from '../dominio/user.domain';

@Injectable({providedIn:'root'})

export class InvitationService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getInvitations() : Observable<InvitationDisplay[]> {
        return this.httpClient.get<InvitationDisplay[]>(this.cabeceraService.getCabecera() + "api/team/list-invitations", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    createInvitation(invitation : InvitationDto) : Observable<InvitationDto> {
      return this.httpClient.post<InvitationDto>(this.cabeceraService.getCabecera() + "api/team/invite",invitation, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    answerInvitation(idInvitation : number, answer : AnswerInvitation) : Observable<AnswerInvitation>{
      return this.httpClient.put<AnswerInvitation>(this.cabeceraService.getCabecera() + "api/team/answer-invitation/" + idInvitation, answer,  {headers: this.cabeceraService.getBasicAuthentication()});

    }

    getSuggestedUsers(idTeam: number, users: UserNick[], word: string) : Observable<UserNick[]> {
      let usersid: number[] = [];
      users.forEach(user => usersid.push(user.id));
      let data = {"team" : idTeam, "users" : usersid, "word" : word};
      return this.httpClient.post<UserNick[]>(this.cabeceraService.getCabecera() + "api/team/findByNick", data, {headers: this.cabeceraService.getBasicAuthentication()});
    }


}

