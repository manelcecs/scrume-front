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

  saveAsProject(){
    this.personalService.getAllMyData().subscribe((per: PersonalDataAll)=>{
      this.personal = per;
      //you can enter your own file name and extension
      let html = document.getElementById('output').innerText;
      this.writeContents(html, 'PersonalData '+ this.personal.name +'.txt', 'text/plain');
    })
  }

  writeContents(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

}
