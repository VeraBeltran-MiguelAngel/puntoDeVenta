import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { plan } from '../models/plan';
import { PlanService } from 'src/app/service/plan.service';
import { MensajeEliminarComponent } from 'src/app/modules/recepcion/components/mensaje-eliminar/mensaje-eliminar.component';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { AuthService } from 'src/app/service/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css'
})
export class MembresiasComponent implements OnInit {

 

  plan: plan[] = [];
  message: string = "";
  public sucursales: any;
  public page: number = 0;
  public search: string = '';
  dataSource: any; 

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private planService:PlanService,
    private gimnasioService:GimnasioService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ){}

  displayedColumns: string[] = ['title', 'details','price','duration', 'trainer','cancha','alberca','ofertas','gimnasio','actions'];

  ngOnInit(): void {
    this.planService.consultarPlanId(this.auth.getIdGym()).subscribe(respuesta => {
      console.log(respuesta);
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
}
