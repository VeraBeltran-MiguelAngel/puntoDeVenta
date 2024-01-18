import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/service/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MensajeEmergentesComponent } from '../mensaje-emergentes/mensaje-emergentes.component';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-alta-categoria',
  templateUrl: './alta-categoria.component.html',
  styleUrls: ['./alta-categoria.component.css']
})
export class AltaCategoriaComponent implements OnInit {
  formularioCategoria: FormGroup;
  message: string = '';
  hide = true;
  gimnasio: any;

  constructor(
    public formulario: FormBuilder,
    private router: Router,
    private categoriaService: CategoriaService,
    private gimnasioService: GimnasioService,
    private auth: AuthService,
    public dialog: MatDialog
  ) {
    this.formularioCategoria = this.formulario.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      gimnasio_id:[this.auth.getIdGym()],
    });
  }

  ngOnInit(): void {
    
  }

  cancelar() {
    this.router.navigateByUrl('/admin/categorias');
  }

  enviar(): any {
    console.log(this.formularioCategoria.value);
    // Verifica si el formulario es válido
    if (this.formularioCategoria.valid) {
      this.categoriaService
        .agregarCategoria(this.formularioCategoria.value)
        .subscribe((respuesta) => {
          this.dialog
            .open(MensajeEmergentesComponent, {
              data: `Categoria agregada exitosamente`,
            })
            .afterClosed()
            .subscribe((cerrarDialogo: Boolean) => {
              if (cerrarDialogo) {
                this.router.navigateByUrl('/admin/categorias');
              } else {
              }
            });
        });
    } else {
      // El formulario no es válido, muestra un mensaje de error
      this.message = 'Por favor, complete todos los campos requeridos.';
    }
  }
}
