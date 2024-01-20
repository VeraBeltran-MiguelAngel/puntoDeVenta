import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GimnasioService } from 'src/app/service/gimnasio.service';

@Component({
  selector: 'app-mensaje-eliminar',
  templateUrl: './mensaje-eliminar.component.html',
  styleUrls: ['./mensaje-eliminar.component.css']
})
export class MensajeEliminarComponent {
  idGimnasio: any; // Asegúrate de inicializar este valor correctamente

  constructor(
    private gimnasioService: GimnasioService,
    public dialogo: MatDialogRef<MensajeEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idGimnasio = data.idGimnasio;
  }

  /*confirmado(): void {
    this.dialogo.close(true);
    console.log("SE HA DESACTIVADO LA SUCURSAL");
    this.gimnasioService.botonEstado.next({respuesta: this.data.mensaje.includes('desactivar'), idGimnasio: this.idGimnasio});
  }
  
  cerrarDialogo(): void {
    this.dialogo.close(false);
    console.log("te has arrepentido ok");
    this.gimnasioService.botonEstado.next({respuesta: this.data.mensaje.includes('activar'), idGimnasio: this.idGimnasio});
  }*/

  confirmado(): void {
    this.dialogo.close(true);
    this.gimnasioService.botonEstado.next({ respuesta: true, idGimnasio: this.idGimnasio });
  }
  
  cerrarDialogo(): void {
    this.dialogo.close(false);
    this.gimnasioService.botonEstado.next({ respuesta: false, idGimnasio: this.idGimnasio });
  }
  


  ngOnInit() {
    console.log(this.data.mensaje); // Esto debería imprimir "¿Deseas desactivar esta sucursal?"
  }

}

