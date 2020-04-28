import { Component, OnInit, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DocumentService } from "../servicio/document.service";
import { Document, Daily } from "../dominio/document.domain";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../servicio/user.service";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.css"],
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
  dailies: Daily[] = [];
  myDaily: Daily;

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

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {

    this.doc = this.activatedRoute.snapshot.data.document;

  }

  ngOnInit(): void {

    if(this.doc != undefined){
      
      this.idDoc = this.doc.id;

      this.message = "Se ha guardado el documento correctamente";
      this.close = "Cerrar";

      this.onResize();

      if (this.doc.type == "RETROSPECTIVE" || this.doc.type == "MIDDLE_RETROSPECTIVE") {
        this.nameRetrospective = this.doc.name;
        this.good = JSON.parse(this.doc.content).good;
        this.bad = JSON.parse(this.doc.content).bad;
        this.improvement = JSON.parse(this.doc.content).improvement;
      } else if (this.doc.type == "REVIEW" || this.doc.type == "MIDDLE_REVIEW") {
        this.nameReview = this.doc.name;
        this.done = JSON.parse(this.doc.content).done;
        this.noDone = JSON.parse(this.doc.content).noDone;
        this.rePlanning = JSON.parse(this.doc.content).rePlanning;
      } else if (this.doc.type == "DAILY") {
        this.nameDaily = this.doc.name;
        let docContent = JSON.parse(this.doc.content);
        for (let cont of docContent) {
          let dailyWrited: Daily = cont;
          this.dailies.push(dailyWrited);
          if (
            dailyWrited.name ==
            this.userService.getUserLogged().username.split("@")[0]
          ) {
            this.done = dailyWrited.done;
            this.todo = dailyWrited.doing;
            this.problem = dailyWrited.problems;
            this.myDaily = dailyWrited;
          }
        }
        if (this.myDaily == undefined) {
          this.myDaily = {
            name: this.userService.getUserLogged().username.split("@")[0],
            done: "",
            doing: "",
            problems: "",
          };
          this.dailies.push(this.myDaily);
        }
      } else {
        this.namePlanning = this.doc.name;
        this.entrega = JSON.parse(this.doc.content).entrega;
        this.conseguir = JSON.parse(this.doc.content).conseguir;
      }

    }else {
      this.navigateTo("bienvenida");
    }

  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToSprint(): void {
    this.router.navigate(["sprint"], { queryParams: { method:"get", idSprint: this.doc.sprint } });
  }

  //Daily

  dailyDone(value: string) {
    this.myDaily.done = value;
  }

  dailyTodo(value: string) {
    this.myDaily.doing = value;
  }
  dailyProblem(value: string) {
    this.myDaily.problems = value;
  }

  //Retrospective

  retrospectiveName(value: string) {
    this.nameRetrospective = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("retrospectiveName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveGood(value: string) {
    this.good = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveGood");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveBad(value: string) {
    this.bad = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveBad");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  restrospectiveImprovement(value: string) {
    this.improvement = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("restrospectiveImprovement");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  //Review

  reviewName(value: string) {
    this.nameReview = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewDone(value: string) {
    this.done = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewNoDone(value: string) {
    this.noDone = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewNoDone");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  reviewRePlanning(value: string) {
    this.rePlanning = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("reviewRePlanning");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  

  //Planning

  planningName(value: string) {
    this.namePlanning = value;
    this.doc.name = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningName");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  planningEntrega(value: string) {
    this.entrega = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningEntrega");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  planningConseguir(value: string) {
    this.conseguir = value;
    var pdfContainer = document.getElementById("pdf-container");
    var scrollNow = document.getElementById("planningConseguir");
    pdfContainer.scrollTop = scrollNow.clientHeight;
  }

  viewPreview(){
    var formContainer = document.getElementById("forms");
    var pdfContainer = document.getElementById("pdf-container");
    var quitViewPreview = document.getElementById("quit-view-preview");
    formContainer.style.display = "none";
    pdfContainer.style.display = "block";
    pdfContainer.style.width = "100%";
    quitViewPreview.style.display = "block";

    var preview = document.getElementById("preview");
    preview.setAttribute("value", "true");
  }

  quitViewPreview(){
    var formContainer = document.getElementById("forms");
    var pdfContainer = document.getElementById("pdf-container");
    var viewPreview = document.getElementById("view-preview");
    formContainer.style.display = "block";
    formContainer.style.width = "100%";
    pdfContainer.style.display = "none";
    viewPreview.style.display = "block";

    var preview = document.getElementById("preview");
    preview.setAttribute("value", "false");
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
  var pdfContainer = document.getElementById("pdf-container");
  var formContainer = document.getElementById("forms");
  var viewPreview = document.getElementById("view-preview");
  var quitViewPreview = document.getElementById("quit-view-preview");
  var w = window.innerWidth;

  if (w >= 900){
    pdfContainer.style.display = "block";
    pdfContainer.style.width = "60%";

    formContainer.style.display = "block";
    formContainer.style.width = "40%";

    viewPreview.style.display = "none";
    quitViewPreview.style.display = "none";
  } else{
    var preview = document.getElementById("preview");
    var previewValue = preview.getAttribute("value");
    if(previewValue == "false"){
      pdfContainer.style.display = "none";
      formContainer.style.display = "block";
      formContainer.style.width = "100%";
      viewPreview.style.display = "block";
    }

    if(previewValue == "true"){
      formContainer.style.display = "none";
      pdfContainer.style.display = "block";
      pdfContainer.style.width = "100%";
      quitViewPreview.style.display = "block";
    }
  }

}

  generatePDF(doc: Document) {
    if (doc.type == "REVIEW" || doc.type == "MIDDLE_REVIEW") {
      this.c = {
        done: this.done,
        noDone: this.noDone,
        rePlanning: this.rePlanning,
      };
    } else if (doc.type == "RETROSPECTIVE" || doc.type == "MIDDLE_RETROSPECTIVE") {
      this.c = {
        good: this.good,
        bad: this.bad,
        improvement: this.improvement,
      };
    } else if (doc.type == "DAILY") {
      let index = this.dailies.indexOf(this.myDaily);
      if (index >= 0) {
        this.dailies.splice(index, 1);
      }
      this.dailies.push(this.myDaily);
      this.c = this.dailies;
    } else {
      this.c = {
        entrega: this.entrega,
        conseguir: this.conseguir,
      };
    }

    this.con = JSON.stringify(this.c);

    let documentComplete = {
      id: doc.id,
      name: doc.name,
      sprint: doc.sprint,
      type: doc.type,
      content: this.con,
    };

    this.documentService.editDocument(documentComplete).subscribe(
      (docSaved: Document) => {
        this.doc = docSaved;
        this.openSnackBar(this.message, this.close, false);
      },
      (error) => {
        this.openSnackBar(
          "El documento tiene demasiadas palabras",
          "Cerrar",
          true
        );
      },
      () => {
        this.documentService.downloadDocument(doc.id).subscribe((data) => {
          let pdf = new Blob([data], { type: "application/pdf" });
          let fileURL = URL.createObjectURL(pdf);
          var link = document.createElement("a");
          link.href = fileURL;
          link.download = doc.name + ".pdf";
          link.click();
        });
      }
    );
  }

  updateDoc(doc: Document): void {
    if (doc.type == "REVIEW" || doc.type == "MIDDLE_REVIEW") {
      this.c = {
        done: this.done,
        noDone: this.noDone,
        rePlanning: this.rePlanning,
      };
    } else if (doc.type == "RETROSPECTIVE" || doc.type == "MIDDLE_RETROSPECTIVE") {
      this.c = {
        good: this.good,
        bad: this.bad,
        improvement: this.improvement,
      };
    } else if (doc.type == "DAILY") {
      let index = this.dailies.indexOf(this.myDaily);
      if (index >= 0) {
        this.dailies.splice(index, 1);
      }
      this.dailies.push(this.myDaily);
      this.c = this.dailies;
    } else {
      this.c = {
        entrega: this.entrega,
        conseguir: this.conseguir,
      };
    }

    this.con = JSON.stringify(this.c);

    let documentComplete = {
      id: doc.id,
      name: doc.name,
      sprint: doc.sprint,
      type: doc.type,
      content: this.con,
    };

    this.documentService.editDocument(documentComplete).subscribe(
      (docSaved: Document) => {
        this.doc = docSaved;
        this.openSnackBar(this.message, this.close, false);
      },
      (error) => {
        this.openSnackBar(
          "El documento tiene demasiadas palabras",
          "Cerrar",
          true
        );
      }
    );
  }

  openSnackBar(message: string, action: string, error: boolean) {
    if (error) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    } else {
      this._snackBar
        .open(message, action, {
          duration: 2000,
        })
        .afterDismissed()
        .subscribe(() => {
          this.router.navigate(["sprint"], { queryParams: { method:"get", idSprint: this.doc.sprint } });
          });
    }
  }
}
