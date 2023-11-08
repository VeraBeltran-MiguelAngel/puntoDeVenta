import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit{
   //titulos de columnas de la tabla
   displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'estatus',
    'fechaCreacion',
    'acciones',
  ];

  dataSource: any; // instancia para matTableDatasource
   ngOnInit(): void {
     throw new Error('Method not implemented.');
   }

   /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
