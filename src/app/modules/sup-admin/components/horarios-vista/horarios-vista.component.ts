
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { horarioService } from 'src/app/service/horario.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HorarioEditarComponent } from '../horario-editar/horario-editar.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MensajeEliminarComponent } from '../mensaje-eliminar/mensaje-eliminar.component';

@Component({
  selector: 'app-horarios-vista',
  templateUrl: './horarios-vista.component.html',
  styleUrls: ['./horarios-vista.component.css']
})
export class HorariosVistaComponent implements OnInit{
  idGimnasio: any; // Asegúrate de obtener el ID de alguna manera, por ejemplo, a través de ActivatedRoute
  datosHorario: any[] = [];
  message: string = "";
  constructor(private gimnasioService: GimnasioService, private HorarioService: horarioService,private route: ActivatedRoute,
    public dialogo: MatDialogRef<HorariosVistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) {
    // Obtén el ID del parámetro de la URL
    this.idGimnasio = this.route.snapshot.params['id'];
    this.idGimnasio = data.idGimnasio; // Accede a idGimnasio desde los datos
    console.log("id",this.idGimnasio);
  }

  ngOnInit(): void {
    // Llama a la función de consulta al cargar el componente
    this.consultarHorario();
  }
  consultarHorario() {
    this.HorarioService.consultarHorario(this.idGimnasio).subscribe(
      (data) => {
        this.datosHorario = data;  // Asigna los datos a la propiedad
        console.log('Datos del horario:', this.datosHorario);
      },
      (error) => {
        this.message = "Horario no disponible";
        console.error('Error al consultar el horario:', error);
      }
    );
  }

  // En tu componente
cerrarDialogo(): void {
  this.dialogo.close();
}

verHorario(idGimnasio: string): void {
  const dialogRef = this.dialog.open(HorarioEditarComponent, {
    width:'60%',
    height:'90%',
    data: { idGimnasio: idGimnasio },
  });
}


borrarPlan(id: any) {
  console.log(id);
  this.dialog.open(MensajeEliminarComponent, {
    data: `¿Desea eliminar este horario?`,
  })
  .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.HorarioService.borrarHorario(id).subscribe((respuesta) => {
          console.log("si entro") 
          window.location.reload();       
        });
      } else {
        
      }
    });
 }

}
