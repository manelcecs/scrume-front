import { Component, OnInit } from '@angular/core';
import { SecurityBreachService } from '../servicio/breach.service';
import { Breach } from '../dominio/breach.domain';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { CodeService } from '../servicio/code.service';
import { Code } from '../dominio/box.domain';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-security-breach',
  templateUrl: './security-breach.component.html',
  styleUrls: ['./security-breach.component.css']
})
export class SecurityBreachComponent implements OnInit {

  activated: boolean;
  breach: Breach;
  message: string;
  cond: boolean;
  mess: string;
  isAdmin: boolean;

  sendDate: FormControl = new FormControl();
  codeControl : FormControl = new FormControl('', [Validators.required, Validators.min(0)]);
  codeId: number;
  validForm : boolean = false;

  activeCodes: Code[];

  constructor(private securityBreachService: SecurityBreachService,
    private router: Router, private codeService: CodeService,
    private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar) { 
      this.activeCodes = this.activatedRoute.snapshot.data.codes;
    }
  

  ngOnInit(): void {
    this.recharge();
  }

  activeBreach() {
    
    if (this.activated) {
      this.cond = false;
      this.mess = this.message;
    } else {
      this.cond = true;
      this.mess = this.message;
    }
    let breachJSON = {
      activated: this.cond,
      message: this.mess
    }
    this.securityBreachService.updateSecurityBreach(breachJSON).subscribe((breach: Breach) => {
      this.breach = breach;
      this.recharge();
    });
  }

  recharge() {
    this.securityBreachService.getSecurityBreach().subscribe((breach: Breach) => {
      this.breach = breach;
      this.activated = breach.activated;
      this.message = breach.message;

      this.securityBreachService.isAdmin().subscribe((isAdmin: boolean)=>{
        this.isAdmin = isAdmin;
      });

    });
  }
    validateCode(){
      if(this.codeControl.value != undefined && this.codeControl.value.trim() != ''){
        this._validateCode(this.codeControl.value.trim());
      }else{
        this.codeControl.updateValueAndValidity();
      }
    }
  
  
    private _validateCode(code: string) {
      if ( code != undefined || code.trim() != '' ){
  
        this.codeService.validateCode(code).subscribe((idCode : number) =>  {
          if(idCode === undefined){
            this.codeId = null;
            this.codeControl.updateValueAndValidity();
            this.validForm = true;
            
          }else{
            this.codeId = idCode;
            this.codeControl.setErrors({'invalid' : "Este código no es válido."});
            this.validForm = false;
          }
  
        }, (error)=>{
          this.codeId = null;
          this.codeControl.updateValueAndValidity();
          this.validForm = true;
          this.sendDate.setValue(new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)));
        });
  
      }else{
        this.codeControl.updateValueAndValidity();
      }
      
    }

    createCode() {
      if(this.validForm){
        let code : Code = {code: this.codeControl.value,
          expiredDate:this.sendDate.value};
          this.codeService.createCode(code).subscribe((coderes: Code)=>{
            this.openSnackBar("Código creado con éxito.", "Cerrar");
            this.activeCodes.push(coderes);
          }, (error)=>{
            this.openSnackBar("Se ha producido un error al crear el código.", "Cerrar");
          }, () => {
            this.validForm = false;
            this.codeControl.setValue('');
            this.sendDate.setValue('');
            this.codeControl.updateValueAndValidity();
            this.codeControl.setErrors(null);
          });
      }
      
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    }

    getErrorCode() : string {
      return this.codeControl.getError("invalid") ? "Éste código ya existe." : '';
    }

    deleteCode(code: Code): void {
      this.codeService.deleteCode(code).subscribe(()=>{
        this.openSnackBar("El código se ha borrado con éxito.", "Cerrar");
      }, (error)=>{
        this.openSnackBar("Se ha producido un error al borrar el código.", "Cerrar");
      }, () =>{
        this.codeService.getAllCodes().subscribe((codes: Code[])=>{
          this.activeCodes = codes;
        });
    });

  }
}
