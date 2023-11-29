import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { Producto } from '../models/producto';
import { ProductosService } from 'src/app/service/productos.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TablaEmergenteService } from 'src/app/service/tablaEmergente.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { TransferirProductoService } from 'src/app/service/transferirProducto.service';

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
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class TransferenciasComponent implements OnInit {
  ubicacion: string; //nombre del gym
  idGymOrigen: number;
  idGimnasio: number; //id del gimnasio de destino
  listaGym: any;
  idUsuario: number;
  fechaEnvio: string; //fecha de envio de la trasnferencia
  form: FormGroup;
  faSearch = faSearch; //icono de busqueda
  /**
   * * esta lista debe ser de tipo any por que tiene keys personalizados y para compararlos
   * * ya no puede seguir al tipo de dato Inventario
   * esta lista mustra la cantidad disponible de los productos
   */
  listInventarioData: any[] = [];
  selectedProducts: Producto[] = []; //lista de productos seleccionados para trasnferir (desde tabla emergente)
  productData: Producto[] = []; //para guardar la respuesta del api en un arreglo

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private gym: GimnasioService,
    private datePipe: DatePipe,
    private productoService: ProductosService,
    private toastr: ToastrService,
    private tablaEmergente: TablaEmergenteService,
    private transferencia: TransferirProductoService
  ) {
    this.idGymOrigen = this.auth.getIdGym();
    this.idUsuario = this.auth.getIdUsuario();
    this.fechaEnvio = this.obtenerFechaActual();
    this.ubicacion = this.auth.getUbicacion();

    // formulario
    this.form = this.fb.group({
      idGymOrigen: [this.idGymOrigen],
      idGimnasio: ['', Validators.compose([Validators.required])],
      idUsuario: [this.idUsuario],
      fechaEnvio: [this.fechaEnvio],
    });
  }

  ngOnInit(): void {
    //obtener los productos seleccionados de la tabla emergente
    this.productoService.getProductosSeleccionados().subscribe((productos) => {
      this.selectedProducts = [...productos]; // Crear una copia de la lista
      console.log('prodcutosSeleccionados:', this.selectedProducts);
    });

    //Traer la lista de gimnasios exepto el idGym que pertenece el usuario logueado
    this.gym.gimnasiosLista().subscribe({
      next: (resultData) => {
        console.log('lista de gimnasios sin filtrar', resultData);

        // Lista de IDs que deseas filtrar
        const idsAFiltrar = [this.idGymOrigen]; // Agrega los IDs que deseas filtrar

        // Filtrar la lista de gimnasios por idGimnasio
        this.listaGym = resultData.filter(
          (gimnasio: any) => !idsAFiltrar.includes(gimnasio.idGimnasio)
        );
        console.log('lista de gimnasios filtrados', this.listaGym);
      },
      error: (error) => {
        console.error(error);
      },
    });

    //traer las cantidades disponibles del inventario
    this.productoService.obternerInventario().subscribe((respuesta) => {
      console.log('Inventario de productos con cantidad disponible', respuesta);
      this.listInventarioData = respuesta;
    });
  }

  abrirVentana() {
    this.tablaEmergente.abrirVentanaEmergente();
  }
  // Función para limpiar el formulario
  limpiarFormulario(): void {
    this.form.reset();
  }

  registrar(): any {
    // Verificar si no se han agregado productos
    if (this.selectedProducts.length === 0) {
      this.toastr.error(
        'Debes agregar almenos un producto para hacer una transferencia',
        'No hay productos para transferir'
      );
      return;
    }

    // Validar que la cantidad del producto sea mayor a 0
    const hasInvalidQuantity = this.selectedProducts.some(
      (producto) => producto.cantidad <= 0 || producto.cantidad === null
    );

    if (hasInvalidQuantity) {
      // Mostrar mensaje de error con ToastrService
      this.toastr.error(
        'La cantidad del producto debe ser mayor a 0 y diferente de nulo.',
        'Error en la cantidad del producto'
      );
      return;
    }

    // Obtener los nombres de los productos que exceden la cantidad disponible en el inventario
    const exceededProductsNames: string[] = [];

    // Validar que la cantidad solicitada no sobrepase la cantidad disponible en el inventario
    let exceedsInventoryQuantity = this.selectedProducts.some((producto) => {
      // debugger;
      const inventoryProduct = this.listInventarioData.find(
        (invProducto) => invProducto.idProducto === producto.id
      );
      if (
        inventoryProduct &&
        producto.cantidad > inventoryProduct['cantidad disponible']
      ) {
        //si la cantidad solicitada excede la disponible se coloca el nombre del producto que la excede
        exceededProductsNames.push(producto.nombre);
      }

      return false;
    });

    //si se agrego mas de un nombre en la lista de exedentes
    if (exceededProductsNames.length > 0) {
      exceedsInventoryQuantity = true;
    }
    console.log(exceedsInventoryQuantity);

    //Si excede la cantidadDisponible del inventario
    if (exceedsInventoryQuantity) {
      console.log(exceededProductsNames);

      // Crear mensaje de error con los nombres que excede la cantidad disponible
      const errorMessage = `La cantidad solicitada de ${exceededProductsNames.join(
        ', '
      )} ${
        exceededProductsNames.length > 1 ? 'sobrepasan' : 'sobrepasa'
      } la cantidad disponible en el inventario.`;

      // Mostrar mensaje
      this.toastr.error(errorMessage, 'Error en la cantidad del producto');
      return;
    }

    if (this.form.valid) {
      console.log('formulario valido:', this.form.value);
      console.log('productos validos', this.selectedProducts);
      this.transferencia
        .transferirProductos(this.form.value, this.selectedProducts)
        .subscribe({
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
    }
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    return this.datePipe.transform(fechaActual, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  /**
   * Metodo que se invoca cada que selecionas una opcion del select
   * @param event
   */
  infoGym(event: number) {
    console.log('Opción seleccionada:', event);
    this.idGimnasio = event;
  }
}
