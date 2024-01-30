import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanService } from 'src/app/service/plan.service';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'app-dialog-select-membership',
  templateUrl: './dialog-select-membership.component.html',
  styleUrl: './dialog-select-membership.component.css'
})
export class DialogSelectMembershipComponent implements OnInit{
  displayedColumns: string[] = ['No', 'nombre', 'precio'];
  dataSource: MatTableDataSource<MyElement> = new MatTableDataSource<MyElement>();
  //dataSource = new MatTableDataSource<Element>(this.sucursalServices); 
  tipo_membresia: number = 0;
  optionToShow: number = 0;
  selection: number = 0;
  formTittle: string = "";
  idGym: any;
  idMem: any;
  servicios: any[] = [];
  formPlan: FormGroup;
  servicioSeleccionado: any[] = [];
  serviciosSeleccionadosFilters: any[] = [];
  prices: any[] = [];
  totalPlanPersolnalized: number = 0;
  data ={
    fk_idMem: 0,
    id_servicios_individuales: ['']
  }
  sucursalServices: any[] = [];
  dataToUpdate: any = {};
  plan: any[] = [];
  selectedService: number = 4;
  


  constructor(private AuthService: AuthService, private http:HttpClient, private GimnasioService: GimnasioService, private formulario: FormBuilder, private planService: PlanService) 
  {
    this.formPlan = this.formulario.group({
      idMem: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      titulo: ['', [Validators.required, Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u)]],
      duracion: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      detalles: ['', [Validators.required, Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u)]],
      servicioseleccionado: [[], Validators.required],
      status: ['1', [Validators.pattern(/^\d+$/)]],
      tipo_membresia: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      Gimnasio_idGimnasio: [this.AuthService.getIdGym(), Validators.required],
    });
   }

  ngOnInit(): void {
      this.getIdGym();
      this.getServices();
      /*this.formPlan.get('servicioseleccionado')?.valueChanges.subscribe(value => {
        console.log("value",value);
        if (!this.servicioSeleccionado.some(e => e.id_servicios_individuales === value.id_servicios_individuales)) {
          this.servicioSeleccionado.push(value);
        }
        console.log("SERVICIOS SELECCIONADOS",this.servicioSeleccionado);
      });*/

      this.planService.optionShow.subscribe(respuesta => {
        if(respuesta){
          this.optionToShow = respuesta;
          if(this.optionToShow == 1){
            //console.log("Mostraremos los planes");
          }
          else if(this.optionToShow == 2){
            //console.log("Mostraremos los servicios");
            this.planService.getDataToUpdate().subscribe((respuesta) => {
              if(respuesta){
                this.dataToUpdate = respuesta;
                //console.log("DATOS TABLA", this.dataToUpdate);
                if(this.dataToUpdate.id != undefined){
                  this.planService.consultarPlanGym(this.dataToUpdate.id).subscribe((respuesta) => {
                    if(respuesta){
                      if(this.dataToUpdate.id == respuesta[0].idMem){
                          this.sucursalServices = respuesta;
                          //console.log("DATA CORRECTO: ", this.sucursalServices);
                          this.dataSource = new MatTableDataSource<MyElement>(this.sucursalServices[0].servicios);

                      }else {
                        //console.log("LOS DATOS NO CORRESPONDEN");
                      }
                    }
                  });
                }
              } else {
                //console.log("No hay datos para mostrar");
              }
            });
        } else if(this.optionToShow == 3){
          //console.log("Mostraremos el formulario para editar");
          this.planService.getDataToUpdate().subscribe((respuesta) => {
            if(respuesta){
              this.dataToUpdate = respuesta;
              //console.log("ID MEMBRESIA:", this.dataToUpdate.id);
              //console.log("RESPUESTA: ",respuesta);
              //console.log("ALERTAAAAAAAAA: ",this.dataToUpdate);
              /*this.planService.consultarPlanGym(this.dataToUpdate.id).subscribe((respuesta) => {
                if(respuesta){
                  console.log("HA SALIDO BIEN: ", respuesta);
                }
              });*/
             /* this.GimnasioService.getServicesForId(this.idGym).subscribe((respuesta) => {
                if(respuesta){
                  this.servicios = respuesta;
                  console.log("SERVICIOS: ",this.servicios);
                }
              });*/
            }
          });
          this.GimnasioService.getServicesForId(this.idGym).subscribe((respuesta) => {
            this.servicios = respuesta;
          this.planService.consultarPlanGym(this.dataToUpdate.id).subscribe((respuesta) => {
            if(respuesta){
              this.plan = respuesta;
              console.log("RESPUESTAINDIVIDUAL: ",this.plan);
             // const servicioCancha = this.servicios.find(servicio => servicio.nombre_servicio == 'cancha');
              //const servicioCancha = this.servicios.find(servicio => servicio.nombre_servicio === this.plan[0].servicios[0].nombre_servicio);
              const serviciosPlan = this.plan[0].servicios.map((servicio: any) => servicio.nombre_servicio);
              const serviciosCoincidentes = this.servicios.filter(servicio => serviciosPlan.includes(servicio.nombre_servicio));

              this.formPlan.setValue({
                idMem: 0,
                titulo: this.plan[0].titulo,
                duracion: this.plan[0].duracion,
                precio: this.plan[0].precio,
                detalles: this.plan[0].detalles,
                servicioseleccionado: serviciosCoincidentes,
                status: this.plan[0].status,
                tipo_membresia: this.plan[0].tipo_membresia,
                Gimnasio_idGimnasio: this.plan[0].Gimnasio_idGimnasio,
              });
              console.log("LOS SERVICIOS ASIGNADOS AHORA SON: ", this.formPlan.value.servicioseleccionado);
            }
          });
          });
        }
        }
      });

      //OBTENER LOS SERVICIOS
      /*this.planService.showService().subscribe(respuesta => {
        if(respuesta){
          console.log("respuesta",respuesta);
          this.sucursalServices = respuesta;
          this.dataSource = new MatTableDataSource<MyElement>(this.sucursalServices);
          console.log("OBTENERLOS: ",this.sucursalServices);
        }else {
          console.log("No hay servicios disponibles para esta sucursal");
        }
      });*/
  }

  selectPlan(){
    this.tipo_membresia = 1;
    this.selection = 1;
    console.log("Has elegido un plan");
    this.formTittle = "Plan";

    this.formPlan.patchValue({tipo_membresia: this.tipo_membresia});

    if(this.idGym != null){
      this.getServices();
      /*this.GimnasioService.getServicesForId(this.idGym).subscribe(respuesta => {
        if(respuesta){
          //console.log("respuesta",respuesta);
          this.servicios = respuesta;
          console.log("la respuesta es: ",this.servicios);
        }else {
          console.log("No hay servicios disponibles para esta sucursal");
        }
      });*/
    } 
  }

  selectPersonalize(){
    this.tipo_membresia = 2;
    this.selection = 2;
    //console.log("Has elegido personalizar tu plan");
    this.formTittle = "Plan personalizado";

    this.formPlan.patchValue({ tipo_membresia: this.tipo_membresia });

  
    if(this.idGym != null){
      this.getServices();
      /*this.GimnasioService.getServicesForId(this.idGym).subscribe(respuesta => {
        if(respuesta){
          //console.log("respuesta",respuesta);
          this.servicios = respuesta;
          console.log("la respuesta es: ",this.servicios);
        }else {
          console.log("No hay servicios disponibles para esta sucursal");
        }
      });*/
    } 
  }

  getIdGym(){
    this.idGym = this.AuthService.getIdGym();
    //console.log("idGym",this.idGym);
  }

  isFieldInvalid(field: string, error: string): boolean {
    const control = this.formPlan.get(field);
    return control?.errors?.[error] && (control?.touched ?? false);  
  }

  validarFormulario(){
    if(this.formPlan.invalid){
      console.log("Formulario invalido");
      Object.values(this.formPlan.controls).forEach(control => {
        console.log(control.errors); // Imprime los errores de cada control
        control.markAsTouched();
      });
    }
    else{
      console.log("Formulario valido");
      this.formPlan.setValue({
        idMem: 0,
        titulo: this.formPlan.value.titulo,
        duracion: this.formPlan.value.duracion,
        precio: this.formPlan.value.precio,
        detalles: this.formPlan.value.detalles,
        servicioseleccionado: this.formPlan.value.servicioseleccionado,
        status: this.formPlan.value.status,
        tipo_membresia: this.tipo_membresia,
        Gimnasio_idGimnasio: this.idGym,
      });
      console.log("Formulario",this.formPlan.value);
      /*this.serviciosSeleccionadosFilters = [...this.servicioSeleccionado]; // Hacemos una copia del array
      this.serviciosSeleccionadosFilters.splice(this.serviciosSeleccionadosFilters.length-1,1); // Eliminamos el último elemento
      console.log("SERVICIOS OKS",this.serviciosSeleccionadosFilters);*/

      //llamado a la peticion para insertar la membresia
      if(this.optionToShow == 1 || this.optionToShow == 2){
      this.planService.agregarPlan(this.formPlan.value).subscribe(respuesta => {
        if(respuesta){
          console.log("respuesta",respuesta);
          /*console.log(respuesta.id);
          this.idMem = respuesta.id;
          if(this.serviciosSeleccionadosFilters.length > 0){
          console.log("TODO ESTA OK, HAS ELEGIDO SERVICIOS");
          this.data.fk_idMem = respuesta.id;
          this.data.id_servicios_individuales = this.servicioSeleccionado;
          let datos = this.serviciosSeleccionadosFilters.map(servicio => ({
          ...servicio,
          fk_idMem: this.idMem  */   
        }
      });
      }
      if(this.optionToShow == 3){
        //console.log("ID ANTES DE SETVALUE:", this.dataToUpdate.id);
        console.log("ANTES DE LLAMAR A SETVALUE: ", this.dataToUpdate, this.formPlan.value);
        this.formPlan.setValue({
          idMem: this.dataToUpdate.id,
          titulo: this.formPlan.value.titulo,
          duracion: this.formPlan.value.duracion,
          precio: this.formPlan.value.precio,
          detalles: this.formPlan.value.detalles,
          servicioseleccionado: this.formPlan.value.servicioseleccionado,
          status: this.formPlan.value.status,
          tipo_membresia: this.dataToUpdate.tipo_membresia,
          Gimnasio_idGimnasio: this.idGym,
        });
        if(this.formPlan.valid){
          console.log("FORMULARIO PARA ACTUALIZAR",this.formPlan.value);
          //llamada al servicio para actualizar la membresia
          this.planService.updateMembresia(this.formPlan.value).subscribe(respuesta => {
            if(respuesta) {
              console.log("Respuesta: ",respuesta);
            }
          });
        }
      }
    }
  }

  setPrice(servicios: any[]){
    this.prices = []; // Vacía el array prices
    if(servicios){
      servicios.forEach(servicio => {
        //console.log("el precio de esta es: ", servicio.precio_unitario);
        this.prices.push(servicio.precio_unitario);
      });
      //console.log("los precios son: ",this.prices);
      this.totalPlanPersolnalized = this.prices.reduce((a, b) => a + b, 0);
      console.log("el total es: ",this.totalPlanPersolnalized);
  
      // Aquí es donde estableces el valor del campo 'precio' en tu formulario
      if (this.selection == 2) {
        const precioControl = this.formPlan.get('precio');
        if (precioControl) {
          precioControl.setValue(this.totalPlanPersolnalized);
        }
      }
    }else {
      console.log("algo salio mal :C");
    }
  }

  getServices(){
    this.GimnasioService.getServicesForId(this.idGym).subscribe(respuesta => {
      if(respuesta){
        this.servicios = respuesta;
        console.log("SERVICIOS PARA TODOS: ",this.servicios);
      }
    });
    /*this.planService.showService().subscribe(respuesta => {
      if(respuesta){
        console.log("respuesta",respuesta);
        this.sucursalServices = respuesta;
        this.dataSource = new MatTableDataSource<MyElement>(this.sucursalServices);
        console.log("OBTENERLOS: ",this.sucursalServices);
      }else {
        console.log("No hay servicios disponibles para esta sucursal");
      }
    });
  }*/
  }
}

interface MyElement {
  fk_idMem: string;
  fk_servicios_individuales: string;
  id_servicio_membresia: string;
  nombre_servicio: string;
  precio_unitario: string;
  titulo: string;
}
