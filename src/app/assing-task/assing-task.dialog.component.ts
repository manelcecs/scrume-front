import { Component, OnInit, Inject, ViewChild  } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../servicio/user.service';
import { SimpleUserNick } from '../dominio/user.domain';
import { TaskAssignable, TaskDto } from '../dominio/task.domain';
import { TaskService } from '../servicio/task.service';
@Component({
    selector: 'assing-task.dialog',
    templateUrl: 'assing-task.dialog.html',
    styleUrls: ['./assing-task.dialog.css']
  })
  export class AssingTaskDialog implements OnInit{
  
    task: TaskDto;
    usersOfTeam: SimpleUserNick[];
    usersOfTask: SimpleUserNick[];
  
    workspaceId: number;

    
    constructor(
      public dialogRef: MatDialogRef<AssingTaskDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private taskService: TaskService) {
        this.workspaceId = data.idWorkspace;
        this.taskService.getTask(data.idTask).subscribe((task: TaskDto)=>{
          this.task = task;
        });
    }
  
  
    ngOnInit(): void {
      this.getAllUsersToAssing();
    }
  
    cancel(): void {
      this.dialogRef.close();
    }

    unassing(user: SimpleUserNick){
      this.task.users.splice(this.task.users.indexOf(user), 1);
      this.taskService.editTask(this.task.id, this.task).subscribe((task: TaskDto)=>{
        this.task = task;
        this.getAllUsersToAssing();
      });
    }

    assing(user: SimpleUserNick){
      this.task.users.push(user);
      this.taskService.editTask(this.task.id, this.task).subscribe((task: TaskDto)=>{
        this.task = task;
        this.getAllUsersToAssing();
      });
    }
      
    getAllUsersToAssing(){
      this.userService.getAllUsersOfWorkspace(this.workspaceId).subscribe((users: SimpleUserNick[]) =>{
        this.usersOfTeam = users;
        this.usersOfTask = this.task.users;
        //Eliminamos los usuarios ya asignados
        for(let u of this.usersOfTask){
          let index = this.usersOfTask.indexOf(u);
          if(index >= 0){
            this.usersOfTeam.splice(index);
          }
        }

      });
    }
  
}