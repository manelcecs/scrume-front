import { Component, OnInit, Input } from '@angular/core';
import { TeamService } from '../servicio/team.service';
import { Box } from '../dominio/box.domain';

@Component({
  selector: 'app-badge-minimum-box',
  templateUrl: './badge-minimum-box.component.html',
  styleUrls: ['./badge-minimum-box.component.css']
})
export class BadgeMinimumBoxComponent implements OnInit {

  @Input() idTeam: number;
  boxName: string;
  infoMessage: string = "El plan del equipo es el mínimo de los planes de los miembros."

  constructor(private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.teamService.getMinimumBox(this.idTeam).subscribe((box: Box) => {
       this.boxName = box.name;
     });
  }

}
