import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { UserLog, UserLogged } from "../dominio/jwt.domain";
import { ValidationService } from './validation.service';

@Injectable()
export class CheckExpirationBoxGuard implements CanActivate {
  constructor(private validationService: ValidationService, private router: Router) {}

  canActivate() {
    var res: boolean = true;
    if (this.validationService.isBoxExpired()) {
      this.router.navigate(["profile"]);
      res = false;
    }
    return res;
  }
}