import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmergenteCargarFotoComponent } from '../emergente-cargar-foto/emergente-cargar-foto.component';


@Component({
  selector: 'app-emergente-info-cliente',
  templateUrl: './emergente-info-cliente.component.html',
  styleUrl: './emergente-info-cliente.component.css'
})

export class EmergenteInfoClienteComponent implements OnInit{

  duracion: any;
  photo: any;
  img = 'https://';
  constructor(public dialog: MatDialog,
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
    this.photo = this.img+this.data.foto
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
