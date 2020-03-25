import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../servicio/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  constructor(private router: Router, private documentService: DocumentService, private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
  }

}
