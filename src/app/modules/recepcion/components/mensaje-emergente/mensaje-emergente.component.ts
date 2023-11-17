import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-emergente',
  templateUrl: './mensaje-emergente.component.html',
  styleUrls: ['./mensaje-emergente.component.css']
})
export class MensajeEmergenteComponent implements OnInit{
  
  constructor(
    public dialogo: MatDialogRef<MensajeEmergenteComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    cerrarDialogo(): void {
      this.dialogo.close(true);
    }
    /*confirmado(): void {
      this.dialogo.close(true);
    }*/

  ngOnInit() {
  }

}
