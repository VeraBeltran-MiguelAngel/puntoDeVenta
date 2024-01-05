import { Component, OnInit } from '@angular/core';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { horarioService } from 'src/app/service/horario.service';
import { AuthService } from 'src/app/service/auth.service';

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

  constructor(
    private gimnasioService: GimnasioService,
    private HorarioService: horarioService,
    private auth: AuthService
  ){}

  ngOnInit(): void {
    this.gimnasioService.consultarPlan(this.auth.getIdGym()).subscribe(respuesta => {
      
      this.gimnasio = respuesta;
      console.log("respuesta", this.gimnasio);
    });
    this.consultarHorario();
  }

  consultarHorario() {
    this.HorarioService.consultarHorario(this.auth.getIdGym()).subscribe(
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
}
