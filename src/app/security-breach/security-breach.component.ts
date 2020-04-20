import { Component, OnInit } from '@angular/core';
import { SecurityBreachService } from '../servicio/breach.service';
import { Breach } from '../dominio/breach.domain';
import { Router } from '@angular/router';

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

  constructor(private securityBreachService: SecurityBreachService,
    private router: Router) { }
  

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
}
