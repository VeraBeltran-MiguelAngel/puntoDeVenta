import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    formulario: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css'],
})
export class EntradasComponent {
  hide = true;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private router: Router,

    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/),
        ]),
      ],
      apPaterno: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d]*$/),
        ]),
      ],
      apMaterno: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d]*$/),
        ]),
      ],
      rfc: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[A-Za-zñÑ&]{1,2}([A-Za-zñÑ&]([A-Za-zñÑ&](\d(\d(\d(\d(\d(\d(\w(\w(\w)?)?)?)?)?)?)?)?)?)?)?$/
          ),
        ]),
      ],
      Gimnasio_idGimnasio: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      turnoLaboral: ['', Validators.compose([Validators.required])],
      salario: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(0|[1-9][0-9]*)$/),
        ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
      ],
      pass: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }

  registrar() {}
}
