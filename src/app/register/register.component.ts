import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

// El selector es la forma de instanciar al componente desde otro html que no es el que aparece en la línea de abajo.
// Por ejemplo, en el app.component.ts, el selector es app-root y en index.html es llamado poniendo <app-root></app-root>
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html', //El html que se gestionará
  styleUrls: ['./register.component.css'] //Los css que harán referencia al html (Pueden ser varios, por eso es un array)
})
export class RegisterComponent implements OnInit {
  //Aqui se definen variables que se usarán más adelante
  signUpFormGroup: FormGroup;
  selectPlanFormGroup: FormGroup;
  personalDataFormGroup: FormGroup;
  isOptional = true;
  termsAccepted = false;

  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl: FormControl = new FormControl('', [Validators.required,
    Validators.pattern(/\d/),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[A-Z]/),
    Validators.pattern(/[\^*\-_<>[\]{}¿?¡!\\\/&%$#():;.,+@=]/),
    Validators.minLength(8)]);
  confirmPasswordControl: FormControl = new FormControl('', [Validators.required, this.samePasswordValidator(this.passwordControl)]);
  termsControl: FormControl = new FormControl(false);

  //Al constructor se le pasan las clases como los servicios que usaremos en el componente
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signUpFormGroup = this._formBuilder.group({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      confirmPasswordControl: this.confirmPasswordControl,
      termsControl : this.termsControl,
    });
    this.selectPlanFormGroup = this._formBuilder.group({
    });

  }

  samePasswordValidator(pass: FormControl) {
    return (control: AbstractControl): {[key: string]: any} | null => {
       let res = control.value != pass.value ? {'notSamePassword': "Las contraseñas no son iguales"} : null;
       return res;
     };
  }

  displayValidationErrors(control: FormControl) {
    console.log(control.errors)
    console.log(this.passwordControl.getError("pattern")["requiredPattern"]);
  }

  getErrorMessageEmail() {
    return this.emailControl.hasError('required') ? 'Este campo es requerido.':
    this.emailControl.hasError('email') ? 'El email debe tener un formato válido: ejemplo@ejemplo.es': '';
  }

  getErrorMessagePassword(){
    return this.passwordControl.hasError('required') ? 'Este campo es requerido.':
    this.passwordControl.hasError('minlength') ? 'El tamaño debe ser mayor a 8 caracteres.':
    !this.passwordControl.hasError("pattern") ? '' :
    this.passwordControl.getError("pattern")["requiredPattern"] == "/[A-Z]/" ? "Debe tener una mayúscula." :
    this.passwordControl.getError("pattern")["requiredPattern"] == "/[a-z]/" ? "Debe tener una minúscula." :
    this.passwordControl.getError("pattern")["requiredPattern"] == "/\\d/" ? "Debe tener un dígito." :
    this.passwordControl.getError("pattern")["requiredPattern"] == "/[\\^*\\-_<>[\\]{}¿?¡!\\\\\\/&%$#():;.,+@=]/" ? "Debe tener un símbolo: ^ * - _ < > [ ] { } ¿ ? ¡ ! \ / & % $ # ( ) : ; . , + @ = " : '';
  }

  getErrorMessageConfirmPassword(){
    return this.confirmPasswordControl.hasError('required') ? 'Este campo es requerido.':
    this.confirmPasswordControl.hasError('notSamePassword') ? 'Las contraseñas no coinciden.' : '';
  }

  getErrorTerms(){
    return this.termsControl.hasError('required') ? 'Debe leer y aceptar los términos y condiciones.' : '';
  }

  validForm(): boolean {

    let valid: boolean;

    valid = this.emailControl.valid && this.passwordControl.valid && this.confirmPasswordControl.valid;
    if (valid && !this.termsControl.value) {
       this.termsControl.setErrors({'required' : true});
    }
    return valid;

  }

  valueRadioButton() {
    console.log(document.querySelector('input[name="selected-plan"]:checked')["value"]);
  }

}
