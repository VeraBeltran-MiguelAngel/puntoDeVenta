import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/service/resetPassword.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private resetPass: ResetPasswordService
  ) {
    this.resetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    console.log('Hiciste clic en enviar');
    console.log(this.resetForm.value);
    if (this.resetForm.valid) {
      this.resetPass.enviarMail(this.resetForm.value).subscribe({
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
          }
        },
        error: (paramError) => {
          this.toastr.error(paramError.error.message, 'Error', {
            positionClass: 'toast-bottom-left',
          });
        },
      });
    }
  }

  getErrorMessage() {
    const usernameControl = this.resetForm.get('username');
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
