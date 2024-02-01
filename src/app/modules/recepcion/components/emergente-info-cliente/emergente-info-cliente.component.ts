import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmergenteCargarFotoComponent } from '../emergente-cargar-foto/emergente-cargar-foto.component';
import { PagoMembresiaEfectivoService } from 'src/app/service/pago-membresia-efectivo.service';
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla

@Component({
  selector: 'app-emergente-info-cliente',
  templateUrl: './emergente-info-cliente.component.html',
  styleUrl: './emergente-info-cliente.component.css'
})

export class EmergenteInfoClienteComponent implements OnInit{
  currentDate: Date = new Date();
  duracion: any;
  photo: any;
  img = 'https://';
  dataSource: any;
  //titulos de columnas de la tabla Reenovacion de membresias
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Membresía',
    'Precio',
    'Duración',
    'Fecha Inicio',
    'Fecha Fin',
    'Status',
  ];
  membresiaHisto: any;
  item: any;
  //paginator es una variable de la clase MatPaginator
  @ViewChild('paginatorHistorialMembre', { static: true }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog,
    private pagoService: PagoMembresiaEfectivoService,
    public dialogo: MatDialogRef<EmergenteInfoClienteComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any) { }   //public mensaje: string,

  cerrarDialogo(): void {
    this.dialogo.close(true);
  }
  /*confirmado(): void {
    this.dialogo.close(true);
  }*/

  ngOnInit() {

    this.duracion = this.data.duracion + ' ' + 'días';
    this.photo = this.img+this.data.foto;
    console.log('idclienteeeee:',this.data.idCliente)
  
    this.pagoService.histoClienteMemb(this.data.idCliente).subscribe((respuesta) => {
      console.log('historial:',respuesta);
      this.membresiaHisto = respuesta;
      this.dataSource = new MatTableDataSource(this.membresiaHisto);
      this.dataSource.paginator = this.paginator;
    });
  }

  estaEnRango(fechaInicio: string, fechaFin: string): boolean {
    const fechaInicioDate = this.parseFecha(fechaInicio);
    const fechaFinDate = this.parseFecha(fechaFin);
    return this.currentDate >= fechaInicioDate && this.currentDate <= fechaFinDate;
  }
  
  private parseFecha(fecha: string): Date {
    const partes = fecha.split('/');
    return new Date(+partes[2], +partes[1] - 1, +partes[0]);
  }

  abrirDialogFoto(data: any): void {
    this.dialogo.close(true);
    this.dialog.open(EmergenteCargarFotoComponent, {
      data: {
        clienteID: `${data.idCliente}`
      },
    })
    .afterClosed()
    .subscribe((cerrarDialogo: Boolean) => {
      if (cerrarDialogo) {

      } else {

      }
    });
  }

  
}
