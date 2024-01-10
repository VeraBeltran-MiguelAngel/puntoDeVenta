import { Component, OnInit, ViewChild, DoCheck} from '@angular/core';
import { ListProductVendidosService } from 'src/app/service/list-product-vendidos.service'
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
//import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Producto {
  Nombre: string;
  Sucursal: string;
  Producto: string;
  Cantidad: number;
  Precio_Unitario: number;
  Importe_x_Producto: number;
  Fecha_Venta: string;
  Total: number;
}

@Component({
  selector: 'app-productos-vendidos',
  templateUrl: './productos-vendidos.component.html',
  styleUrls: ['./productos-vendidos.component.css'],
  providers: [DatePipe],
})


export class ProductosVendidosComponent implements OnInit, DoCheck{
  fechaInicio: Date = new Date(); // Inicializa como una nueva fecha
  fechaFin: Date = new Date();    // Inicializa como una nueva fecha

// Asegúrate de que productosVendidos tenga el tipo adecuado (en este caso, un array de Producto)
  productosVendidos: Producto[] = [];
  //productosVendidos: any;
  dataSource: any; // instancia para matTableDatasource
  //titulos de columnas de la tabla de pago online
  displayedColumns: string[] = [
    'Nombre',
    'Sucursal',
    'Producto',
    'Cantidad',
    'Precio unitario',
    'Importe por producto',
    'Fecha venta',
    'Total'
  ];
  
  //paginator es una variable de la clase MatPaginator
  @ViewChild('paginatorProductos', { static: true }) paginator!: MatPaginator;

  
  constructor(private prodVendidosService: ListProductVendidosService, private datePipe: DatePipe, private toastr: ToastrService){

  }
  
  ngOnInit(): void{
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

  private formatDateV2(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  private updateDateLogs(): void {
    this.fechaInicioAnterior = this.fechaInicio;
    this.fechaFinAnterior = this.fechaFin;
  
    console.log('Fecha de inicio seleccionada:', this.formatDate(this.fechaInicio));
    console.log('Fecha de fin seleccionada:', this.formatDate(this.fechaFin));
  
    this.prodVendidosService.obtenerListaProduct(
      this.formatDate(this.fechaInicio),
      this.formatDate(this.fechaFin)
    ).subscribe(
      response => {
        console.log(response);
  
        if (response) {
          // Si hay datos, actualiza la tabla
          this.productosVendidos = response;
          this.dataSource = new MatTableDataSource(this.productosVendidos);
          this.dataSource.paginator = this.paginator;
        } else {
          // Si no hay datos, resetea la tabla
          this.productosVendidos = [];
          this.dataSource = new MatTableDataSource(this.productosVendidos);
          this.dataSource.paginator = this.paginator;
          console.log('No hay datos para mostrar.');
        }
      },
      error => {
        console.error('Error en la solicitud:', error);
        // Manejo de errores adicional si es necesario
        this.productosVendidos = [];
        this.dataSource = new MatTableDataSource(this.productosVendidos);
        this.dataSource.paginator = this.paginator;
       // console.log('No hay productos comprados en este rango de fechas');
        this.toastr.info('No hay productos comprados en este rango de fechas.', 'Info!!!');

      },
      () => {
        console.log('La solicitud se completó.');
      }
    );
  }
  

  private fechaInicioAnterior: Date | null = null;
  private fechaFinAnterior: Date | null = null;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   // this.productosVendidos = this.dataSource.filter
  }

  //Descarga el archivo en excel
  descargarExcel(): void {

    // Verifica si hay datos para exportar
  if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
    this.toastr.error('No hay datos para exportar.', 'Error!!!');
    //console.warn('No hay datos para exportar a Excel.');
    return;
  }

  // Mapea la información de this.productosVendidos a un arreglo bidimensional
  const datos = [
    ['Nombre', 'Sucursal', 'Producto', 'Cantidad', 'Precio unitario', 'Importe por producto', 'Fecha venta', 'Total'],
    ...this.dataSource.filteredData.map((producto: Producto) => [
      producto.Nombre,
      producto.Sucursal,
      producto.Producto,
      producto.Cantidad,
      producto.Precio_Unitario,  // Asegúrate de que la propiedad tenga el nombre correcto
      producto.Importe_x_Producto,
      producto.Fecha_Venta,
      producto.Total
    ])
  ];
  
    // Crear un objeto de libro de Excel
    const workbook = XLSX.utils.book_new();
    const hojaDatos = XLSX.utils.aoa_to_sheet(datos);
  // Establecer propiedades de formato para las columnas
    hojaDatos['!cols'] = [
      // La primera columna (A) tiene un ancho de 20
      { wch: 25 },
      // Las siguientes columnas (B a H) tienen un ancho de 15
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 8 }
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
    saveAs(newBlob, 'Productos Vendidos.xlsx');
  }



  //Descarga el archivo en PDF
  descargarPDF(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.toastr.error('No hay datos para exportar.', 'Error!!!');
      console.warn('No hay datos filtrados para exportar a PDF.');
      return;
    }
  
    // Crear un objeto jsPDF
    const pdf = new (jsPDF as any)();  // Utilizar 'as any' para evitar problemas de tipo
  
    // Obtener las fechas seleccionadas
    const fechaInicio = this.formatDateV2(this.fechaInicio);
    const fechaFin = this.formatDateV2(this.fechaFin);

    // Encabezado del PDF con las fechas
    pdf.text(`Reporte de Productos Vendidos (${fechaInicio} - ${fechaFin})`, 10, 10);
    
    // Contenido del PDF
    const datos = this.dataSource.filteredData.map((producto: Producto) => [
      producto.Nombre,
      producto.Sucursal,
      producto.Producto,
      producto.Cantidad,
      producto.Precio_Unitario,
      producto.Importe_x_Producto,
      producto.Fecha_Venta,
      producto.Total
    ]);
  
    // Añadir filas al PDF con encabezado naranja
  pdf.autoTable({
    head: [['Nombre', 'Sucursal', 'Producto', 'Cantidad', 'Precio unitario', 'Importe por producto', 'Fecha venta', 'Total']],
    body: datos,
    startY: 20,  // Ajusta la posición inicial del contenido
    headStyles: {
      fillColor: [249, 166, 64],  // Color naranja RGB
      textColor: [255, 255, 255]  // Color blanco para el texto
    }
  });
  
    // Descargar el archivo PDF
    pdf.save('Productos Vendidos.pdf');
    //pdf.save(`Productos Vendidos (${fechaInicio} - ${fechaFin}).pdf`);
  }

}
