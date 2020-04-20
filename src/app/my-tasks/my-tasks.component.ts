import { Component, OnInit } from '@angular/core';
import { TaskToList } from '../dominio/task.domain';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  tasks: TaskToList[];

  tasksMap: Map<string, TaskToList[]> = new Map<string, TaskToList[]>();

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.tasks = this.activatedRoute.snapshot.data.tasks;

    for(let t of this.tasks){

      let projName = t.project.name;

      if(this.tasksMap.has(projName)){
        let array = this.tasksMap.get(projName);
        array.push(t);
        this.tasksMap.set(projName, array);

      }else{
        let arrayTask: TaskToList[] = [];
        arrayTask.push(t);
        this.tasksMap.set(projName, arrayTask);
      }
    }
  }

  ngOnInit(): void {

  }

  openProject(idProj: number){
    this.router.navigate(['project'], { queryParams: { method: "list", idProject: idProj } });
  }

  openBoard(idWork: number, sprint: number){
    this.router.navigate(['board'], { queryParams: { idBoard: idWork,  idSprint: sprint, method: "get"} });
  }


}
