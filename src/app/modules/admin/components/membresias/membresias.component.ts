import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { plan } from '../models/plan';
import { PlanService } from 'src/app/service/plan.service';
import { MensajeEliminarComponent } from '../mensaje-eliminar/mensaje-eliminar.component';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { AuthService } from 'src/app/service/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSelectMembershipComponent } from '../dialog-select-membership/dialog-select-membership.component';



@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css'
})
export class MembresiasComponent implements OnInit {

  membresiaActiva: boolean ; // Inicializa según el estado de la membresía
  membresias: plan[] = [];
  plan: plan[] = [];
  message: string = "";
  public sucursales: any;
  public page: number = 0;
  public search: string = '';
  dataSource: any;
  services: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private planService:PlanService,
    private gimnasioService:GimnasioService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ){}

  displayedColumns: string[] = ['title', 'details','price','duration','servicios','status','actions'];

  ngOnInit(): void {
    this.planService.consultarPlanId(this.auth.getIdGym()).subscribe(respuesta => {
      console.log("la respuesta es: ",respuesta);
      this.plan = respuesta;
      this.dataSource = new MatTableDataSource(this.plan);
      this.dataSource.paginator = this.paginator; // Asigna el paginador a tu dataSource
    });
  }
  

  borrarPlan(idMem: any) {
    console.log(idMem);
    this.dialog.open(MensajeEliminarComponent, {
      data: `¿Desea eliminar esta membresía?`,
    })
    .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.planService.borrarPlan(idMem).subscribe((respuesta) => {
            console.log("si entro") 
            //window.location.reload();    
            this.ngOnInit();
          },
          (error) => {
            console.log("Error al eliminar:", error);
            this.message = "¡Error al eliminar! Hay clientes inscritos en esta membresía";
            setTimeout(() => {
              this.message = ''; // Ocultar el mensaje de error después de 20 segundos
            }, 7000); // 20000 milisegundos = 20 segundos
          });
        } else {
          
        }
      });
   }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /*toggleCheckbox(idMem: number, status: number) {
    const dialogRef = this.dialog.open(MensajeEliminarComponent, {
      data: `¿Desea cambiar el estatus de la membresía?`, 
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        console.log("membresiaActiva",status);
        // Invierte el estado actual de la membresía
        const nuevoEstado = status ? { status: 0 } : { status: 1 };
  
        this.actualizarEstatusMembresia(idMem, nuevoEstado);
      }
    });
  }*/

  toggleCheckbox(idMem: number, status: number) {
    // Guarda el estado actual en una variable temporal
    const estadoOriginal = status;
    console.log('Estatus actual:', estadoOriginal);
  
    const dialogRef = this.dialog.open(MensajeEliminarComponent, {
      data: `¿Desea cambiar el estatus de la categoría?`, 
    });
  
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        // Invierte el estado actual de la categoría
        const nuevoEstado = status == 1 ? { status: 0 } : { status: 1 };
        console.log('Nuevo estado:', nuevoEstado);
  
        // Actualiza el estado solo si el usuario confirma en el diálogo
        this.actualizarEstatusMembresia(idMem, nuevoEstado);
        
      } else {
        // Si el usuario cancela, vuelve al estado original
        console.log('Acción cancelada, volviendo al estado original:', estadoOriginal);
        // Puedes decidir si deseas revertir visualmente la interfaz aquí
      }
    });
  }

  actualizarEstatusMembresia(idMem: number, estado: { status: number }) {
    console.log(estado.status, "nuevo");
    this.planService.updateMembresiaStatus(idMem, estado).subscribe(
      (respuesta) => {
        console.log('Membresía actualizada con éxito:', respuesta);
        this.membresiaActiva = estado.status == 1;
      },
      (error) => {
        console.error('Error al actualizar la membresía:', error);
        // Maneja el error de alguna manera si es necesario.
      }
    );
  }
  
  /*actualizarEstatusMembresia(idMem: number, estado: { status: number }) {
    console.log(estado.status, "nuevo");
    this.planService.updateMembresiaStatus(idMem, estado).subscribe(
      (respuesta) => {
        console.log('Membresía actualizada con éxito:', respuesta);
  
        // Invierte el estado en la interfaz después de una actualización exitosa
        this.membresiaActiva = estado.status === 1;
  
        // Realiza cualquier lógica adicional después de la actualización.
      },
      (error) => {
        console.error('Error al actualizar la membresía:', error);
        // Maneja el error de alguna manera si es necesario.
      }
    );
  }*/

  openDialog(): void {
    this.planService.optionShow.next(1);
    this.planService.optionShow.subscribe((option) => {
      console.log("mostraremos:", option);
    });
    const dialogRef = this.dialog.open(DialogSelectMembershipComponent, {
      minWidth: '500px',
      minHeight: '400px',
      data: {name: '¿para quien es esta membresia?'}
    });
  }

  openDialogService(idMem: number, tipo_membresia: number){
    this.planService.optionShow.next(2);
    this.planService.optionShow.subscribe((option) => {
      console.log("mostraremos:", option);
    });
    this.planService.setDataToupdate(idMem, tipo_membresia);
    const dialogRef = this.dialog.open(DialogSelectMembershipComponent, {
      minWidth: '500px',
      minHeight: '400px',
      data: {name: 'Servicios de la membresia'}
    });
  }

  openDialogEdit(idMem: number, tipo_membresia: number){
    this.planService.optionShow.next(3);
    this.planService.optionShow.subscribe((option) => {
      console.log("mostraremos:", option);
    })

    //estos campos deben ser mostrados publicos
    console.log("el id es: ", idMem);
    console.log("el tipo es: ", tipo_membresia);
    this.planService.setDataToupdate(idMem, tipo_membresia);
    const dialogRef = this.dialog.open(DialogSelectMembershipComponent, {
      minWidth: '500px',
      minHeight: '400px',
      data: {name: 'Editar membresia', id: idMem}
    })
  }

  /*getServices(id: number){
    console.log("id",id);
    let item = this.plan.find((item) => item.idMem == id);
    if(item){
      this.services = item.servicios;
      console.log("servicios",this.services);
      this.planService.getServices(this.services);
    }else {
      console.log("no hay servicios");
    }
}*/
}
