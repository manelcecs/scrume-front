import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './servicio/cabecera.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routes: Object[] = [];
  idioma: string  = "es";

  loading = false;


  //constructor(private router: Router) {}
  constructor(private router: Router, private httpClient: HttpClient, private cabeceraService: CabeceraService) {
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

    Promise.resolve().then(()=> {
    let idm = localStorage.getItem("idioma");
    if (idm == null){
      localStorage.setItem("idioma", this.idioma);
    }else{
      this.idioma = idm;
    }

    if(this.idioma == "es"){
      this.router.navigate(["bienvenida"]);
    }else{
      this.router.navigate(["wellcome"]);
    }

    });
    this.navigateTo('teams');
  

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
        title: 'Wellcome',
        route: '/wellcome',
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

}
