import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  private idioma : string = "es";
  constructor(private router: Router) { }
  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  day: any;
  hours: any;
  minutes: any;
  seconds: any;
  source = timer(0, 1000);
  clock: any;

  ngOnInit(): void {
    localStorage.setItem("idioma", this.idioma);
    this.clock = this.source.subscribe(t => {
      this.now = new Date();
      this.end = new Date('05/29/' + this.now.getFullYear() +' 00:00');
      this.showDate();
    });
  }

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  showDate(){
    let distance = this.end - this.now;
    this.day = Math.floor(distance / this._day);
    this.hours = Math.floor((distance % this._day) / this._hour);
    this.minutes = Math.floor((distance % this._hour) / this._minute);
    this.seconds = Math.floor((distance % this._minute) / this._second);
  }

}
