import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { inventarioService } from 'src/app/service/inventario.service';
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';

export interface Historial {
  Sucursal: string;
  Usuario: number;
  Producto: number;
  Concepto: string;
  FechaMovimiento: string; 
  ActualStock: string; 
  MovimientoStock: string; 
  NuevoStock: string;
}

@Component({
  selector: 'app-emergente-historial-productos',
  templateUrl: './emergente-historial-productos.component.html',
  styleUrl: './emergente-historial-productos.component.css',
  providers: [DatePipe],
})

export class EmergenteHistorialProductosComponent implements OnInit{

  //dataHistorial: any;
  dataHistorial: Historial[] = [];   //dataHistorial debe tener el tipo adecuado (en este caso, un array de Historial)
  dataSource: any; // instancia para matTableDatasource
  //titulos de columnas de la tabla
  displayedColumnsHistorial: string[] = [
    'Sucursal',
    'Usuario',
    'Producto',
    'Concepto',
    'Fecha Movimiento',
    'Stock Actual',
    'Stock Movimiento',
    'Stock Nuevo',
  ];
  fechaInicio: Date = new Date(); // Inicializa como una nueva fecha
  fechaFin: Date = new Date();    // Inicializa como una nueva fecha

  //paginator es una variable de la clase MatPaginator
  @ViewChild('paginatorHistorial', { static: true }) paginatorHistorial!: MatPaginator;

  constructor(
    public dialogo: MatDialogRef<EmergenteHistorialProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string,
    private ServiceHistorInventario: inventarioService,
    private toastr: ToastrService,
    private datePipe: DatePipe,) { }
  
  cerrarDialogo(): void {
    this.dialogo.close(true);
  }

  ngOnInit(): void {
    this.updateDateLogs();  // Actualiza las fechas iniciales al inicio
  }

  ngDoCheck(): void {
    // Verifica si las fechas han cambiado y actualiza los logs
    if (this.fechaInicio !== this.fechaInicioAnterior || this.fechaFin !== this.fechaFinAnterior) {
      this.updateDateLogs();
    }
  }

  onFechaInicioChange(event: any): void {
    // Manejar el cambio de la fecha de inicio
    console.log('Fecha de inicio cambiada:', this.formatDate(event));
  }

  onFechaFinChange(event: any): void {
    // Manejar el cambio de la fecha de fin
    console.log('Fecha de fin cambiada:', this.formatDate(event));
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  private updateDateLogs(): void {
    this.fechaInicioAnterior = this.fechaInicio;
    this.fechaFinAnterior = this.fechaFin;
  
    //console.log('Fecha de inicio seleccionada:', this.formatDate(this.fechaInicio));
    //console.log('Fecha de fin seleccionada:', this.formatDate(this.fechaFin));
  
    this.ServiceHistorInventario.HistorialInventario(
      this.formatDate(this.fechaInicio),
      this.formatDate(this.fechaFin)
    ).subscribe(
      response => {
        console.log(response);
  
        if (response.msg == 'No hay resultados') {
          // Si no hay datos, resetea la tabla
          this.dataHistorial = [];
          this.dataSource = new MatTableDataSource(this.dataHistorial);
          this.dataSource.paginator = this.paginatorHistorial;
          //console.log('No hay clientes activos en este rango de fechas.');
          this.toastr.info('No hay clientes activos en este rango de fechas.', 'Info!!!');

        } else if(response){
          // Si hay datos, actualiza la tabla
          this.dataHistorial = response;
          this.dataSource = new MatTableDataSource(this.dataHistorial);
          this.dataSource.paginator = this.paginatorHistorial;
          this.toastr.success('Datos encontrados.', 'Success!!!');
 
        }
      },
      error => {
        console.error('Error en la solicitud:', error);
        // Manejo de errores adicional si es necesario
        this.dataHistorial = [];
        this.dataSource = new MatTableDataSource(this.dataHistorial);
        this.dataSource.paginator = this.paginatorHistorial;
        //console.log('Ocurrio un error.');
        this.toastr.error('Ocurrio un error.', 'Error!!!');
      },
      () => {
        console.log('La solicitud se completó.');
      }
    );
  }

  private fechaInicioAnterior: Date | null = null;
  private fechaFinAnterior: Date | null = null;

  //Filtrar la informacion que escribe el usuario
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Descarga el archivo en excel
  descargarExcel(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.toastr.error('No hay datos para exportar.', 'Error!!!');
      console.warn('No hay datos para exportar a Excel.');
      return;
    }

    // Mapea la información de this.productosVendidos a un arreglo bidimensional
    const datos = [
      ['Sucursal', 'Usuario', 'Producto', 'Concepto', 'Fecha Movimiento', 'Stock Actual', 'Stock Movimiento', 'Stock Nuevo'],
      ...this.dataSource.filteredData.map((listaHist: Historial) => [
        listaHist.Sucursal,
        listaHist.Usuario,
        listaHist.Producto,
        listaHist.Concepto,
        listaHist.FechaMovimiento,
        listaHist.ActualStock,
        listaHist.MovimientoStock,
        listaHist.NuevoStock
      ])
    ];

    // Crear un objeto de libro de Excel
    const workbook = XLSX.utils.book_new();
    const hojaDatos = XLSX.utils.aoa_to_sheet(datos);
    // Establecer propiedades de formato para las columnas
    hojaDatos['!cols'] = [
      // Se le asigna un ancho a cada columna comenzando con la A
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 21 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 }
    ];
    // Añadir la hoja de datos al libro de Excel
    XLSX.utils.book_append_sheet(workbook, hojaDatos, 'Datos');

    // Crear un Blob con el contenido del libro de Excel
    const blob = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convertir el Blob a un array de bytes
    const arrayBuffer = new ArrayBuffer(blob.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < blob.length; i++) {
      view[i] = blob.charCodeAt(i) & 0xFF;
    }

    // Crear un Blob con el array de bytes y guardarlo como archivo
    const newBlob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(newBlob, 'Historial Inventario.xlsx');
  }

  private formatDateV2(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  //Descarga el archivo en PDF
  descargarPDF(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.toastr.error('No hay datos para exportar.', 'Error!!!');
      console.warn('No hay datos para exportar a PDF.');
      return;
    }
  
    // Crear un objeto jsPDF
    const pdf = new (jsPDF as any)();  // Utilizar 'as any' para evitar problemas de tipo

    // Obtener las fechas seleccionadas
    const fechaInicio = this.formatDateV2(this.fechaInicio);
    const fechaFin = this.formatDateV2(this.fechaFin);

    // Encabezado del PDF con las fechas
    pdf.text(`Historial del inventario (${fechaInicio} - ${fechaFin})`, 10, 10);   
    
    // Contenido del PDF
    const datos = this.dataSource.filteredData.map((listaHist: Historial) => [
      listaHist.Sucursal,
      listaHist.Usuario,
      listaHist.Producto,
      listaHist.Concepto,
      listaHist.FechaMovimiento,
      listaHist.ActualStock,
      listaHist.MovimientoStock,
      listaHist.NuevoStock
    ]);
  
    // Añadir filas al PDF con encabezado naranja
    pdf.autoTable({
      head: [['Sucursal', 'Usuario', 'Producto', 'Concepto', 'Fecha Movimiento', 'Stock Actual', 'Stock Movimiento', 'Stock Nuevo']],
      body: datos,
      startY: 20,  // Ajusta la posición inicial del contenido
      headStyles: {
        fillColor: [249, 166, 64],  // Color naranja RGB
        textColor: [255, 255, 255]  // Color blanco para el texto
      }
    });
  
    // Descargar el archivo PDF
    pdf.save('Historial Inventario.pdf');
  }

}
