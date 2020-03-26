import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Team } from '../dominio/team.domain';
import { Router } from '@angular/router';
import { TeamService } from '../servicio/team.service';
import { ProjectDto } from '../dominio/project.domain';
import { Board, BoardSimple } from '../dominio/board.domain';
import { Sprint, SprintDisplay } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import { ProjectService } from '../servicio/project.service';
import { Observable } from 'rxjs';
import { BoardService } from '../servicio/board.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvitationDto } from '../dominio/invitation.domain';
import { FormControl, Validators } from '@angular/forms';
import { UserNick } from '../dominio/user.domain';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { InvitationService } from '../servicio/invitation.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
//De document
import { DomSanitizer } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  options = {
    autoClose: true,
    keepAfterRouteChange: true
};
  teams: Team[];
  boardNumber: number;

  constructor(private router: Router,
    private teamService: TeamService,
    private sprintService: SprintService,
    private projectService: ProjectService,
    private boardService: BoardService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe((teams : Team[] )=>{
      this.teams = teams;
      for(let t of this.teams){
        this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) =>{
          t.projects = projects;
          console.log("Asignados los proyectos "+projects+" al equipo "+t.name);
        });
      }
    }, (error)=>{
      console.log("Error al hacer la petición a BD. "+error);
      //error("Error al hacer la petición a BD.", this.options);
    });
    }; //añadir subscribe((teams:IPaginationPage<Teams>)=>{this.teams = teams});

//BORRAR
// descargarPDF():void {
//   const data = 'some text';
//   var blob = new Blob([data], { type: "application/pdf"});
//   this.ss = blob;
//   this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
// }

// generarPDF(){
//   html2canvas(document.getElementById('paper'), {
//      // Opciones
//      allowTaint: true,
//      useCORS: false,
//      // Calidad del PDF
//      scale: 1
//   }).then(function(canvas) {
//   //var img = canvas.toDataURL("image/png");
//   var doc = new jsPDF();
//   //doc.addImage(img,'PNG',7, 20, 195, 105);
//   doc.save('prueba.pdf');
//  });
//}

  value;

  generarPDF(){
    var doc = new jsPDF();
    doc.fromHTML(document.getElementById('paper'),10,10);
    doc.save('prueba.pdf');
  }

  pasarPagina(){
    let aux = document.getElementById('palabras');
    var height = window.getComputedStyle(aux, null).getPropertyValue("height");
    if(height == "456px"){
      aux.style.backgroundColor = 'red';
    }
  }

  onKey(value: string){
    if(value.substring(value.length-1, value.length) == "\n"){
      this.value = value + "\n";
    } else{
      this.value = value;
    }
  }

  insertEnter(value: string){
   let aux = document.getElementById('palabras');
   this.value = value + "\n";
  }
  //-----------------

  createTeam(): void {
    this.router.navigate(['teamsCreate']);
  }

  editTeam(row: Team): void{
    this.router.navigate(['teamsCreate'], {queryParams: {id: row.id}});
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  openProject(proj: ProjectDto): void{
    console.log(JSON.stringify(proj));
    this.router.navigate(['project'], {queryParams: {id: proj.id}});
  }

  createProject(team: Team): void{
    this.router.navigate(['createProject'], {queryParams: {id: team.id, action: "create"}});
  }

  openBoard(idProj: number): void{
    this.boardService.getBoardByProject(idProj).subscribe((board: BoardSimple)=>{
      this.boardNumber = board.id;
      this.router.navigate(['board'], {queryParams: {id: this.boardNumber}});
    });
  }

  openSprint(proj: ProjectDto): void{
    let idSprint : number;
    this.sprintService.getSprintsOfProject(proj.id).subscribe((sprints: SprintDisplay[])=>{
      idSprint = sprints[sprints.length-1].id;
      this.router.navigate(['sprint'], {queryParams:{id : idSprint}});
    });
  }

  getProjectsOfTeam(id: number): Observable<ProjectDto[]>{
    return this.projectService.getProjectsByTeam(id);
  }

  deleteTeam(idTeam : number): void {
    this.teamService.deleteTeam(idTeam).subscribe(() => {
      this.teamService.getAllTeams().subscribe((teams : Team[] )=>{
        this.teams = teams;
        for(let t of this.teams){
            this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) =>{
            t.projects = projects;
          });
        }
      });
    });
  }

  openDialogInvite(idTeam: number): void {
    this.dialog.open(InvitationDialog, {
      width: '250px',
      data: idTeam
    });
  }
}


@Component({
  selector: 'invite-dialog',
  templateUrl: 'invite-dialog.html',
  styleUrls: ['./invite-dialog.css']
})
export class InvitationDialog implements OnInit{

  team: number;
  invitation : InvitationDto;
  //users : number[];
  usersBD : UserNick[];
  searchValue;
  messageFormControl = new FormControl('', {validators: [Validators.required]});
  // suggestedUsers : Observable<UserNick[]>;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('', {validators: [Validators.required]});
  filteredUsers: Observable<UserNick[]>;
  users: UserNick[] = [];
  allUsers: UserNick[] = [{id:0, nick:"jualorper"}];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InvitationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number, private invitationService : InvitationService) {
      this.team = this.data;
      this.invitationService.getSuggestedUsers(this.team).subscribe((res : UserNick[]) => {
        this.allUsers = res;
        this.filteredUsers = this.fruitCtrl.valueChanges.pipe(
          startWith(null),
          map((user: UserNick | null) => user ? this._filter(user) : this.allUsers.slice()));
      })
    }


  ngOnInit(): void {
    // this.team = this.data;
    // this.invitationService.getSuggestedUsers(this.team).subscribe((users : UserNick[]) =>{
    //   this.usersBD = users;
    //   console.log(this.usersBD);
    // })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;



    // Add our fruit
    if ((value || '').trim()) {
      this.users.push();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }


  remove(user: UserNick): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: UserNick): UserNick[] {
    const filterValue = value.nick.toLowerCase();

    return this.allUsers.filter(user => user.nick.toLowerCase().indexOf(filterValue) === 0);
  }

  onSaveClick() : void {
    let recipients : number[] = [];
    this.users.forEach(user => recipients.push(user.id));
    let invitation : InvitationDto= {message: this.messageFormControl.value, team: this.team, recipients: recipients};
    this.invitationService.createInvitation(invitation).subscribe(() => {
      this.dialogRef.close();
    });

  }
  // getErrorMessageStartDate() : string {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':'';
  // };

  // getErrorMessageEndDate() : string {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':'';
  // }

  // validForm():boolean {

  //    let valid: boolean;

  //    valid = this.messageFormControl.valid && this.userFormControl.valid;
  //    return valid;

  //  }

  // validateToday(): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     console.log("Prueba 2")
  //     let isValid = true;

  //     if (control.value.getTime() < Date.now()) {
  //       isValid = false;
  //     }
  //     return isValid ? null : { 'past': 'the date cant be past' }
  //   };
  // }

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
