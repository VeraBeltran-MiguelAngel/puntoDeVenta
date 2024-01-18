import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

export interface Cliente {
  nombre: string;
  apellido: string;
  imagenUrl: string;
  // Otros campos del cliente...
}

@Component({
  selector: 'app-emergente-info-cliente',
  templateUrl: './emergente-info-cliente.component.html',
  styleUrl: './emergente-info-cliente.component.css'
})

export class EmergenteInfoClienteComponent implements OnInit{
  cliente: Cliente;

  duracion: any;
  constructor(
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

    this.cliente = {
      nombre: 'Juan',
      apellido: 'Pérez',
      imagenUrl: 'https://www.fundacionaquae.org/wp-content/uploads/2018/10/proteger-a-los-animales-1024x654.jpg',
      // Otros detalles...
    };
  }
}
