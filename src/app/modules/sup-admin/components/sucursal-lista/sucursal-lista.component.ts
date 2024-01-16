import { Component, OnInit } from '@angular/core';
import { GimnasioService } from 'src/app/service/gimnasio.service';
import { MensajeEliminarComponent } from '../mensaje-eliminar/mensaje-eliminar.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { horarioService } from 'src/app/service/horario.service';
import { forkJoin } from 'rxjs';
import { HorariosComponent } from '../horarios/horarios.component';
import { gimnasio } from 'src/app/modules/sup-admin/components/models/gimnasio';
import { HorariosVistaComponent } from '../horarios-vista/horarios-vista.component';
import { ListarSucursalesPipe } from 'src/app/modules/sup-admin/components/pipes/sucursales/listar-sucursales.pipe';

@Component({
  selector: 'app-sucursal-lista',
  templateUrl: './sucursal-lista.component.html',
  styleUrls: ['./sucursal-lista.component.css']
})
export class SucursalListaComponent implements OnInit {
  
  gimnasio: any;
  message: string = "";
  
  idGimnasio: any;
  hayHorarios: boolean = false;
  public sucursales: any;
  public page: number = 0;
  public search: string = '';

  constructor(
    private gimnasioService: GimnasioService,
    public dialog: MatDialog,
  ){}

  displayedColumns: string[] = ['nombre','direccion','telefono', 'tipo',  'alberca', 'ofertas', 'gimnasio', 'IDgimnasio', 'actions', 'horario'];


  ngOnInit(): void {
    this.gimnasioService.obternerPlan().subscribe(respuesta => {
      this.gimnasio = respuesta;
      console.log("GIMNASIOS: ",this.gimnasio);
    });
  }

  borrarSucursal(idGimnasio: any) {
    console.log(idGimnasio);
    this.dialog.open(MensajeEliminarComponent,{
      data: `¿Desea eliminar esta membresía?`,
    })
    .afterClosed()
    .subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.gimnasioService.borrarSucursal(idGimnasio).subscribe(
          (respuesta) => {
            console.log("Eliminado exitosamente");
            window.location.reload();
          },
          (error) => {
            console.log("Error al eliminar:", error);
            this.message = "¡Error al eliminar!, Restricción en la base de datos";
          }
        );
      } else {
        console.log("No se confirmó la eliminación");
      }
    });
  }

 verHorario(idGimnasio: string): void {
    const dialogRef = this.dialog.open(HorariosVistaComponent, {
      width: '60%',
      height: '90%',
      data: { idGimnasio: idGimnasio },
    });
  }

  agregarHorario(idGimnasio: string): void {
    const dialogRef = this.dialog.open(HorariosComponent, {
      width: '60%',
      height: '90%',
      data: { idGimnasio: idGimnasio },
    });
  }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if ( this.page > 0 )
      this.page -= 5;
  }

  onSearchPokemon( search: string ) {
    this.page = 0;
    this.search = search.toLowerCase();
  }

  pageNumber = 0; // Valor inicial de la página
searchString = ''; // Valor inicial para la búsqueda

// Método para cambiar la página
changePage(newPage: number) {
  this.pageNumber = newPage;
}

// Método para cambiar la cadena de búsqueda
changeSearchString(newSearchString: string) {
  this.searchString = newSearchString;
}
}
