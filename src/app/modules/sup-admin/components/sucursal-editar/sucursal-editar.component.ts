import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeEmergentesComponent } from '../mensaje-emergentes/mensaje-emergentes.component';
import { franquiciaService } from 'src/app/service/franquicia.service';

@Component({
  selector: 'app-sucursal-editar',
  templateUrl: './sucursal-editar.component.html',
  styleUrls: ['./sucursal-editar.component.css']
})
export class SucursalEditarComponent implements OnInit {

  estatus: number = 0;
  formularioSucursales: FormGroup;
  gimnasio: any;
  franquicia: any;
  elID: any;
  message: string = '';

  constructor(
    private formulario: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private gimnasioService: GimnasioService,
    public dialog: MatDialog,
    private franquiciaService: franquiciaService,
  ) {
  
    this.elID = this.activeRoute.snapshot.paramMap.get('id');
    console.log("este es el id que se pasa :", this.elID);
   
    this.formularioSucursales = this.formulario.group({
     nombreGym: ["", Validators.required],
     codigoPostal: ["", Validators.required],
      estado: ["", Validators.required],
      ciudad: ["", Validators.required],
      colonia: ["", Validators.required],
      calle: ["", Validators.required],
      numExt: ["", Validators.required],
      numInt: [""],
      telefono:  ['', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9][0-9]*)$/)])],
      tipo: ["", Validators.required],
      Franquicia_idFranquicia: ["", Validators.required],
      casilleros: ["", Validators.required],
      estacionamiento: ["", Validators.required],
      regaderas: ["", Validators.required],
      bicicletero: ["", Validators.required],
      estatus: [""]
    });
  }

  ngOnInit(): void {
    this.franquiciaService.obternerFran().subscribe((respuesta) => {
      console.log(respuesta);
      if (Array.isArray(respuesta)) {
        this.franquicia = respuesta.map((dato) => ({
          value: dato.idFranquicia, // Valor que se enviará al seleccionar
          label: dato.nombre, // Etiqueta que se mostrará en el combo
        }));
      } else {
        console.error('La respuesta no es un arreglo.');
      }
    });
    

    this.gimnasioService.consultarPlan(this.elID).subscribe(
      (respuesta) => {
        if(respuesta){
        this.formularioSucursales.setValue({
          nombreGym: respuesta[0]['nombreGym'],
          estado: respuesta[0]['estado'],
          ciudad: respuesta[0]['ciudad'],
          colonia: respuesta[0]['colonia'],
          calle: respuesta[0]['calle'],
          codigoPostal: respuesta[0]['codigoPostal'],
          numExt: respuesta[0]['numExt'],
          numInt: respuesta[0]['numInt'],
          telefono: respuesta[0]['telefono'],
          tipo: respuesta[0]['tipo'],
          Franquicia_idFranquicia: respuesta[0]['Franquicia_idFranquicia'],
          casilleros: respuesta[0]['casilleros'],
          estacionamiento: respuesta[0]['estacionamiento'],
          regaderas: respuesta[0]['regaderas'],
          bicicletero: respuesta[0]['bicicletero'],
          estatus: respuesta[0]['estatus'],
        }); 
        console.log("solo la respuesta: ", respuesta);
        this.estatus = this.formularioSucursales.value.estatus;
        console.log("solo el estatus: ", this.estatus);
        //console.log("datos del gimnasio seleccionado: ", this.formularioSucursales.value);
      }
      },
      (error) => {
        console.log("Error al consultar: ", error);
      }
    );
  }

  actualizar() {
    console.log(this.formularioSucursales.value);
    this.gimnasioService.actualizarPlan(this.elID, this.formularioSucursales.value).subscribe(() => {
      this.dialog.open(MensajeEmergentesComponent, {
        data: 'Sucursal actualizada exitosamente',
      })
        .afterClosed()
        .subscribe((cerrarDialogo: Boolean) => {
          if (cerrarDialogo) {
            this.router.navigateByUrl("/sup-admin/lista-sucursales");
          } else {
          }
        });
    });
  }
}




