import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../dominio/user.domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from '../servicio/personal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'confirmationDialogComponent',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

export class ConfirmationDialogComponent implements OnInit {

  routes: Object[] = [];
  user: User;

  text : string = '';

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.text = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSaveClick(): void {
    this.dialogRef.close(true);
  }

  navigateTo(route: string, method?: string, id?: number): void{
    if(method==undefined && id == undefined){
      this.router.navigate([route]);
    }else if(method != undefined && id == undefined){
      this.router.navigate([route], {queryParams:{method: method}});
    }else if(method == undefined && id != undefined){
      this.router.navigate([route], {queryParams:{id: id}});
    }else if(method != undefined && id != undefined){
      this.router.navigate([route], {queryParams:{method: method, id: id}});
    }
  }

}
