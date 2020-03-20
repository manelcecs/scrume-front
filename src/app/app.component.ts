import { Component, OnDestroy, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
=======
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './servicio/cabecera.service';
>>>>>>> integration

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routes: Object[] = [];
  idioma: string  = "es";

<<<<<<< HEAD
  constructor(private router: Router) {
=======
  constructor(private router: Router, private httpClient: HttpClient, private cabeceraService: CabeceraService) {
>>>>>>> integration

  }

  ngOnInit(): void{
    this.cargarMenu();
<<<<<<< HEAD

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
=======
    this.navigateTo('teams');
    // this.httpClient.get<any>("/api/profile/list", {headers: this.cabeceraService.getBasicAuthentication()}).subscribe(res =>{
    //   console.log(JSON.stringify(res));
    // });

    this.httpClient.get<any>(this.cabeceraService.getCabecera() + "api/profile/list", {headers: this.cabeceraService.getBasicAuthentication()}).subscribe(res =>{
      console.log(JSON.stringify(res));
    });

>>>>>>> integration
  }

  ngOnDestroy(): void {
    
  }

<<<<<<< HEAD
  navigateTo(route: String): void{
=======
  navigateTo(route: string): void{
>>>>>>> integration
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
<<<<<<< HEAD
        title: 'Wellcome',
        route: '/wellcome',
        icon: 'home',
        visible: 'true'
    }
  ];
  }
=======
        title: 'Equipo',
        route: '/teams',
        icon: 'people',
        visible: 'true'
    }
  ];
  } 
>>>>>>> integration

}
