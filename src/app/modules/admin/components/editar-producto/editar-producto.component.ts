
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
//import { ColaboradorService } from 'src/app/service/colaborador.service';
import { ProductosService } from 'src/app/service/productos.service';
import { MatDialog } from "@angular/material/dialog";
import { MensajeEmergentesComponent } from "../mensaje-emergentes/mensaje-emergentes.component";
import { CategoriaService } from 'src/app/service/categoria.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, formulario: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent {
  form: FormGroup;
  gimnasio: any;
  message: string = '';
  producto: any;
  elID:any;
  idCategoria: number;
  listaCategorias: any;

  constructor(public fb:FormBuilder,
    private activeRoute: ActivatedRoute, 
    private productoService:ProductosService,
    private router:Router,
    public dialog: MatDialog,
    private categoriaService: CategoriaService,){
    this.elID=this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.elID);

    //llamar al servicio datos empleado - pasando el parametro capturado por url
    this.productoService.consultarProductosJ(this.elID).subscribe(
      
      respuesta=>{
        //asignar valor a los campos correspondientes al fomulario
        console.log(respuesta, "respuesta");
        this.form.setValue({
          nombre:respuesta [0]['nombre'],
          descripcion:respuesta [0]['descripcion'],
          Categoria_idCategoria:respuesta [0]['Categoria_idCategoria'],
          precio:respuesta [0]['precio'],
          precioCompra:respuesta [0]['precioCompra'],
          descuento:respuesta [0]['descuento'],
          porcentaje:respuesta [0]['porcentaje'],
          fechaCreacion:respuesta [0]['fechaCreacion'],
          codigoBarra:respuesta [0]['codigoBarra'],
          unidadMedicion:respuesta [0]['unidadMedicion'],
          cantidadUnidades:respuesta [0]['cantidadUnidades'],
          talla:respuesta [0]['talla'],
          color:respuesta [0]['color'],
          longitud:respuesta [0]['longitud'],
          sabor:respuesta [0]['sabor'],
          genero:respuesta [0]['genero'],
          marca:respuesta [0]['marca'],
        //  files:respuesta [0]['files'],
        });
      }
      
    );

    console.log( this.fb,"this.formularioProducto.setValue");
    this.form = this.fb.group({
      nombre: ['',Validators.compose([Validators.required,Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),]),],
      descripcion: ['', Validators.required],
      Categoria_idCategoria: ['', Validators.compose([Validators.required])],
      precio: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{0,2})?$/), //solo acepta dos decimales
        ]),
      ],
      precioCompra: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{0,2})?$/), //solo acepta dos decimales
        ]),
      ],

      descuento: ['', Validators.required],
      porcentaje: [0,Validators.compose([Validators.required,
          Validators.pattern(/^[0-9]+$/), //solo numeros enteros
        ]),
      ],
      fechaCreacion: [''],
      codigoBarra: [''],
      unidadMedicion: ['NA', Validators.compose([Validators.required])],
      cantidadUnidades: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/), //solo numeros enteros
        ]),
      ],
      talla: ['NA', Validators.compose([Validators.required])],
      color: [
        'NA',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u), //solo letras
        ]),
      ],
      longitud: ['NA'],
      sabor: [
        'NA',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),
        ]),
      ],
      genero: ['NA', Validators.compose([Validators.required])],
      marca: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),
        ]),
      ],
     // files: [[]], // Inicializa el control de archivos como un array vacío
    });
  }

  //insanciar objeto para manejar el tipo de error en las validaciones
  matcher = new MyErrorStateMatcher();

  //mandar a llamar el sevicio correspondiente al llenado del combo sucursal
  ngOnInit(): void {
    this.categoriaService.obternerCategoria().subscribe({
      next: (respuesta) => {
        this.listaCategorias = respuesta;
        console.log('lista de categorias:', this.listaCategorias);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  cancelar() {
    this.router.navigateByUrl('/admin/gestion-productos');
  }

  actualizar(){
    this.productoService.actualizarProducto(this.elID,this.form.value).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
        this.dialog.open(MensajeEmergentesComponent, {
          data: `Producto actualizado exitosamente`,
        })
        .afterClosed()
        .subscribe((cerrarDialogo: Boolean) => {
          if (cerrarDialogo) {
            this.router.navigateByUrl("/admin/gestion-productos");
          } else {
            
          }
        });
      },
      (error) => {
        console.error('Error al actualizar producto:', error);
        // Manejo de errores
      }
    );
}

infoCategoria(event: number) {
  console.log('Opción seleccionada:', event);
  this.idCategoria = event;
  console.log('valor idCategoria:', this.idCategoria);
}

}
