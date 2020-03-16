import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProjectService } from '../servicio/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectDto } from '../dominio/project.domain';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  validateNotBlank(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let isValid = true;
      if (control.value !== '') {
        isValid = (control.value || '').trim().length !== 0;
      }
      return isValid ? null : { 'whitespace': 'value is only whitespace' }

    };
  }

  action : string;

  private idProyecto : number;
  private idEquipo : number;
  project: ProjectDto;


  name = new FormControl('', { validators: [Validators.required] });
  desc = new FormControl('', { validators: [this.validateNotBlank()] });

  constructor(private router: Router, private projectService: ProjectService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.action == "edit") {
        this.action = "edit";

        this.projectService.getProject(params.id).subscribe(res => {
          this.project = res;
        }

        );
        this.name.setValue(this.project.name);
        this.desc.setValue(this.project.description);
        this.idProyecto = params.id
      } else if (params.action === "create") {
        this.action = "create";

        this.project.team = params.id;
      }

    });

  };

  createProject(): void {

    this.project = {name: this.name.value,description: this.desc.value, team: this.idEquipo};

    if (this.idProyecto != undefined){

      this._editProject(this.idProyecto).subscribe((resp: ProjectDto) => {

        this.project = resp;

      });

    }else{

      this._createProject().subscribe((resp: ProjectDto) => {

        this.project = resp;

      });

    }

  }

  private _editProject(id: number):any/*Observable<Proj>*/{

    return this.projectService.editProject(id, this.project);

  }

  private _createProject():any/*Observable<Team>*/{

    return this.projectService.createProject(this.project);

  }

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  cancel(): void {
    if (this.action == "create") {
      this.router.navigate(["teams"]);
    } else if (this.action == "edit") {
      this.router.navigate(["project"], {queryParams:{id:this.project.id}});
    }
  }

  validForm():Boolean {

    let valid: boolean;

    valid = this.name.valid && this.desc.valid;
    return valid;

  }

  getErrorMessageName(): String {

    return this.name.hasError('required')?'Este campo es requerido.':'';

  }

  getErrorMessageDesc(): String {
    return this.desc.hasError('whitespace')?'Este campo no admite solo caracteres en blanco':'';
  }
}
