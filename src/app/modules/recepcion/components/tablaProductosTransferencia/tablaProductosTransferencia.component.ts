import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../models/producto';
import { ProductosService } from 'src/app/service/productos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tabla-productos-transferencia',
  templateUrl: './tablaProductosTransferencia.component.html',
  styleUrls: ['./tablaProductosTransferencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaProductosTransferenciaComponent implements OnInit {
  selectedProducts: Producto[] = []; //lista de productos seleccionados para trasnferir
  faClose = faClose; //icono de busqueda
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
    private productoService: ProductosService,
    public dialogRef: MatDialogRef<TablaProductosTransferenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    //llenar la tabla de productos
    this.productoService.obternerProductos().subscribe((respuesta) => {
      // console.log(respuesta);
      this.productData = respuesta;
      this.dataSource = new MatTableDataSource(this.productData);
      this.dataSource.paginator = this.paginator;
    });
  }

  cerrarVentana(): void {
    this.dialogRef.close();
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
