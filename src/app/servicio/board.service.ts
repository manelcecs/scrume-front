import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { ColumDto } from '../dominio/colum.domian';
import { Board, BoardSimple, BoardNumber } from '../dominio/board.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class BoardService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}


createBoard(board: BoardNumber): Observable<BoardNumber> {
    return this.httpClient.post<BoardNumber>(this.cabeceraService.getCabecera() + "api/workspace", board, {headers: this.cabeceraService.getBasicAuthentication()});
}

editBoard(board: BoardNumber): Observable<BoardNumber> {
    return this.httpClient.put<BoardNumber>(this.cabeceraService.getCabecera() + "api/workspace/" + board.id, board, {headers: this.cabeceraService.getBasicAuthentication()});
}

deleteBoard(id: number): Observable<BoardNumber> {
    return this.httpClient.delete<BoardNumber>(this.cabeceraService.getCabecera() + "api/workspace/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
}

getBoard(id: number): Observable<Board> {
    return this.httpClient.get<Board>(this.cabeceraService.getCabecera() + "api/workspace/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
}

getBoardBySprint(id: number): Observable<BoardSimple[]> {
    return this.httpClient.get<BoardSimple[]>(this.cabeceraService.getCabecera() + "api/workspace/list/sprint/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
}

}