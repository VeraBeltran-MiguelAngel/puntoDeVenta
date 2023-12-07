import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/service/auth.service';
import { ProductosService } from 'src/app/service/productos.service';
import { Inventario } from '../models/inventario';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'codigo_de_barra',
    'categoria',
    'nombre',
    'descripcion',
    'precio de venta',
    'cantidad disponible',
  ];

  listInventarioData: Inventario[] = [];
  dataSource: any; // instancia para matTableDatasource
  ubicacion: string;

  //paginator es una variable de la clase MatPaginator
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private auth: AuthService,
    private productoService: ProductosService
  ) {}

  ngOnInit(): void {
    this.ubicacion = this.auth.getUbicacion();
    this.productoService.obternerInventario().subscribe((respuesta)=>{
      console.log(respuesta);
      this.listInventarioData=respuesta;
      this.dataSource= new MatTableDataSource(this.listInventarioData);
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
