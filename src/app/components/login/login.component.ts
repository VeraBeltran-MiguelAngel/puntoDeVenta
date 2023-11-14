import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  //guardar la respuesta del api en un array
  resApi: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //obtener el rol del usuario registrado
    let rol = this.auth.getRol();

    //esta parte evita que el usuario regrese al login sin desloguearse detectando su rol correspondiente
    if (this.auth.isLoggedIn()) {
      switch (rol) {
        case 'Administrador':
          this.router.navigate(['/admin']);
          break;
        case 'Recepcionista':
          this.router.navigate(['/recepcion']);
          break;
      }
    }
  }

  onSubmit(): void {
    console.log('Hiciste clic en enviar');
    console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (respuesta) => {
          console.log('llego respuesta del api');
          const rol = respuesta[0].rol;
          let messageExito = '';
          let messageError = '';

          switch (rol) {
            case 'Administrador':
              messageExito = 'Bienvenido administrador';
              this.router.navigate(['/admin']);
              break;
            case 'Entrenador':
              messageExito = 'Bienvenido entrenador';
              this.router.navigate(['/entrenador']);
              break;
            case 'Recepcionista':
              messageExito = 'Bienvenido recepcionista';
              this.router.navigate(['/recepcion']);
              break;
            default:
              messageError = 'Tu cuenta no tiene permisos suficientes';
              this.toastr.error(messageError, 'Error', {
                positionClass: 'toast-bottom-left',
              });
              break;
          }
          //si el mensaje exito esta vacio significa que un usuario con rol diferente a los indicados trato de entrar
          if (messageExito !== '') {
            this.toastr.success(messageExito, '', {
              positionClass: 'toast-bottom-left',
            });
            console.log(respuesta);
            // Guardamos el registro del usuario en el local storage (en formato cadena)
            this.auth.setUserData(JSON.stringify(respuesta));
          }
        },
        error: (paramError) => {
          this.toastr.error(paramError, 'Error', {
            positionClass: 'toast-bottom-left',
          });
        },
      });
    }
  }



  getErrorMessage() {
    const usernameControl = this.loginForm.get('username');
    if (usernameControl) {
      if (usernameControl.hasError('required')) {
        return 'Por favor ingresa tu correo';
      }
      if (usernameControl.hasError('email')) {
        return 'Por favor ingresa un correo valido';
      }
    }
    return '';
  }
}
