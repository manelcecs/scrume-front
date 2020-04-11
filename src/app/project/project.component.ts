import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto, ProjectName } from '../dominio/project.domain';
import { SprintService } from '../servicio/sprint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintDisplay, Sprint, SprintJsonDates } from '../dominio/sprint.domain';
import { FormControl, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { ValidationService } from '../servicio/validation.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css', './new-sprint-dialog.css']
})
export class ProjectComponent implements OnInit {
  project : ProjectDto;
  sprints : SprintDisplay[];
  startDate: Date;
  endDate: Date;
  validationCreate: boolean;
  idTeam: number;

  idProject : number;

  constructor(private activatedRoute: ActivatedRoute,
     private router: Router,
     private projectService: ProjectService,
     private sprintService : SprintService,
     public dialog: MatDialog,
     private validationService: ValidationService
    ) {

      this.project = this.activatedRoute.snapshot.data.project;
      this.sprints = this.activatedRoute.snapshot.data.sprints;

      console.log(this.project);
      this.updateValidatorCreate();


    }

  ngOnInit(): void {

  }

  openBacklog(): void{
    this.router.navigate(['backlog'], {queryParams: {id: this.project.id}});
  }

  openTeam(team: number): void {
    this.router.navigate(['team'], { queryParams: { id: team } });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewSprintDialog, {
      width: '250px',
      data: {project:{id:this.project.id, name:this.project.name},startDate: this.startDate, endDate: this.endDate}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.sprintService.getSprintsOfProject(this.project.id).subscribe((sprint:SprintDisplay[])=>{
        this.sprints = sprint;
        this.updateValidatorCreate();
      });
    });
  }

  private updateValidatorCreate(): void {
    this.validationService.checkNumberOfSprints(this.project.team.id, this.sprints.length).subscribe((res: boolean) => {
      this.validationCreate = res;
    })
  }


  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  navigateToSprint(sprint : Sprint) : void {
    this.router.navigate(["sprint"], {queryParams: {id : sprint.id}});
  }

  editProject(project : ProjectDto){
    this.router.navigate(['createProject'], {queryParams: {id: project.id, action:"edit"}});
  }

  deleteProject(idProject : number) {
    this.projectService.deleteProject(idProject).subscribe((project : ProjectDto) => {
      this.navigateTo("teams");
    });
  }


}


// DIALOGO PARA CREAR UN SPRINT
@Component({
  selector: 'new-sprint-dialog',
  templateUrl: 'new-sprint-dialog.html',
  styleUrls: ['./new-sprint-dialog.css']
})
export class NewSprintDialog implements OnInit{

  project: ProjectName;
  sprint: SprintJsonDates;
  startDate = new FormControl('',  { validators: [Validators.required]});
  endDate = new FormControl('',  { validators: [Validators.required] });

  constructor(
    public dialogRef: MatDialogRef<NewSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Sprint,
    private sprintService: SprintService, private router: Router) {}


  ngOnInit(): void {
    this.project = this.data.project;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() : void {
    if (this.validForm()) {

      this.sprint = {id:0, startDate: new Date(this.startDate.value).toISOString(), endDate: new Date(this.endDate.value).toISOString(), project:{id:this.project.id, name:this.project.name}};

      this.sprintService.createSprint(this.sprint).subscribe((sprint : Sprint) => {
        this.dialogRef.close();
        //FIXME: Recargar la pagina
        //this.router.navigate(["project"], {queryParams:{id:this.project.id}});
      });
    }

  }

  getErrorMessageStartDate() : string {
    return this.startDate.hasError('required')?'Este campo es obligatorio':
    this.startDate.hasError('past')?'La fecha no puede ser en pasado':
    this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':
    this.startDate.hasError('usedDates')?'Ya hay un sprint en las fechas seleccionadas':
    this.startDate.hasError('beforeToday') ? "La fecha no puede ser anterior a hoy" : '';
  };

  getErrorMessageEndDate() : string {
    return this.endDate.hasError('required')?'Este campo es obligatorio':
    this.endDate.hasError('past')?'La fecha no puede ser en pasado':
    this.endDate.hasError('usedDates')?'Ya hay un sprint en las fechas seleccionadas':
    this.endDate.hasError('beforeTodayEnd') ? "La fecha no puede ser anterior a hoy" : '';
  }

  validForm():boolean {

    let valid: boolean;

    valid = this.endDate.valid && this.startDate.valid;
    return valid;

  }


  afterTodayStarDateValidator() {
    let formControlToTime : number = new Date(this.startDate.value).getTime();
    let todayToTime : number = new Date().getTime();
    console.log("Validator de hoy:", formControlToTime);
    if (formControlToTime < todayToTime) {
      this.startDate.setErrors({'beforeToday':true});
    } else {
      this.startDate.updateValueAndValidity();
    }
    console.log("ERrores start", this.startDate.errors);
  }

  afterTodayEndDateValidator() {
    let formControlToTime : number = new Date(this.endDate.value).getTime();
    let todayToTime : number = new Date().getTime();
    console.log("Validator de hoy:", formControlToTime);
    if (formControlToTime < todayToTime) {
      this.endDate.setErrors({'beforeTodayEnd':true});
    } else {
      this.endDate.updateValueAndValidity();
    }
    console.log("Errores end", this.endDate.errors);
  }


  validDatesValidator() {
    console.log("Validator de dates");
    this.sprintService.checkDates(this.project.id, this.startDate.value, this.endDate.value).subscribe((res : boolean) => {
      console.log("Res:", res);
      if (!res) {
        this.startDate.setErrors({'usedDates': true});
        this.endDate.setErrors({'usedDates': true});
      } else if (!(this.startDate.hasError('beforeToday') || this.endDate.hasError('beforeTodayEnd'))) {
        this.startDate.updateValueAndValidity();
        this.endDate.updateValueAndValidity();
      }
      console.log("Errors 1:", this.startDate.errors);
    })
  }


}
