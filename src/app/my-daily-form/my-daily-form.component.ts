import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from '../servicio/document.service';
import { FormControl, Validators } from '@angular/forms';
import { Document, Daily, DailyComponent } from '../dominio/document.domain';

@Component({
  selector: 'app-my-daily-form',
  templateUrl: './my-daily-form.component.html',
  styleUrls: ['./my-daily-form.component.css']
})
export class MyDailyFormComponent implements OnInit {

  idSprint: number;
  nombre: string;

  done: FormControl = new FormControl('', { validators: [Validators.required] });
  doing: FormControl = new FormControl('', { validators: [Validators.required] });
  problems: FormControl = new FormControl('', { validators: [Validators.required] });

  documento: Document;

  daily: Daily;

  constructor(public dialogRef: MatDialogRef<MyDailyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private documentService: DocumentService) { }

  ngOnInit(): void {
    this.idSprint = this.data.id;
    this.nombre = this.data.nombre;

    //Cambiar a la nueva peticion
    this.documentService.getDocuments(this.idSprint).subscribe((doc: Document)=>{
      this.documento = doc;
    });
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

  onSaveClick(): void{
    if(this.validForm()){
      this.populateDaily();
      console.log("Contenido que había: ", JSON.parse(this.documento.content))
      let documentContent : DailyComponent = JSON.parse(this.documento.content);
      documentContent.daily.push(this.daily);

      console.log("Contenido a guardar:", JSON.stringify(documentContent));
      this.documento.content = JSON.stringify(documentContent);

      this.documentService.editDocument(this.documento).subscribe(()=>{
        this.dialogRef.close();
      });
    }
  }

  validForm(){
    let valid: boolean = true;

    valid = valid && this.done.valid;
    valid = valid && this.doing.valid;
    valid = valid && this.problems.valid;

    return valid;
  }

  populateDaily(){
    this.daily.name = this.nombre;
    this.daily.done = this.done.value;
    this.daily.doing = this.doing.value;
    this.daily.problems = this.problems.value;
  }

}
