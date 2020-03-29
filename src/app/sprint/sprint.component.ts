import { Component, OnInit, Inject } from '@angular/core';
import { Sprint, SprintDisplay, SprintJsonDates } from '../dominio/sprint.domain';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewSprintDialog } from '../project/project.component';
import { SprintService } from '../servicio/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardSimple, BoardNumber, Board } from '../dominio/board.domain';
import { BoardService } from '../servicio/board.service';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { Document } from '../dominio/document.domain'
import { LOCALE_ID } from '@angular/core';
import { DocumentService } from '../servicio/document.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  sprint: SprintDisplay;
  idSprint: number;
  board: BoardSimple[];
  boardDelete: BoardNumber;
  doc: Document[];
  document: Document;


  constructor(private sprintService: SprintService, private boardService: BoardService, private documentService: DocumentService, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {

      if (param.id != undefined) {
        this.idSprint = param.id;

        this.sprintService.getSprint(this.idSprint).subscribe((sprintDisplay: SprintDisplay) => {
          this.sprint = sprintDisplay;

        });

        //lista de boards

        this.boardService.getBoardBySprint(this.idSprint).subscribe((board: BoardSimple[]) => {
          this.board = board;
        });

        //lista de documents

        this.documentService.getDocumentsBySprint(this.idSprint).subscribe((doc: Document[]) => {
          this.doc = doc;
        });

      } else {
        this.navigateTo("bienvenida");
      }
    }
    )
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditSprintDialog, {
      width: '250px',
      data: this.sprint
    });
    dialogRef.afterClosed().subscribe(() => {
      this.sprintService.getSprint(this.idSprint).subscribe((sprintDisplay: SprintDisplay) => {
        this.sprint = sprintDisplay;
      });
    });
  }

  openProject(proj: number): void {
    this.router.navigate(['project'], { queryParams: { id: proj } });
  }

  openTeam(team: number): void {
    this.router.navigate(['team'], { queryParams: { id: team } });
  }

  //Board-----------------------------------------------------------------------------------------------------------------------------------

  openBoard(board: number): void {
    this.router.navigate(['board'], { queryParams: { id: board, idSprint: this.idSprint } });
  }

  createBoard(row: SprintDisplay): void {
    this.router.navigate(['createBoard'], { queryParams: { id: row.id } });
  }

  editBoard(row: BoardNumber, sprint: SprintDisplay): void {
    this.router.navigate(['createBoard'], { queryParams: { idBoard: row.id, idSprint: sprint.id } });
  }

  deleteBoard(board: BoardNumber): void {

    this._deleteBoard(board.id).subscribe((board: BoardNumber) => {

      this.boardDelete = board;

      this.sprintService.getSprint(this.idSprint).subscribe((sprintDisplay: SprintDisplay) => {
        this.sprint = sprintDisplay;

      });

      this.boardService.getBoardBySprint(this.idSprint).subscribe((board: BoardSimple[]) => {
        this.board = board;
      });

      this.documentService.getDocumentsBySprint(this.idSprint).subscribe((doc: Document[]) => {
        this.doc = doc;
      });

    });

  }

  private _deleteBoard(id: number): Observable<BoardNumber> {
    return this.boardService.deleteBoard(id);
  }

  //Document------------------------------------------------------------------------------------------------------------

  deleteDoc(id: number): void {

    this._deleteDoc(id).subscribe((doc: Document) => {
      this.document = doc;

      this.sprintService.getSprint(this.idSprint).subscribe((sprintDisplay: SprintDisplay) => {
        this.sprint = sprintDisplay;

      });

      this.boardService.getBoardBySprint(this.idSprint).subscribe((board: BoardSimple[]) => {
        this.board = board;
      });

      this.documentService.getDocumentsBySprint(this.idSprint).subscribe((doc: Document[]) => {
        this.doc = doc;
      });

    });

  }

  private _deleteDoc(id: number): Observable<Document> {
    return this.documentService.deleteDocument(id);
  }

  openDialogDoc(sprint: SprintDisplay): void {
    const dialogRef = this.dialog.open(NewDocumentDialog, {
      width: '250px',
      data: sprint.id
    });
    dialogRef.afterClosed().subscribe(() => {
      
      this.documentService.getDocumentsBySprint(this.idSprint).subscribe((doc: Document[]) => {
        this.doc = doc;
      });

    });

  }

  openDocument(doc: number): void {
    this.router.navigate(['document'], { queryParams: { id: doc } });
  }

}

//Dialog de Crear Document--------------------------------------------------------------------------------

@Component({
  selector: 'new-document-dialog',
  templateUrl: 'new-document-dialog.html',
  styleUrls: ['./new-document-dialog.css']
})
export class NewDocumentDialog implements OnInit{

  idSprint: number;

  document: Document;
  board: BoardSimple[];
  doc: Document[];

  tipos: string[];
  review: string;

  selected: string;
  cont: string;

  tipo = new FormControl('',  { validators: [Validators.required]});

  constructor(
    public dialogRef: MatDialogRef<NewDocumentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private documentService: DocumentService, private boardService: BoardService, private router: Router) {}


  ngOnInit(): void {
    this.idSprint = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(select: string) : void {
    if(select == "REVIEW") {
      let json = {
        done: "",
        noDone: "",
        rePlanning: ""
      }
      this.cont = JSON.stringify(json);
    }else if(select == "RETROSPECTIVE"){
      let json = {
        good: "",
        bad: "",
        improvement: ""
      }
      this.cont = JSON.stringify(json);
    }else if(select == "DAILY"){
      let json = {
        name: "",
        done: "",
        todo: "",
        problem: ""
      }
      this.cont = JSON.stringify(json);
    }else{
      let json = {
        entrega: "",
        conseguir: ""
      }
      this.cont = JSON.stringify(json);
    }

    this.document = {
      id: 0,
      name: "Añade aquí el nombre",
      content: this.cont,
      sprint: this.idSprint,
      type: select
    }

    this.documentService.createDocument(this.idSprint, this.document).subscribe((doc: Document) => {
      this.document = doc;

      this.dialogRef.close();

    });

  }

}

//Dialog de Sprint-----------------------------------------------------------------------------------------


@Component({
  selector: 'edit-sprint-dialog',
  templateUrl: 'edit-sprint-dialog.html',
  styleUrls: ['./edit-sprint-dialog.css']
})
export class EditSprintDialog implements OnInit {

  idSprint: number;
  sprint: SprintJsonDates;
  //FIXME: Arreglar los validators
  startDate = new FormControl('', { validators: [Validators.required, this.validateToday] });
  endDate = new FormControl('', { validators: [Validators.required, this.validateToday, this.validateStartBeforeEnd] });

  constructor(
    public dialogRef: MatDialogRef<EditSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SprintDisplay,
    private sprintService: SprintService) { }


  ngOnInit(): void {
    this.idSprint = this.data.id;
    this.startDate.setValue(new Date(this.data.startDate));
    this.endDate.setValue(new Date(this.data.endDate));

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.sprint = { id: this.idSprint, startDate: new Date(this.startDate.value).toISOString(), endDate: new Date(this.endDate.value).toISOString() }
    this.sprintService.editSprint(this.idSprint, this.sprint).subscribe((sprint: Sprint) => {
      //FIXME: Recargar la pagina
      this.dialogRef.close();
    });

  }

  getErrorMessageStartDate(): String {
    return this.startDate.hasError('required') ? 'Este campo es obligatorio' : this.startDate.hasError('past') ? 'La fecha no puede ser en pasado' : this.startDate.hasError('invalid') ? 'La fecha de fin no puede ser anterior a la de inicio' : '';
  };

  getErrorMessageEndDate(): String {
    return this.startDate.hasError('required') ? 'Este campo es obligatorio' : this.startDate.hasError('past') ? 'La fecha no puede ser en pasado' : '';
  }

  validForm(): boolean {
    let valid: boolean;
    valid = this.endDate.valid && this.startDate.valid;
    return valid;
  }

  validateToday(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = true;

      if (control.value.getTime() < new Date(Date.now()).getTime()) {
        isValid = false;
      }
      return isValid ? null : { 'past': 'the date cant be past' };
    };
  }

  validateStartBeforeEnd(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let isValid = true;
      if (control.value.getTime() > this.endDate.value.getTime()) {
        isValid = false;
      }
      return isValid ? null : { 'invalid': 'Invalid dates' };

    };
  }

  //Validartor que compruebe si puede crear un sprnt en esas fechas con una query
  // validateStartBeforeEnd(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     let isValid = true;
  //     if (control.value.getTime() > this.endDate.value.getTime()) {
  //       isValid = false;
  //     }
  //     return isValid ? null : { 'invalid': 'Invalid dates' }

  //   };
  // }

}
