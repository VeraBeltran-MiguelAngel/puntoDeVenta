import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notificaciones } from 'src/app/service/emailNoti.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeEmergentesComponent } from '../mensaje-emergentes/mensaje-emergentes.component';
import { Router } from '@angular/router';
import { MensajeCargandoComponent } from '../mensaje-cargando/mensaje-cargando.component';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  hide = true;
  form: FormGroup;
  enviandoCorreo = false; // Variable para controlar el estado de envío
  archivo = null;

  constructor(
    private fb: FormBuilder,
    private noti: notificaciones,
    public dialog: MatDialog,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      texto: ['', Validators.required],
      opcion: [''],
      archivo: ['']
    });
  }

  cargarImagen(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const archivo: File = inputElement.files[0];
      console.log(archivo); // Verificar si el archivo se está obteniendo correctamente
    }
  }

  onSubmit(): void {
    if (this.form.get('opcion')?.value === 'Clientes') {
    console.log('Hiciste clic en enviar');

    if (this.form.valid && !this.enviandoCorreo) {
      console.log('entra a clientes');
      const { nombre, texto, archivo } = this.form.value;
      this.enviandoCorreo = true; // Iniciar el estado de envío
      console.log('entra', this.form.value);
      console.log('true?', this.enviandoCorreo);
      // Mostrar el indicador de carga
      const dialogRef = this.dialog.open(MensajeCargandoComponent, {
        width: '400px',
        height: '300px',
        data: `Enviando notificación...`
      });

      this.noti.enviarMail(this.auth.getIdGym(),nombre, texto, archivo).subscribe(
        (respuesta) => {
          // Cerrar el diálogo después de haber procesado la respuesta
          dialogRef.close();
           console.log("noti",this.noti.enviarMail);
          this.dialog.open(MensajeEmergentesComponent, {
            data: `Notificacion enviada exitosamente`
          }).afterClosed().subscribe((cerrarDialogo: boolean) => {
            if (cerrarDialogo) {
              this.router.navigateByUrl('/admin/home');
            }
          });
          this.enviandoCorreo = false; // Restablecer el estado de envío
        },
        (error) => {
          // Cerrar el diálogo en caso de error
          dialogRef.close();

          console.error('Error al enviar el correo:', error);
          this.enviandoCorreo = false; // Restablecer el estado de envío
        }
      );
    }
    }else{
      if (this.form.get('opcion')?.value === 'Trabajadores') {
      console.log('Hiciste clic en enviar');
  
      if (this.form.valid && !this.enviandoCorreo) {
        console.log('entra a trabajadores');
        const { nombre, texto, archivo,opcion } = this.form.value;
        this.enviandoCorreo = true; // Iniciar el estado de envío
        console.log('entra', this.form.value);
        console.log('true?', this.enviandoCorreo);
        // Mostrar el indicador de carga
        const dialogRef = this.dialog.open(MensajeCargandoComponent, {
          width: '400px',
          height: '300px',
          data: `Enviando notificación...`
        });
  
        this.noti.enviarMailTrabajadores(nombre, texto, archivo).subscribe(
          (respuesta) => {
            // Cerrar el diálogo después de haber procesado la respuesta
            dialogRef.close();
             
            this.dialog.open(MensajeEmergentesComponent, {
              data: `Notificacion enviada exitosamente`
            }).afterClosed().subscribe((cerrarDialogo: boolean) => {
              if (cerrarDialogo) {
                this.router.navigateByUrl('/admin/home');
              }
            });
            this.enviandoCorreo = false; // Restablecer el estado de envío
          },
          (error) => {
            // Cerrar el diálogo en caso de error
            dialogRef.close();
  
            console.error('Error al enviar el correo:', error);
            this.enviandoCorreo = false; // Restablecer el estado de envío
          }
        );
      }
  
    }
    }
  }
  }
