import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './servicio/cabecera.service';
import { InvitationService } from './servicio/invitation.service';
import { InvitationDisplay } from './dominio/invitation.domain';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from './login-dialog/login-dialog.component';
import { UserService } from './servicio/user.service';
import { UserNick, User } from './dominio/user.domain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routes: Object[] = [];
  idioma: string  = "es";
  notifications : boolean = false;

  user : User;

  loading = false;
  title: any = 'scrume-front';


  //constructor(private router: Router) {}
  constructor(private router: Router, private httpClient: HttpClient, private cabeceraService: CabeceraService, private invitationService : InvitationService, private dialog: MatDialog, private userService: UserService) {
    this.router.events.subscribe((event: RouterEvent) =>{
      switch(true){
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
      }
    });
  }

  ngOnInit(): void{
    this.cargarMenu();

    let token = sessionStorage.getItem("loginToken");
    console.log("token:", token);
    if(token != null && token !== ""){
      this.getUserInfo();
      
    }else{
      this.navigateTo("bienvenida");
    }
  


  }

  ngOnDestroy(): void {

  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  cargarMenu() : void{
    console.log("Menu cargado");
    this.routes = [
      {
        title: 'Bienvenida',
        route: '/bienvenida',
        icon: 'home',
        visible: 'true'
    },{
        title: 'Equipo',
        route: '/teams',
        icon: 'people',
        visible: 'true'
    }
  ];
  }

  openLogin(): void {
    let dialog = this.dialog.open(LoginDialog, {
      width: '250px'
    });
    dialog.afterClosed().subscribe(()=>{
      let token = sessionStorage.getItem("loginToken");
      if(token != null && token != ""){
        this.getUserInfo();
      }
    });
  }

  logOut(): void{
    sessionStorage.setItem("loginToken", "");
    this.user = undefined;
    this.navigateTo("bienvenida");
  }

  getUserInfo(){
    this.userService.findUserAuthenticated().subscribe((user: UserNick)=>{
        this.userService.getUser(user.idUser).subscribe((userComplete: User)=>{
          this.user = userComplete;
          this.navigateTo("teams");
        });

        this.invitationService.getInvitations().subscribe((invitations : InvitationDisplay[]) => {
          if (invitations.length != 0) {
            this.notifications = true;
          }
        });
      
    });
  }

}
