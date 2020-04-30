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
import { CheckExpirationBoxGuard } from './servicio/expiration-guard.service';
import { SecurityBreachComponent } from './security-breach/security-breach.component';
import { BoardResolverService } from './servicio/board.service';
import { ProfileResolverService } from './servicio/profile.service';
import { NotesComponent } from './notes/notes.component';
import { DocumentResolverService } from './servicio/document.service';
import { PersonalResolverService } from './servicio/personal.service';


const routes: Routes = [

  {path: 'bienvenida', component: BienvenidaComponent},
  {path: 'teams', component: TeamComponent, resolve:{teams: TeamResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'teamsCreate', component: TeamCreateComponent, canActivate: [CheckExpirationBoxGuard]},
  {path: 'project', component: ProjectComponent, resolve:{project: ProjectResolverService, sprints: SprintResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'createProject', component: CreateProjectComponent, canActivate: [CheckExpirationBoxGuard]},
  {path: 'sprint', component: SprintComponent, resolve:{sprint: SprintResolverService, documents: DocumentResolverService, boards: BoardResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'backlog', component: BacklogComponent, resolve: {project: ProjectWithTaskResolverService, sprints: SprintWorkspaceResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'createBoard', component: CreateBoardComponent, canActivate: [CheckExpirationBoxGuard]},
  {path: 'board', component: BoardComponent, resolve:{board: BoardResolverService, sprint : SprintResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'invitation', component: CreateInvitationComponent, canActivate: [CheckExpirationBoxGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'terms-of-use', component: TermsOfUseComponent},
  {path: 'document', component: DocumentComponent, canActivate: [CheckExpirationBoxGuard], resolve:{document: DocumentResolverService}},
  {path: 'myTasks', component: MyTasksComponent, resolve:{tasks: TaskResolverService}, canActivate: [CheckExpirationBoxGuard]},
  {path: 'profile', component: ProfileComponent, resolve:{profile: ProfileResolverService}},
  {path: 'personal', component: PersonalDataComponent, resolve:{personal: PersonalResolverService}},
  {path: 'admin', component: SecurityBreachComponent},
  {path: 'notes', component: NotesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
