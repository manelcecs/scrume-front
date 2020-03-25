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
import { CreateBoardComponent } from './create-board/create-board.component';
import { ProjectWithTaskResolverService, ProjectResolverService } from './servicio/project.service';
import { SprintResolverService, SprintWorkspaceResolverService } from './servicio/sprint.service';
import { DocumentComponent } from './document/document.component';


const routes: Routes = [

  {path: 'bienvenida', component: BienvenidaComponent},
  {path: 'teams', component: TeamComponent},
  {path: 'teamsCreate', component: TeamCreateComponent},
  {path: 'project', component: ProjectComponent, resolve:{project: ProjectResolverService, sprints: SprintResolverService}},
  {path: 'createProject', component: CreateProjectComponent},
  {path: 'sprint', component: SprintComponent},
  {path: 'backlog', component: BacklogComponent, resolve: {project: ProjectWithTaskResolverService, sprints: SprintWorkspaceResolverService}},
  {path: 'createBoard', component: CreateBoardComponent},
  {path: 'board', component: BoardComponent},
  {path: 'document', component: DocumentComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
