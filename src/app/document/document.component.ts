import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../servicio/document.service';
import { Document, Daily } from '../dominio/document.domain';
//De document
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  idDoc: number;
  doc: Document;
  document: Document;

  //retrospective
  good;
  bad;
  improvement;
  //daily
  name;
  done;
  todo;
  problem;
  //review
  noDone;
  rePlanning;
  //planning
  entrega;
  conseguir;

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

          if(doc.type == "RETROSPECTIVE") {
            this.good = JSON.parse(this.doc.content).good;
            this.bad = JSON.parse(this.doc.content).bad;
            this.improvement = JSON.parse(this.doc.content).improvement;
          }else if(doc.type == "REVIEW") {
            this.done = JSON.parse(this.doc.content).done;
            this.noDone = JSON.parse(this.doc.content).noDone;
            this.rePlanning = JSON.parse(this.doc.content).rePlanning;
          }else if(doc.type == "DAILY") {
            this.name = JSON.parse(this.doc.content).name;
            this.done = JSON.parse(this.doc.content).done;
            this.todo = JSON.parse(this.doc.content).todo;
            this.problem = JSON.parse(this.doc.content).problem;
          }else{
            this.entrega = JSON.parse(this.doc.content).entrega;
            this.conseguir = JSON.parse(this.doc.content).conseguir;
          }
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

  dailyName(value: string){ this.name = value;}
  dailyDone(value: string){ this.done = value;}
  dailyTodo(value: string){ this.todo = value;}
  dailyProblem(value: string){ this.problem = value;}

  //Retrospective

  restrospectiveGood(value: String){ this.good = value;}
  restrospectiveBad(value: String){ this.bad = value;}
  restrospectiveImprovement(value: String){ this.improvement = value;}

  //Review

  reviewDone(value: String){ this.done = value;}
  reviewNoDone(value: String){ this.noDone = value;}
  reviewRePlanning(value: String){ this.rePlanning = value;}

  //Planning

  planningEntrega(value: String){ this.entrega = value;}
  planningConseguir(value: String){ this.conseguir = value;}


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
