import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-cargando',
  templateUrl: './mensaje-cargando.component.html',
  styleUrls: ['./mensaje-cargando.component.css']
})
export class MensajeCargandoComponent {
  constructor(
    public dialogo: MatDialogRef<MensajeCargandoComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string
  ) {}
  
}
