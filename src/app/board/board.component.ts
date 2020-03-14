import { Component, OnInit } from '@angular/core';
import { ColumDto } from '../dominio/colum.domian';
import { Router } from '@angular/router';
import { BoardService } from '../servicio/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  colums: ColumDto [];

  constructor(private router: Router, private boardService: BoardService) { }

  ngOnInit(): void {
    sessionStorage.setItem("user", "Jonh Doe");
    sessionStorage.setItem("pass", "constrasenya");
    this.colums = this.boardService.getTaskForColums(); //añadir subscribe((colums:Colums)=>{this.colums = colums});
  }

}
