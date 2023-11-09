import { Component, OnInit, ViewChild } from '@angular/core';
import { ListaProductos } from '../models/listaProductos';
import { ProductosService } from 'src/app/service/productos.service';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla

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

    //paginator es una variable de la clase MatPaginator
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private productoService: ProductosService) {}
  ngOnInit(): void {

    this.productoService.getProductosAdmin().subscribe((respuesta)=>{
      console.log(respuesta);
      this.listProductData=respuesta;
      this.dataSource= new MatTableDataSource(this.listProductData);
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
