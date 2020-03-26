import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../servicio/document.service';
import { Document } from '../dominio/document.domain'

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  idDoc: number;
  doc: Document;
  document: Document;

  constructor(private router: Router, private documentService: DocumentService, private activatedRoute: ActivatedRoute,) { }

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

}
