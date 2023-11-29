import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TablaProductosTransferenciaComponent } from '../modules/recepcion/components/tablaProductosTransferencia/tablaProductosTransferencia.component';

@Injectable({
  providedIn: 'root',
})
/**
 * Este servicio solo es para mostrar la tabla emergente de productos 
 * para las trasnferencias
 */
export class TablaEmergenteService {
  constructor(public dialog: MatDialog) {}

  abrirVentanaEmergente(): void {
    const dialogRef = this.dialog.open(TablaProductosTransferenciaComponent, {
      width: '90%', // ajustar el ancho
    });
  }
}
