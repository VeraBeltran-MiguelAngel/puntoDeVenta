import { DatePipe } from '@angular/common'; //para obtener fecha del sistema
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { EntradasService } from 'src/app/service/entradas.service';
import { ProveedoresService } from 'src/app/service/proveedores.service';

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

/**
 * DEBES COLOCAR EL Providers o no se visualizan los input del formulario
 */
@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css'],
  providers: [DatePipe],
})
export class EntradasComponent implements OnInit {
  hide = true;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  ubicacion: string; //nombre del gym
  id: number; // id gym
  idUsuario: number;
  fechaRegistro: string; //fecha de ingreso del producto
  //Variables para guardar las lista de productos
  listaProductos: any;
  idProducto: number;

  //guardar lista proveedores y id
  listaProveedores: any;
  idProveedor: number;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private entrada: EntradasService,
    private proveedor: ProveedoresService
  ) {
    this.ubicacion = this.auth.getUbicacion();
    this.id = this.auth.getIdGym();
    this.idUsuario = this.auth.getIdUsuario();
    this.fechaRegistro = this.obtenerFechaActual();

    this.form = this.fb.group({
      idGym: [this.id],
      idProducto: ['', Validators.compose([Validators.required])],
      idProveedor: ['', Validators.compose([Validators.required])],
      idUsuario: [this.idUsuario],
      fechaEntrada: [this.fechaRegistro],
      cantidad: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/), //solo numeros enteros
        ]),
      ],
      precioCompra: [
        '',
        Validators.compose([
          Validators.pattern(/^\d+(\.\d{0,2})?$/), //solo acepta dos decimales
        ]),
      ],
    });
  }

  /**
   * Llenar los mat select
   */
  ngOnInit(): void {
    //Traer la lista de productos para mat select
    this.entrada.listaProductos().subscribe({
      next: (resultData) => {
        console.log(resultData);
        this.listaProductos = resultData;
      },
      error: (error) => {
        console.error(error);
      },
    });

    //lista de proveedores mat select
    this.proveedor.listaProveedores().subscribe({
      next: (resulData) => {
        console.log(resulData);
        // Transformar los nombres de propiedades para poder mostrar en mat select (no acepta espacios)
        this.listaProveedores = resulData.map(
          (proveedor: { [x: string]: any }) => {
            return {
              ...proveedor,
              nombreEmpresa: proveedor['razon social'],
            };
          }
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /**
   * Metodo que se invoca cada que selecionas una opcion del select
   * @param event
   */
  infoProducto(event: number) {
    console.log('Opción seleccionada:', event);
    this.idProducto = event;
  }

  /**
   * Metodo que se invoca cada que selecionas una opcion del select
   * @param event
   */
  infoProveedor(event: number) {
    console.log('Opción seleccionada proveedor:', event);
    this.idProveedor = event;
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    return this.datePipe.transform(fechaActual, 'yyyy-MM-dd') || '';
  }

  // Función para limpiar el formulario
  limpiarFormulario(): void {
    this.form.reset();
    
  }

  registrar(): any {
    console.log(this.form.value);
    if (this.form.valid) {
      this.entrada.agregarEntradaProducto(this.form.value).subscribe({
        next: (respuesta) => {
          console.log(respuesta);

          if (respuesta.success) {
            this.toastr.success(respuesta.message, 'Exito', {
              positionClass: 'toast-bottom-left',
            });
            this.limpiarFormulario();
          } else {
            this.toastr.error(respuesta.message, 'Error', {
              positionClass: 'toast-bottom-left',
            });
          }
        },
        error: (paramError) => {
          console.error(paramError); // Muestra el error del api en la consola para diagnóstico
          //accedemos al atributo error y al key
          this.toastr.error(paramError.error.message, 'Error', {
            positionClass: 'toast-bottom-left',
          });
        },
      });
    } else {
      this.toastr.error('Completa el formulario', 'Error', {
        positionClass: 'toast-bottom-left',
      });
    }
  }
}
