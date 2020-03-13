import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto } from '../dominio/project.domain';
import { Sprint } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css', './new-sprint-dialog.css']
})
export class ProjectComponent implements OnInit {
  project : ProjectDto;
  sprints : Sprint[];
  startDate: Date;
  endDate: Date;

  constructor(
     private router: Router,
     private projectService: ProjectService, 
     private sprintService : SprintService, 
     public dialog: MatDialog
    ) { }

  ngOnInit(): void {
     this.project = this.projectService.getProject(0);
     this.sprints = this.sprintService.getSprintsOfProject(0);
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(NewSprintDialog, {
      width: '250px',
      data: {startDate: this.startDate, endDate: this.endDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });
  }

  
}



export interface newSprint {
  startDate: Date,
  endDate: Date,
}

@Component({
  selector: 'new-sprint-dialog',
  templateUrl: 'new-sprint-dialog.html',
  styleUrls: ['./new-sprint-dialog.css']
})
export class NewSprintDialog {

  constructor(
    public dialogRef: MatDialogRef<NewSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: newSprint) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
