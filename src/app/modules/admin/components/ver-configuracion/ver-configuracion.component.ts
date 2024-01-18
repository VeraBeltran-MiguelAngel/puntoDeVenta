import { Component, OnInit } from '@angular/core';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { horarioService } from 'src/app/service/horario.service';
import { AuthService } from 'src/app/service/auth.service';
import { HorariosComponent } from '../horarios/horarios.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-configuracion',
  templateUrl: './ver-configuracion.component.html',
  styleUrl: './ver-configuracion.component.css'
})
export class VerConfiguracionComponent implements OnInit {

  gimnasio: any;
  idGimnasio: any;
  datosHorario: any[] = [];
  message: string = "";
  item: any; 
  id:any;

  constructor(
    private gimnasioService: GimnasioService,
    private HorarioService: horarioService,
    private auth: AuthService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.gimnasioService.consultarPlan(this.auth.getIdGym()).subscribe(respuesta => {
      this.gimnasio = respuesta;
    });
    this.consultarHorario();

    this.id=this.auth.getIdGym();
  }

  consultarHorario() {
    this.HorarioService.consultarHorario(this.auth.getIdGym()).subscribe(
      (data) => {
        this.datosHorario = data;  // Asigna los datos a la propiedad
      },
      (error) => {
        this.message = "Horario no disponible";
      }
    );
  }

  agregarHorario(idGimnasio: number): void {
    console.log("idGimnasio", idGimnasio);
    const dialogRef = this.dialog.open(HorariosComponent, {
      width: '60%',
      height: '90%',
      data: { idGimnasio: idGimnasio },
    });
  }
}
