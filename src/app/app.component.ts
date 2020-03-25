import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './servicio/cabecera.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from './login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routes: Object[] = [];
  idioma: string  = "es";

  username : string;

  loading = false;
  title: any = 'scrume-front';


  //constructor(private router: Router) {}
  constructor(private router: Router, private httpClient: HttpClient, private cabeceraService: CabeceraService, private dialog: MatDialog) {
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
      //TODO: petición get User
      this.username = "Demo User";
      this.navigateTo("teams");
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
         //TODO: petición get User
        this.username = "Demo User";
        this.navigateTo("teams");
      }
    });
  }

  logOut(): void{
    sessionStorage.setItem("loginToken", "");
    this.username = undefined;
    this.navigateTo("bienvenida");
  }

  getUsername(){
    //TODO: peticion al back
  }
}
