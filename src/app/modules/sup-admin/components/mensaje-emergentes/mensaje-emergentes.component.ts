import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-emergentes',
  templateUrl: './mensaje-emergentes.component.html',
  styleUrls: ['./mensaje-emergentes.component.css'],
})
export class MensajeEmergentesComponent implements OnInit {
  constructor(
    public dialogo: MatDialogRef<MensajeEmergentesComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string
  ) {}

  cerrarDialogo(): void {
    this.dialogo.close(true);
  }

  ngOnInit(): void {
    
  }
}
