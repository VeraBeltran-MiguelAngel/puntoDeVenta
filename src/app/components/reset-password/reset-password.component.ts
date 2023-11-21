import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/service/resetPassword.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  hide = true;
  resetForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private passwordReset: ResetPasswordService,
    private route: ActivatedRoute // Agregar ActivatedRoute al constructor
  ) {
    this.resetForm = this.fb.group({
      nuevaPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirmaPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }
  ngOnInit(): void {
    // Verificar los parámetros 'id' y 'token' en la URL al inicializar el componente
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const tokenParam = this.route.snapshot.queryParamMap.get('token');

    if (!idParam || !tokenParam) {
      // Redirigir al componente 'app-not-found' si falta alguno de los parámetros
      this.router.navigate(['/app-not-found']);
      return;
    } else {
      // Enviar los parámetros al servicio para la interacción con la API
      this.passwordReset.validaToken(idParam, tokenParam).subscribe({
        next: (respuesta) => {
          console.log('llego respuest del api');
          console.log(respuesta);
          if (respuesta.success) {
            this.toastr.success(respuesta.message, 'Exito', {
              positionClass: 'toast-bottom-left',
            });
          } else {
            this.toastr.error(respuesta.message, 'Error', {
              positionClass: 'toast-bottom-left',
            });

            // Redirigir al componente 'app-not-found' en caso de error
            this.router.navigate(['/app-not-found']);
          }
        },
        error: (paramError) => {
          this.toastr.error(paramError.error.message, 'Error', {
            positionClass: 'toast-bottom-left',
          });

          // Redirigir al componente 'app-not-found' en caso de error
          this.router.navigate(['/app-not-found']);
        },
      });
    }
  }

  /**
   * Si esta correcto el link se procede a verificar que coincidan las contraseñas para 
   * poder actualizar 
   */
  onSubmit(): void {
    console.log('Hiciste clic en enviar');
    console.log(this.resetForm.value);

    if (this.resetForm.valid) {
      const nuevaPassword = this.resetForm.get('nuevaPassword')?.value;
      const confirmaPassword = this.resetForm.get('confirmaPassword')?.value;

      if (nuevaPassword && confirmaPassword) {
        if (confirmaPassword !== nuevaPassword) {
          this.toastr.error('Las contraseñas no coinciden', 'Error', {
            positionClass: 'toast-bottom-left',
          });
          //si no coinciden limpiar formulario
          this.resetForm.reset();
        }
      }
    }
  }
}
