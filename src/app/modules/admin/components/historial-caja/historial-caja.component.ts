import { Component, OnInit, ViewChild } from '@angular/core';
import { JoinDetalleVentaService } from "src/app/service/JoinDetalleVenta";
import { AuthService } from 'src/app/service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MensajeListaComponent } from '../ListaEmpleados/mensaje-cargando.component';

@Component({
  selector: 'app-historial-caja',
  templateUrl: './historial-caja.component.html',
  styleUrls: ['./historial-caja.component.css']
})
export class HistorialCajaComponent implements OnInit{
  constructor(
    private joinDetalleVentaService: JoinDetalleVentaService,
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.fechaInicio = new Date(); // Hoy
    this.fechaFin = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 7);
  }

  idGym: number;


  fechaInicio: Date;
  fechaFin: Date;
  items: any[] = [];

  displayedColumns: string[] = ['cantidadElegida', 'nombreProducto', 'precioUnitario', 'fechaVenta'];


  ngOnInit(): void {
    this.idGym = this.auth.getIdGym();
    console.log("id", this.idGym);
    this.obtenerDetallesCaja(this.idGym); // Llama al método para obtener los detalles de la caja al inicializar el componente
  }

  onFechaInicioChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fechaInicio = new Date(target.value);
    this.fechaFin ? this.filtrarPorFechas() : this.obtenerDetallesCaja(this.idGym);
  }
  
  onFechaFinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fechaFin = new Date(target.value);
    this.fechaInicio ? this.filtrarPorFechas() : this.obtenerDetallesCaja(this.idGym);
  }
  
  filtrarPorFechas() {
    let detallesCajaFiltrados = [...this.detallesCaja]; // Crear una copia para aplicar el filtro
  
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);
  
      // Ajustar las fechas para que coincidan con el inicio y fin del día
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(23, 59, 59, 999);
  
      // Filtrar la copia de detalles de la caja basados en las fechas seleccionadas
      detallesCajaFiltrados = detallesCajaFiltrados.filter((detalle: any) => {
        const fechaDetalle = new Date(detalle.fechaVenta);
        
        // Comparar las fechas utilizando el método getTime() para evitar problemas de comparación
        return fechaDetalle.getTime() >= fechaInicio.getTime() && fechaDetalle.getTime() <= fechaFin.getTime();
      });
  
      console.log('Detalles de la caja filtrados por fecha:', detallesCajaFiltrados);
    } else {
      // Si alguna de las fechas no está seleccionada, mostrar todos los detalles de la caja sin filtrar
      detallesCajaFiltrados = [...this.detallesCaja];
    }
  
    this.detallesCaja = detallesCajaFiltrados; // Asignar los detalles filtrados de nuevo al arreglo original
  }
  
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  detallesCaja: any[] = []; // Asumiendo que aquí recibes tus detalles de la caja

  // Define MatTableDataSource y establece las columnas
  dataSource = new MatTableDataSource<any>(this.detallesCaja);
  

  // Lógica para obtener los detalles de la caja
  obtenerDetallesCaja(idGym: number | null) {
    this.joinDetalleVentaService.consultarProductosGimnasio(idGym).subscribe(
      (data) => {
        // Actualizar detallesCaja con los datos obtenidos
        this.detallesCaja = data;

        // Actualizar dataSource para reflejar los cambios en la tabla
        this.dataSource = new MatTableDataSource<any>(this.detallesCaja);
      },
      (error) => {
        console.error('Error al obtener detalles de la caja:', error);
      }
    );
  }

  opcionSeleccionada: string = 'diario'; // Opción por defecto
mostrarRango: boolean = false;
mostrarDiario: boolean = true;

    // ... Otras propiedades y métodos de tu componente

    seleccionarOpcion(opcion: string) {
      this.opcionSeleccionada = opcion;
      
      // Lógica para mostrar elementos correspondientes al modo diario
      if (opcion === 'diario') {
          this.mostrarDiario = true; // Define una variable para mostrar elementos de diario
          this.mostrarRango = false; // Oculta los elementos del rango
      } else if (opcion === 'rango') {
          this.mostrarRango = true; // Define una variable para mostrar elementos del rango
          this.mostrarDiario = false; // Oculta los elementos de diario
      }
  }


  abrirDialogo() {
    this.dialog
      .open(MensajeListaComponent, {
        data: `Membresía agregada exitosamente`,
        width: "500px",
        height: "500px",
      })
      .afterClosed()
      .subscribe((cerrarDialogo: Boolean) => {
        if (cerrarDialogo) {
          this.router.navigateByUrl("/admin/listaMembresias");
        } else {
        }
      });
  }


}
