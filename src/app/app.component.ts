import { Component, OnDestroy, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CabeceraService } from './servicio/cabecera.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routes: Object[] = [];
  idioma: string  = "es";

  constructor(private router: Router, private httpClient: HttpClient, private cabeceraService: CabeceraService) {

  }

  ngOnInit(): void{
    this.cargarMenu();

    this.httpClient.get<any>("/api/profile/list", {headers: this.cabeceraService.getBasicAuthentication()}).subscribe(res =>{
      console.log(JSON.stringify(res));
    });

  }

  ngOnDestroy(): void {
    
  }

  navigateTo(route: String): void{
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
    },{
        title: 'Tablero',
        route: '/board',
        icon: 'people',
        visible: 'true'
    }
  ];
  } 

}
