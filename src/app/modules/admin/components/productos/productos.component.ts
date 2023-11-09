import { Component, OnInit } from '@angular/core';
import { ListaProductos } from '../models/listaProductos';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'idProducto',
    'nombre',
    'tamaño',
    'descripcion',
    'precio de venta',
    'estatus',
    'categoria',
  ];

  listProductData: ListaProductos[] = [];
  dataSource: any; // instancia para matTableDatasource

  constructor(private productoService: ProductosService) {}
  ngOnInit(): void {}

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
