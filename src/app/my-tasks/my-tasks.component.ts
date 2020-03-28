import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskToList } from '../dominio/task.domain';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  tasks: TaskToList[];

  tasksMap: Map<number, TaskToList>;

  constructor(private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.tasks = data.tasks;
    for(let t of this.tasks){
      this.tasksMap.set(t.projectId, t);
    }
  }

  ngOnInit(): void {

    for(let [key, values] of this.tasksMap){
      console.log("key", key);
      console.log("values", values);
    }

  }

  openProject(idProj: number){
    this.navigateTo('sprint', idProj, 'getTeam');
  }

  openBoard(idWork: number){
    this.navigateTo('board', idWork);
  }

  navigateTo(route: string, id: number, method?: string){
    if(method != undefined){
      this.router.navigate([route], {queryParams:{id: id}});
    }else{
      this.router.navigate([route], {queryParams:{id: id, method: method}});
    }
    
  }

}
