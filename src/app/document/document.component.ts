import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../servicio/document.service';
import { Document, Daily } from '../dominio/document.domain';
//De document
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  idDoc: number;
  doc: Document;
  document: Document;

  constructor(private router: Router, 
    private documentService: DocumentService, 
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(param => {

      if(param.id != undefined){

        this.idDoc = param.id;

        this.documentService.getDocuments(this.idDoc).subscribe((doc: Document)=> {
          this.doc = doc;
        });

      } else{
        this.navigateTo("bienvenida");
      }
    }
    )

  }

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  //Daily
  daily: Daily;

  dailyName(value: string){ this.daily.name = value;}

  dailyDone(value: string){ this.daily.done = value;}

  dailyTodo(value: string){ this.daily.todo = value;}

  dailyProblem(value: string){ this.daily.problem = value;}

  //Retrospective
  good;
  bad;
  improvement;

  restrospectiveGood(value: String){ this.good = value;}
  restrospectiveBad(value: String){ this.bad = value;}
  restrospectiveImprovement(value: String){ this.improvement = value;}



  generarPDF(){
    //Mi idea del pdf es que no surja a partir del html sino añadiendo los contenidos desde aqui

    // var doc = new jsPDF();
    // doc.text(35, 25, this.value)
    // doc.save('retrospectiva.pdf');

    // const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    // pdfMake.createPdf(documentDefinition).open();

  }


  siguientePagina(){
    let aux = document.getElementById('palabras');
    var height = window.getComputedStyle(aux, null).getPropertyValue("height");
    if(height == "456px"){
      aux.style.backgroundColor = 'red';
    }
  }

  onKey(value: string){
    let aux = document.getElementById('palabras');
    // if(value.substring(value.length-1, value.length) == "\n"){
    //   this.value = value + "Fracaso";
    // } else{
    //   this.value = value;
    // }
    
    var height = window.getComputedStyle(aux, null).getPropertyValue("height");
    if(height == "456px"){
      aux.style.backgroundColor = 'red';
    }

  }

}
