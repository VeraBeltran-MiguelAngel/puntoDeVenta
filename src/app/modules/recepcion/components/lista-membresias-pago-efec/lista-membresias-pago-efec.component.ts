import { Component, OnInit, ViewChild } from '@angular/core';
import { PagoMembresiaEfectivoService } from 'src/app/service/pago-membresia-efectivo.service'
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import { MensajeEmergenteComponent } from '../mensaje-emergente/mensaje-emergente.component';
import { MatDialog } from "@angular/material/dialog";
import { Router,  ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-membresias-pago-efec',
  templateUrl: './lista-membresias-pago-efec.component.html',
  styleUrls: ['./lista-membresias-pago-efec.component.css']
})

export class ListaMembresiasPagoEfecComponent implements OnInit{
  clientePago: any;
  clienteActivo: any;
  //dataSource: any[] = []; // Inicializa tu fuente de datos
  dataSource: any; // instancia para matTableDatasource
  dataSourceActivos: any;
  //titulos de columnas de la tabla de pago online
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Sucursal',
    'Membresia',
    'Precio',
    'Status',
    'Dinero recibido',
    'Pagar',
  ];
  //titulos de columnas de la tabla clientes activos
  displayedColumnsActivos: string[] = [
    'ID',
    'Nombre',
    'Sucursal',
    'Membresia',
    'Info_Membresia',
    'Fecha_Inicio',
    'Fecha_Fin',
    'Status',
  ];
  dineroRecibido: number; // =0
  IDvalid: number;

  //paginator es una variable de la clase MatPaginator
  @ViewChild('paginatorPagoOnline', { static: true }) paginator!: MatPaginator;
  @ViewChild('paginatorActivos', { static: true }) paginatorActivos!: MatPaginator;

  constructor(private pagoService: PagoMembresiaEfectivoService,public dialog: MatDialog, private router: Router, private toastr: ToastrService){

  }

  ngOnInit(): void{
    this.pagoService.obternerDataMem().subscribe(respuesta=>{
      console.log(respuesta);
      this.clientePago = respuesta;
      this.dataSource = new MatTableDataSource(this.clientePago);
      this.dataSource.paginator = this.paginator;
    });


    this.pagoService.obtenerActivos().subscribe(response=>{
      console.log(response);
      this.clienteActivo = response;
      this.dataSourceActivos = new MatTableDataSource(this.clienteActivo);
      this.dataSourceActivos.paginator = this.paginatorActivos;
    });
  }

  //Filtrar la informacion que escribe el usaurio
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterActivos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceActivos.filter = filterValue.trim().toLowerCase();
  }

  //Se resta el dinero recibido del precio
  realizarCalculo(prod: any): void {
    if(prod.dineroRecibido >= prod.Precio){
      prod.PrecioCalculado = prod.dineroRecibido - prod.Precio ;
      console.log(prod.PrecioCalculado)

      this.pagoService.idPagoSucursal(prod.ID, prod.idDetMem).subscribe((response: any) => {
        console.log(response.msg)

        // Eliminar la fila de la tabla uno
        const index = this.dataSource.data.indexOf(prod);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription(); // Notificar a la tabla sobre el cambio
        }
        
        // Agregar y Actualizar la fila a la tabla dos (dataSourceActivos)
        this.pagoService.obtenerActivos().subscribe(response => {
          console.log(response);
          this.clienteActivo = response;
          // Actualizar la fuente de datos de la segunda tabla (dataSourceActivos)
          this.dataSourceActivos.data = this.clienteActivo.slice();
          // Notificar a la tabla sobre el cambio
          this.dataSourceActivos._updateChangeSubscription();
        });

        this.dialog.open(MensajeEmergenteComponent, {
          data: `Pago exitoso, el cambio es de: $${prod.PrecioCalculado}`,
        })
        .afterClosed()
        .subscribe((cerrarDialogo: Boolean) => {
          if (cerrarDialogo) {
            // Recargar la página actual
            //location.reload();
            //this.router.navigateByUrl(`/index/`);
          } else {
  
          }
        });
      });
    }else{
      this.toastr.error('No alcanza para pagar esta membresia', 'Error!!!');
    }
  }


}