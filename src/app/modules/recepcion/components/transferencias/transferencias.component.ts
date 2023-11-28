import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
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
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
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
  /**
   * * esta lista debe ser de tipo any por que tiene keys personalizados y para compararlos
   * * ya no puede seguir al tipo de dato Inventario
   * esta lista mustra la cantidad disponible de los productos
   */
  listInventarioData: any[] = [];
  selectedProducts: Producto[] = []; //lista de productos seleccionados para trasnferir

  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'id',
    'categoria',
    'nombre',
    'tamaño',
    'descripcion',
    'precio',
    'cantidad',
    'acciones',
  ];

  productData: Producto[] = []; //para guardar la respuesta del api en un arreglo
  dataSource: any; // instancia para matTableDatasource

  //paginator es una variable de la clase MatPaginator
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private gym: GimnasioService,
    private datePipe: DatePipe,
    private productoService: ProductosService,
    private toastr: ToastrService
  ) {
    this.idGymOrigen = this.auth.getIdGym();
    this.idUsuario = this.auth.getIdUsuario();
    this.fechaEnvio = this.obtenerFechaActual();

    this.form = this.fb.group({
      idGymOrigen: [this.idGymOrigen],
      idGimnasio: ['', Validators.compose([Validators.required])],
      idUsuario: [this.idUsuario],
      fechaEnvio: [this.fechaEnvio],
    });
  }

  ngOnInit(): void {
    this.ubicacion = this.auth.getUbicacion();

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

    //llenar la tabla de productos
    this.productoService.obternerProductos().subscribe((respuesta) => {
      // console.log(respuesta);
      this.productData = respuesta;
      this.dataSource = new MatTableDataSource(this.productData);
      this.dataSource.paginator = this.paginator;
    });

    //traer las cantidades disponibles del inventario
    this.productoService.obternerInventario().subscribe((respuesta) => {
      console.log('Inventario de productos con cantidad disponible', respuesta);
      this.listInventarioData = respuesta;
    });
  }

  registrar(): any {
    console.log('selectedProducts:', this.selectedProducts);

    // Verificar si no se han agregado productos
    if (this.selectedProducts.length === 0) {
      // Marcar el control correspondiente como inválido
      const idGymDestino = this.form.get('idGimnasio');
      if (idGymDestino) {
        //agregar el error al control del formulario
        idGymDestino.setErrors({ noProductsAdded: true });
      }
      // Salir de la función
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

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Metodo para ir agregando productos a la lista de productos seleccionados
   * para transferirlos a otra sucursal
   * @param producto
   */
  agregaraTransferencia(producto: Producto) {
    /**
     * el método busca si el producto que se está intentando agregar
     * existe en la lista de productos seleccionados
     */
    const productoExistente = this.selectedProducts.find(
      (p) => p.id === producto.id
    );

    /**
     * Si se encuentra un producto existente con el mismo id, significa que el producto ya ha sido agregado
     * al carrito. En este caso, el código aumenta la cantidad del producto existente en la lista selectedProducts
     *  al agregar la cantidad del nuevo producto (producto.cantidad) a la cantidad existente del producto.
     */
    if (productoExistente) {
      productoExistente.cantidad += producto.cantidad;
    } else {
      this.selectedProducts.push({ ...producto });
    }

    console.log(this.selectedProducts);
    // Reiniciar la cantidad del producto
    producto.cantidad = 0;
  }
}
