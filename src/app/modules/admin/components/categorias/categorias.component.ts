import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { CategoriasService } from 'src/app/service/categorias.service';
import { Categorias } from '../models/categorias';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'idCategoria',
    'nombre',
    'descripcion',
    'estatus',
    'fechaCreacion',
    'acciones',
  ];

  categoryData: Categorias[] = [];
  dataSource: any; // instancia para matTableDatasource

  //paginator es una variable de la clase MatPaginator
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private categoriaService: CategoriasService) {}
  ngOnInit(): void {
    this.categoriaService.obternerCategorias().subscribe((respuesta) => {
      console.log(respuesta);
      this.categoryData = respuesta;
      this.dataSource = new MatTableDataSource(this.categoryData);
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
