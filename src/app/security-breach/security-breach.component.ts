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
  constructor(private securityBreachService: SecurityBreachService,
    private router: Router) { }
  

  ngOnInit(): void {
    this.recharge();
  }

  activeBreach() {
    
    if (this.activated) {
      this.cond = false;
      this.mess = "We don't found a security breach in system.";
    } else {
      this.cond = true;
      this.mess = "We found a security breach in the system.";
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
      console.log("Está actualmente " + this.activated);
      this.message = breach.message;
    });
  }
}
