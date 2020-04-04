import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonalService } from '../servicio/personal.service';
import { PersonalDataAll } from '../dominio/personal.domain';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {

  personal: PersonalDataAll;

  constructor(private router: Router,
    private personalService: PersonalService) { }

  ngOnInit(): void {

    this.personalService.getAllMyData().subscribe((per: PersonalDataAll)=>{
      this.personal = per;
    })

  }

  backToProfile(){
    this.router.navigate(['profile']);
  }

}
