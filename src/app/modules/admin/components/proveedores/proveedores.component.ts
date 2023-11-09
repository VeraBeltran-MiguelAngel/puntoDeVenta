import { Component, OnInit } from '@angular/core';
import { Proveedores } from '../models/proveedores';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedoresService } from 'src/app/service/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'idProveedor',
    'nombre',
    'apellido paterno',
    'apellido materno',
    'razon social',
    'telefono',
    'acciones',
  ];

  listProveedorData: Proveedores[] = [];
  dataSource: any; // instancia para matTableDatasource
  constructor(private proveedorService: ProveedoresService) {}

  ngOnInit(): void {
    this.proveedorService.obtenerProveedores().subscribe((respuesta) => {
      console.log(respuesta);
      this.listProveedorData = respuesta;
      this.dataSource = new MatTableDataSource(this.listProveedorData);
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
