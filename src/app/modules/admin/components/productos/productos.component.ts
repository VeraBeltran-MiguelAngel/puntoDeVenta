import { Component, OnInit, ViewChild } from '@angular/core';
import { ListaProductos } from '../models/listaProductos';
import { ProductosService } from 'src/app/service/productos.service';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MensajeEliminarComponent } from '../mensaje-eliminar/mensaje-eliminar.component';
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'codigo_de_barra',
    'nombre',
    'descripcion',
    'precio de venta',
    'estatus',
    'categoria', 

  ];
  public productos: any;
  listProductData: ListaProductos[] = [];
  dataSource: any; // instancia para matTableDatasource

    //paginator es una variable de la clase MatPaginator
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private productoService: ProductosService,
    private auth: AuthService,
    public dialog: MatDialog,
    ) {}
  ngOnInit(): void {

    /*this.productoService.getProductosAdmin().subscribe((respuesta)=>{
      console.log(respuesta);
      this.listProductData=respuesta;
      this.dataSource= new MatTableDataSource(this.listProductData);
      this.dataSource.paginator = this.paginator;
    });*/
    
    this.productoService.consultarProductoId(this.auth.getIdGym()).subscribe({
      next: (resultData) => {
        console.log('productos',resultData);
        this.productos = resultData;
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        console.log("this.paginator", this.dataSource.paginator);
      }
    })
  }

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  productoActiva: boolean;
 
  toggleCheckbox(id: number, estatus: number) {
    // Guarda el estado actual en una variable temporal
    console.log("id",id);
    const estadoOriginal = estatus;
    console.log('Estatus actual:', estadoOriginal);
  
    const dialogRef = this.dialog.open(MensajeEliminarComponent, {
      data: `¿Desea cambiar el estatus de la categoría?`, 
    });
  
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        // Invierte el estado actual de la categoría
        const nuevoEstado = estatus == 1 ? { estatus: 0 } : { estatus: 1 };
        console.log('Nuevo estado:', nuevoEstado);
  
        // Actualiza el estado solo si el usuario confirma en el diálogo
        this.actualizarEstatus(id, nuevoEstado);
        
      } else {
        // Si el usuario cancela, vuelve al estado original
        console.log('Acción cancelada, volviendo al estado original:', estadoOriginal);
        // Puedes decidir si deseas revertir visualmente la interfaz aquí
      }
    });
  }
  
  

  actualizarEstatus(id: number, estado: { estatus: number }) {
    console.log(estado.estatus, "nuevo");
    this.productoService.updateProductoStatus(id, estado).subscribe(
      (respuesta) => {
        console.log('Membresía actualizada con éxito:', respuesta);
        this.productoActiva = estado.estatus == 1;
      },
      (error) => {
        console.error('Error al actualizar la membresía:', error);
        // Maneja el error de alguna manera si es necesario.
      }
    );
  }
}
