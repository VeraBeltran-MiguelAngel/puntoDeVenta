import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeEmergentesComponent } from '../mensaje-emergentes/mensaje-emergentes.component';
import { franquiciaService } from 'src/app/service/franquicia.service';
import { MensajeEliminarComponent } from '../mensaje-eliminar/mensaje-eliminar.component';
import { DialogRef } from '@angular/cdk/dialog';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-sucursal-editar',
  templateUrl: './sucursal-editar.component.html',
  styleUrls: ['./sucursal-editar.component.css']
})
export class SucursalEditarComponent implements OnInit {

  estatusAlert: boolean = false;
  estatus: boolean = false;
  //estatus: number = 0;
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
      estatus: [false]
      //estatus: [0]
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
          estatus: respuesta[0]['estatus'] == 1,
          //estatus: respuesta[0]['estatus'],
        }); 
        console.log("solo la respuesta: ", respuesta);
        //this.estatus = this.formularioSucursales.value.estatus;
        
      }
        //FUNCIONA this.estatus = this.formularioSucursales.get('estatus')?.value;
        this.estatus = this.formularioSucursales.get('estatus')?.value;
        console.log("solo el estatus: ", this.estatus);
        if(!this.estatus){
         // this.formularioSucursales.disable();
         this.formularioSucursales.get('nombreGym')?.disable();
         this.formularioSucursales.get('estado')?.disable();
         this.formularioSucursales.get('ciudad')?.disable();
         this.formularioSucursales.get('colonia')?.disable();
         this.formularioSucursales.get('calle')?.disable();
         this.formularioSucursales.get('codigoPostal')?.disable();
         this.formularioSucursales.get('numExt')?.disable();
         this.formularioSucursales.get('numInt')?.disable();
         this.formularioSucursales.get('telefono')?.disable();
         this.formularioSucursales.get('tipo')?.disable();
         this.formularioSucursales.get('Franquicia_idFranquicia')?.disable();
        this.formularioSucursales.get('casilleros')?.disable();
        this.formularioSucursales.get('estacionamiento')?.disable();
        this.formularioSucursales.get('regaderas')?.disable();
        this.formularioSucursales.get('bicicletero')?.disable();
        } else {
          this.formularioSucursales.enable();
        }
      },
      (error) => {
        console.log("Error al consultar: ", error);
      }
    );

    /*this.gimnasioService.botonEstado.subscribe((estado) => {
      if (estado) {
        const formularioValues = this.formularioSucursales.value;
        formularioValues.estatus = formularioValues.estatus ? 1 : 0;
        this.gimnasioService.actualizarPlan(this.elID, this.formularioSucursales.value).subscribe(() => {
          this.dialog.open(MensajeEmergentesComponent, {
            data: 'Sucursal actualizada exitosamente',
          })
          /*.afterClosed()
          .subscribe((cerrarDialogo: Boolean) => {
            if (cerrarDialogo) {
              this.router.navigateByUrl("/sup-admin/lista-sucursales");
            } else {
            }
          });
        });
        this.formularioSucursales.get('nombreGym')?.disable();
         this.formularioSucursales.get('estado')?.disable();
         this.formularioSucursales.get('ciudad')?.disable();
         this.formularioSucursales.get('colonia')?.disable();
         this.formularioSucursales.get('calle')?.disable();
         this.formularioSucursales.get('codigoPostal')?.disable();
         this.formularioSucursales.get('numExt')?.disable();
         this.formularioSucursales.get('numInt')?.disable();
         this.formularioSucursales.get('telefono')?.disable();
         this.formularioSucursales.get('tipo')?.disable();
         this.formularioSucursales.get('Franquicia_idFranquicia')?.disable();
        this.formularioSucursales.get('casilleros')?.disable();
        this.formularioSucursales.get('estacionamiento')?.disable();
        this.formularioSucursales.get('regaderas')?.disable();
        this.formularioSucursales.get('bicicletero')?.disable();
        this.formularioSucursales.get('estatus')?.enable();
      } else {
        // Habilita los campos del formulario aquí
        this.formularioSucursales.enable();
        console.log("estoy conectado a boton estado jejejejej");
        this.formularioSucursales.get('estatus')?.setValue(true);
      }
    });*/
  }

  actualizar() {
    const formularioValues = this.formularioSucursales.value;
    formularioValues.estatus = formularioValues.estatus ? 1 : 0;

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

  onToggleChange(event: any) {
    if (!event.checked && this.estatus) {
      this.borrarSucursal(this.elID);
      console.log("Seguro?");
      console.log("desactivado");
      /*this.formularioSucursales.get('nombreGym')?.disable();
      this.formularioSucursales.get('codigoPostal')?.disable();*/
      // Agrega aquí todos los campos que quieras deshabilitar
      if(this.estatusAlert){
        this.formularioSucursales.enable();
      }else {
        this.formularioSucursales.disable();
      }
    } else {
      console.log("activado");
      this.formularioSucursales.enable();
      //this.formularioSucursales.get('codigoPostal')?.enable();
      // Agrega aquí todos los campos que quieras habilitar
    }
  }

  borrarSucursal(idGimnasio: any) {
    console.log(idGimnasio);
    this.dialog.open(MensajeEliminarComponent,{
      data: `¿Deseas desactivar esta sucursal?`,
    })
}

}


