import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../servicio/document.service';
import { Document} from '../dominio/document.domain';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  idDoc: number;
  doc: Document;
  con: string;
  c;

  message: string;
  close: string;

  //retrospective
  nameRetrospective;
  good;
  bad;
  improvement;
  //daily
  nameDaily;
  done;
  todo;
  problem;
  //review
  nameReview;
  noDone;
  rePlanning;
  //planning
  namePlanning;
  entrega;
  conseguir;

  constructor(private router: Router,
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(param => {

      if(param.id != undefined){

        this.idDoc = param.id;

        this.message = "Se ha guardado el documento correctamente"
        this.close = "Cerrar"

        this.documentService.getDocuments(this.idDoc).subscribe((doc: Document)=> {
          this.doc = doc;

          if(doc.type == "RETROSPECTIVE") {
            this.nameRetrospective = this.doc.name;
            this.good = JSON.parse(this.doc.content).good;
            this.bad = JSON.parse(this.doc.content).bad;
            this.improvement = JSON.parse(this.doc.content).improvement;
          }else if(doc.type == "REVIEW") {
            this.nameReview = this.doc.name;
            this.done = JSON.parse(this.doc.content).done;
            this.noDone = JSON.parse(this.doc.content).noDone;
            this.rePlanning = JSON.parse(this.doc.content).rePlanning;
          }else if(doc.type == "DAILY") {
            this.nameDaily = this.doc.name;
            this.done = JSON.parse(this.doc.content).done;
            this.todo = JSON.parse(this.doc.content).todo;
            this.problem = JSON.parse(this.doc.content).problem;
          }else{
            this.namePlanning = this.doc.name;
            this.entrega = JSON.parse(this.doc.content).entrega;
            this.conseguir = JSON.parse(this.doc.content).conseguir;
          }
        }
        );

      } else{
        this.navigateTo("bienvenida");
      }
    }
    )

  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  //Daily
  dailyName(value: string){
    this.nameDaily = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("dailyName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
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

  retrospectiveName(value: string){
    this.nameRetrospective = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("retrospectiveName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveGood(value: string){
    this.good = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveGood");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveBad(value: string){
    this.bad = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveBad");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveImprovement(value: string){
    this.improvement = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveImprovement");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }


  //Review


  reviewName(value: string){
    this.nameReview = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewDone(value: string){
    this.done = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewNoDone(value: string){
    this.noDone = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewNoDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewRePlanning(value: string){
    this.rePlanning = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewRePlanning");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  //Planning

  planningName(value: string){
    this.namePlanning = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  planningEntrega(value: string){
    this.entrega = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningEntrega");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  planningConseguir(value: string){
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


  updateDoc(doc: Document): void {

    if(doc.type == "REVIEW"){

      this.c = {
        done: this.done,
        noDone: this.noDone,
        rePlanning: this.rePlanning
      }

    }else if(doc.type == "RETROSPECTIVE"){

      this.c = {
        good: this.good,
        bad: this.bad,
        improvement: this.improvement
      }

    }else if(doc.type == "DAILY"){

      this.c = {
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

    this.documentService.editDocument(documentComplete).subscribe((docSaved: Document)=> {
      this.doc = docSaved;
      this.openSnackBar(this.message, this.close, false);
    }, (error) => {
      this.openSnackBar("El documento tiene demasiadas palabras", "Cerrar", true);
    });
  }

  openSnackBar(message: string, action: string, error : boolean) {
    if (error) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    } else {
      this._snackBar.open(message, action, {
        duration: 2000,
      }).afterDismissed().subscribe(() => {
        this.router.navigate(["sprint"], {queryParams: {id: this.doc.sprint}});
      });
    }
  }

}
