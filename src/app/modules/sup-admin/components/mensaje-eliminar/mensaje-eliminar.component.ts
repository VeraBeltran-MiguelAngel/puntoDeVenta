import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GimnasioService } from 'src/app/service/gimnasio.service';

@Component({
  selector: 'app-mensaje-eliminar',
  templateUrl: './mensaje-eliminar.component.html',
  styleUrls: ['./mensaje-eliminar.component.css']
})
export class MensajeEliminarComponent {
  constructor(private gimnasioService: GimnasioService,
    public dialogo: MatDialogRef<MensajeEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    cerrarDialogo(): void {
      this.dialogo.close(false);
      console.log("te has arrepentido ok");
      this.gimnasioService.botonEstado.next(false);
    }
    confirmado(): void {
      this.dialogo.close(true);
      console.log("SE HA DESACTIVADO LA SUCURSAL");
      this.gimnasioService.botonEstado.next(true);
    }

  ngOnInit() {
  }

}

