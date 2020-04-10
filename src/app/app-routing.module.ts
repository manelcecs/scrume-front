import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SprintComponent } from './sprint/sprint.component';
import { TeamComponent } from './team/team.component';
import { TeamCreateComponent } from './team-create/team-create.component';
import { BacklogComponent } from './backlog/backlog.component';
import { BoardComponent } from './board/board.component';
import { CreateInvitationComponent } from './create-invitation/create-invitation.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { ProjectWithTaskResolverService, ProjectResolverService } from './servicio/project.service';
import { SprintResolverService, SprintWorkspaceResolverService } from './servicio/sprint.service';
import { TeamResolverService } from './servicio/team.service';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskResolverService } from './servicio/task.service';
import { DocumentComponent } from './document/document.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { SecurityBreachComponent } from './security-breach/security-breach.component';


const routes: Routes = [

  {path: 'bienvenida', component: BienvenidaComponent},
  {path: 'teams', component: TeamComponent, resolve:{teams: TeamResolverService}},
  {path: 'teamsCreate', component: TeamCreateComponent},
  {path: 'project', component: ProjectComponent, resolve:{project: ProjectResolverService, sprints: SprintResolverService}},
  {path: 'createProject', component: CreateProjectComponent},
  {path: 'sprint', component: SprintComponent},
  {path: 'backlog', component: BacklogComponent, resolve: {project: ProjectWithTaskResolverService, sprints: SprintWorkspaceResolverService}},
  {path: 'createBoard', component: CreateBoardComponent},
  {path: 'board', component: BoardComponent},
  {path: 'invitation', component: CreateInvitationComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'terms-of-use', component: TermsOfUseComponent},
  {path: 'document', component: DocumentComponent},
  {path: 'myTasks', component: MyTasksComponent, resolve:{tasks: TaskResolverService}},
  {path: 'profile', component: ProfileComponent},
  {path: 'personal', component: PersonalDataComponent},
  {path: 'admin', component: SecurityBreachComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
