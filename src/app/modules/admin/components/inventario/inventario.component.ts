import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/service/auth.service';
import { ProductosService } from 'src/app/service/productos.service';
import { Inventario } from '../models/inventario';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { MensajeEliminarComponent } from 'src/app/modules/recepcion/components/mensaje-eliminar/mensaje-eliminar.component';
import { TestService } from 'src/app/service/test.service';
//import { UsuarioidService } from 'src/app/service/usuarioid.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  //titulos de columnas de la tabla
  displayedColumns: string[] = [
    'Código De Barras',
    'Categoría',
    'Nombre',
    'Descripción',
    'Precio De Venta',
    'Cantidad Disponible',
    'Eliminar',
  ];

  listInventarioData: Inventario[] = [];
  dataSource: any; // instancia para matTableDatasource
  ubicacion: string;
  message: string = "";

  //paginator es una variable de la clase MatPaginator
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private auth: AuthService,
    private productoService: ProductosService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public testService:TestService,
    //public iduserService: UsuarioidService,
  ) {}

  ngOnInit(): void {
    this.ubicacion = this.auth.getUbicacion();
    this.productoService.obternerInventario().subscribe((respuesta)=>{
      console.log(respuesta);
      this.listInventarioData=respuesta;
      this.dataSource= new MatTableDataSource(this.listInventarioData);
      this.dataSource.paginator = this.paginator;
      
      /*this.iduserService.idUsuario$.subscribe((idUsuario) => {
        console.log('ID de Usuario en este componente:', idUsuario);
        // Puedes hacer lo que necesites con el idUsuario aquí
      });*/
    });
  }

  /*eliminar(idInventario: number, cantidad: number): void {
    //console.log(idInventario);
    if(cantidad == 0){
      this.dialog.open(MensajeEliminarComponent, {
        data: `¿Desea eliminar este producto?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.iduserService.idUsuario$.subscribe((idUsuario) =>{
            console.log('ID de Usuario en este componente:', idUsuario);

            this.productoService.borrarProductoInventario(idInventario,idUsuario).subscribe((data) => {
              if(data.msg == 'Info'){
                this.toastr.success('El producto fue eliminado del inventario.', 'Éxito');
              }
              //window.location.reload();    
              this.ngOnInit();
            });
        
          },
          (error) => {
            console.log("Error al eliminar:", error);
            this.toastr.error('Error al eliminar', 'Error');
          });
        } else {

        }
      });
    } else{
      this.toastr.error(`Aún hay ${cantidad} productos para vender.`, 'Error');
    }
  }*/

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
