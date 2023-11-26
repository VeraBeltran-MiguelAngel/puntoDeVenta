import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { GimnasioService } from 'src/app/service/gimnasio.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    formulario: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferenciasComponent implements OnInit {
  ubicacion: string;
  idGymOrigen: number;
  idGimnasio: number; //id del gimnasio de destino
  listaGym: any;
  dataSource: any; // instancia para matTableDatasource
  form: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private gym: GimnasioService
  ) {
    this.form = this.fb.group({
      idGimnasio: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.ubicacion = this.auth.getUbicacion();
    this.idGymOrigen = this.auth.getIdGym();

    //Traer la lista de gimnasios
    this.gym.gimnasiosLista().subscribe({
      next: (resultData) => {
        console.log(resultData);
        this.listaGym = resultData;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  registrar(): any {}

  /**
   * Metodo que se invoca cada que selecionas una opcion del select
   * @param event
   */
  infoGym(event: number) {
    console.log('Opción seleccionada:', event);
    this.idGimnasio = event;
  }
    /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
