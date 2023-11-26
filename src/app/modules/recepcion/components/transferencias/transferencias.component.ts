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
})
export class TransferenciasComponent implements OnInit {
  ubicacion: string; //nombre del gym
  idGymOrigen: number;
  idGimnasio: number; //id del gimnasio de destino
  listaGym: any;

  form: FormGroup;
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
    private productoService: ProductosService
  ) {
    this.form = this.fb.group({
      idGimnasio: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.ubicacion = this.auth.getUbicacion();
    this.idGymOrigen = this.auth.getIdGym();

    //Traer la lista de gimnasios exepto el idGym que pertenece el usuario logueado
    this.gym.gimnasiosLista().subscribe({
      next: (resultData) => {
        console.log('lista de gimnasios sin filtrar');
        console.log(resultData);

        // Lista de IDs que deseas filtrar
        const idsAFiltrar = [this.idGymOrigen]; // Agrega los IDs que deseas filtrar

        // Filtrar la lista de gimnasios por idGimnasio
        this.listaGym = resultData.filter(
          (gimnasio: any) => !idsAFiltrar.includes(gimnasio.idGimnasio)
        );
        console.log('lista de gimnasios filtrados');
        console.log(this.listaGym);
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.productoService.obternerProductos().subscribe((respuesta) => {
      // console.log(respuesta);
      this.productData = respuesta;
      this.dataSource = new MatTableDataSource(this.productData);
      this.dataSource.paginator = this.paginator;
    });
  }

  registrar(): any {}

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
     * existe en la lista de productos seleccionados (
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

    // Reiniciar la cantidad del producto
    producto.cantidad = 0;
  }
}
