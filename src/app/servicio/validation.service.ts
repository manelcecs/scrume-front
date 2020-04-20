import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Box } from '../dominio/box.domain';
import { TeamService } from './team.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })

export class ValidationService {

  constructor(private httpClient: HttpClient, private teamService: TeamService, private userService: UserService) { }

  /**
   * @param idTeam Id del equipo para coger el paquete mínimo
   * @param numberOfProjects Número de proyectos en los que es admin o miembro.
   * @description Recibe el número de proyectos y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
   * @returns true si es no ha violado la restricción del plan, false en caso contrario.
   */
  checkNumberOfProjects(idTeam: number, numberOfProjects: number): Observable<boolean> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        var validation: boolean;
        validation = true;
        switch (box.name) {
          case "BASIC": {
            if (numberOfProjects >= 1) {
              validation = false;
            }
            break;
          }
          case "STANDARD": {
            if (numberOfProjects >= 3) {
              validation = false;
            }
            break;
          }
        }
        observer.next(validation);
        observer.complete();
      });
    });
  }

  /**
   * @param idTeam Id del equipo para coger el paquete mínimo
   * @param numberOfSprints Número de sprints de un proyecto.
   * @description Recibe el número de sprints de un proyecto y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
   * @returns true si es no ha violado la restricción del plan, false en caso contrario.
   */
  checkNumberOfSprints(idTeam: number, numberOfSprints: number): Observable<boolean> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        var validation: boolean;
        validation = true;
        if (box.name == "BASIC") {
          if (numberOfSprints >= 1) {
            validation = false;
          }
        }
        observer.next(validation);
        observer.complete();
      });
    });
  }

  /**
   * @param idTeam Id del equipo para coger el paquete mínimo
  * @param numberOfBoards Número de tableros de un sprint.
  * @description Recibe el número de tableros de un sprint y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
  * @returns true si es no ha violado la restricción del plan, false en caso contrario.
  */
  checkNumberOfBoards(idTeam: number, numberOfBoards: number): Observable<boolean> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        var validation: boolean;
        validation = true;
        switch (box.name) {
          case "BASIC": {
            if (numberOfBoards >= 1) {
              validation = false;
            }
            break;
          }
          case "STANDARD": {
            if (numberOfBoards >= 2) {
              validation = false;
            }
            break;
          }
        }
        observer.next(validation);
        observer.complete();
      });
    });
  }

  /**
  * @param idTeam Id del equipo para coger el paquete mínimo
  * @description Recibe id del equipo y determina si puede ver gráficos o no.
  * @returns true si es no ha violado la restricción del plan, false en caso contrario.
  */
  checkCanDisplayGraphics(idTeam: number): Observable<boolean> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        var validation: boolean;
        if (box.name === "BASIC") {
          validation = false;
        } else {
          validation = true;
        }
        observer.next(validation);
        observer.complete();
      });
    });
  }

  getMinimumBoxOfTeam(idTeam: number): Observable<string> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        observer.next(box.name);
        observer.complete();
      });
    });
  }

  checkCanDisplayCreateAlerts(idTeam: number): Observable<boolean> {
    return new Observable((observer) => {
      this.teamService.getMinimumBox(idTeam).subscribe((box: Box) => {
        var validation: boolean;
        validation = true;
        if (box.name != "PRO") {
          validation = false;
        }
        observer.next(validation);
        observer.complete();
      });
    });
  }

  isBoxExpired(): boolean {
    return new Date(this.userService.getUserLogged().endingBoxDate).getTime() < new Date().getTime();
  }
}
