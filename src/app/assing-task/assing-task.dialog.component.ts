import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../servicio/user.service';
import { SimpleUserNick } from '../dominio/user.domain';
import { TaskDto, TaskToEdit } from '../dominio/task.domain';
import { TaskService } from '../servicio/task.service';

@Component({
    selector: 'assing-task.dialog',
    templateUrl: 'assing-task.dialog.html',
    styleUrls: ['./assing-task.dialog.css']
  })
  export class AssingTaskDialog implements OnInit{
  
    task: TaskToEdit;
    taskComplete : SimpleUserNick[];
    taskId: number;
    usersOfTeam: SimpleUserNick[];
    usersOfTask: SimpleUserNick[];
  
    workspaceId: number;

    
    constructor(
      public dialogRef: MatDialogRef<AssingTaskDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private taskService: TaskService) {
        
        this.workspaceId = data.idWorkspace;
        this.taskId =data.idTask;

        this.usersOfTask = data.usersAsign;

        this.taskService.getTask(this.taskId).subscribe((task: TaskDto)=>{
          this.taskComplete = task.users;
          let users = [];
          for(let u of task.users){
            users.push(u.id);
          }
          this.task = {id: this.taskId, description: task.description, title: task.title, users: users};
          this.task.id = this.taskId;
        });
    }
  
  
    ngOnInit(): void {
      this.getAllUsersToAssing();
    }
  
    cancel(): void {
      this.dialogRef.close();
    }

    unassing(user: SimpleUserNick){
      this.task.users.splice(this.task.users.indexOf(user.id), 1);
      this.taskService.editTask(this.taskId, this.task).subscribe((task: TaskDto)=>{
        let users = [];
        for(let u of task.users){
          users.push(u.id);
        }
        this.task = {id: this.taskId, description: task.description, title: task.title, users: users};
        this.usersOfTeam.splice(this.usersOfTeam.indexOf(user), 1);
        this.getAllUsersToAssing();
      });
    }

    assing(user: SimpleUserNick){
      this.task.users.push(user.id);
      this.taskService.editTask(this.taskId, this.task).subscribe((task: TaskDto)=>{
        let users = [];
        for(let u of task.users){
          users.push(u.id);
        }
        this.task = {id: this.taskId, description: task.description, title: task.title, users: users};
        this.usersOfTask.push(user);
        this.getAllUsersToAssing();
      });
    }
      
    getAllUsersToAssing(){  
      this.userService.getAllUsersOfWorkspace(this.workspaceId).subscribe((users: SimpleUserNick[]) =>{
        this.usersOfTeam = users;
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