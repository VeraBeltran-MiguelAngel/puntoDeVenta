import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { ColaboradorService } from 'src/app/service/colaborador.service';
import { CategoriaService } from 'src/app/service/categoria.service';
import { MatDialog } from "@angular/material/dialog";
import { MensajeEmergentesComponent } from "../mensaje-emergentes/mensaje-emergentes.component";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, formulario: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent {
  formularioCategoria: FormGroup;
  gimnasio: any;
  message: string = '';

  elID:any;

  constructor(public formulario:FormBuilder,
    private activeRoute: ActivatedRoute, 
    private categoriaService:CategoriaService,
    private router:Router,
    public dialog: MatDialog){
    this.elID=this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.elID);

    //llamar al servicio datos empleado - pasando el parametro capturado por url
    this.categoriaService.consultarCategoria(this.elID).subscribe(
      respuesta=>{
        //asignar valor a los campos correspondientes al fomulario
        this.formularioCategoria.setValue({
          nombre:respuesta [0]['nombre'],
          descripcion:respuesta [0]['descripcion'],
          estatus:respuesta [0]['estatus'],
          fechaCreacion:respuesta [0]['fechaCreacion']
        });
      }
    );


    //asignar validaciones a los campos de fomulario
    this.formularioCategoria = this.formulario.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: ['', Validators.required],
      fechaCreacion: ['', Validators.required]
    });
  }

  //insanciar objeto para manejar el tipo de error en las validaciones
  matcher = new MyErrorStateMatcher();

  //mandar a llamar el sevicio correspondiente al llenado del combo sucursal
  ngOnInit(): void {

  }

  cancelar() {
    this.router.navigateByUrl('/admin/categorias');
  }

  actualizar(){
    if (this.formularioCategoria.valid) {
    this.categoriaService.actualizarCategoria(this.elID,this.formularioCategoria.value).subscribe(()=>{

      this.dialog.open(MensajeEmergentesComponent, {
        data: `Categoria actualizada exitosamente`,
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
