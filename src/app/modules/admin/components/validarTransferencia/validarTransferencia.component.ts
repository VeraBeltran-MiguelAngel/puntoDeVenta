import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'validar-transferencia',
  templateUrl: './validarTransferencia.component.html',
  styleUrls: ['./validarTransferencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidarTransferenciaComponent implements OnInit {

  ubicacion: string; //nombre del gym
  form: FormGroup;
  dataSource: any; // instancia para matTableDatasource
    //titulos de columnas de la tabla
    displayedColumns: string[] = [
      'folio transferencia',
      'sucursal origen',
      'sucursal destino',
      'fecha envio',
      'total',
      'acciones'
    ];

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.ubicacion = this.auth.getUbicacion();

    // formulario
    this.form = this.fb.group({});
  }
  ngOnInit(): void {}

  registrar() {}

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
