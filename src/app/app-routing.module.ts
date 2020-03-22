import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WellcomeComponent } from './wellcome/wellcome.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SprintComponent } from './sprint/sprint.component';
import { TeamComponent } from './team/team.component';
import { TeamCreateComponent } from './team-create/team-create.component';
import { BacklogComponent } from './backlog/backlog.component';
import { BoardComponent } from './board/board.component';
import { ProjectResolverService, ProjectWithTaskResolverService } from './servicio/project.service';
import { SprintResolverService } from './servicio/sprint.service';


const routes: Routes = [

  {path: 'bienvenida', component: BienvenidaComponent},
  {path: 'teams', component: TeamComponent},
  {path: 'teamsCreate', component: TeamCreateComponent},
  {path: 'project', component: ProjectComponent, resolve:{project: ProjectResolverService, sprints: SprintResolverService}},
  {path: 'createProject', component: CreateProjectComponent},
  {path: 'sprint', component: SprintComponent},
  {path: 'backlog', component: BacklogComponent, resolve: {project: ProjectWithTaskResolverService, projectWithTeam: ProjectResolverService,}},
  {path: 'board', component: BoardComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
