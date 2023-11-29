import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TablaProductosTransferenciaComponent } from '../modules/recepcion/components/tablaProductosTransferencia/tablaProductosTransferencia.component';

@Injectable({
  providedIn: 'root',
})
export class TablaEmergenteService {
  constructor(public dialog: MatDialog) {}

  abrirVentanaEmergente(): void {
    const dialogRef = this.dialog.open(TablaProductosTransferenciaComponent, {
      width: '90%', // Puedes ajustar el ancho según tus necesidades
    });
  }
}
