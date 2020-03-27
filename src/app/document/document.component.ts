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
  con: string;
  c;

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

  dailyName(value: string){ 
    this.name = value; 
    var pdfContainer = document.getElementById("pdf-container"); 
    var scrollNow = document.getElementById("dailyName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
    console.log(pdfContainer.scrollTop);
  }

  dailyDone(value: string){ 
    this.done = value; 
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("dailyDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }
  dailyTodo(value: string){ 
    this.todo = value; 
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("dailyTodo");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }
  dailyProblem(value: string){ 
    this.problem = value; 
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("dailyProblem");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  //Retrospective

  restrospectiveGood(value: String){ 
    this.good = value; 
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveGood");
    pdfContainer.scrollTop = scrollNow.clientHeight;  
  }
  
  restrospectiveBad(value: String){ 
    this.bad = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveBad");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }
  
  restrospectiveImprovement(value: String){ 
    this.improvement = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveImprovement");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }


  //Review

  reviewDone(value: String){ 
    this.done = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewNoDone(value: String){ 
    this.noDone = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewNoDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewRePlanning(value: String){ 
    this.rePlanning = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewRePlanning");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  //Planning

  planningEntrega(value: String){ 
    this.entrega = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningEntrega");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  planningConseguir(value: String){ 
    this.conseguir = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningConseguir");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }


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

  updateDoc(doc: Document): void {

    if(doc.type == "REVIEW"){

      this.c = {
        done: this.done,
        noDone: this.noDone,
        rePlanning: this.rePlanning
      }

      console.log("lo que me llega " + this.done);
      
    }else if(doc.type == "RETROSPECTIVE"){

      this.c = {
        good: this.good,
        bad: this.bad,
        improvement: this.improvement
      }

    }else if(doc.type == "DAILY"){

      this.c = {
        name: this.name,
        done: this.done,
        todo: this.todo,
        problem: this.problem
      }

    }else{

      this.c = {
        entrega: this.entrega,
        conseguir: this.conseguir
      }

    }

    this.con = JSON.stringify(this.c);

    let documentComplete = {
      id: doc.id,
      name: doc.name,
      sprint: doc.sprint,
      type: doc.type,
      content: this.con
    }

    console.log("el documento " + JSON.stringify(documentComplete));

    this.documentService.editDocument(documentComplete).subscribe((doc: Document)=> {
      this.doc = doc;
      console.log("holaaaaaaa");
    });
  }

}
