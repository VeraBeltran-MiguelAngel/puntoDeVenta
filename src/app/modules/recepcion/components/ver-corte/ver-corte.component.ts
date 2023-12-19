import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/service/auth.service";
import { JoinDetalleVentaService } from "src/app/service/JoinDetalleVenta";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MensajeEliminarComponent } from "../mensaje-eliminar/mensaje-eliminar.component";
import { CajaService } from "src/app/service/caja.service";
import { MatPaginator } from '@angular/material/paginator';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
//import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Producto } from "../models/producto";

@Component({
  selector: 'app-ver-corte',
  templateUrl: './ver-corte.component.html',
  styleUrls: ['./ver-corte.component.css']
})
export class VerCorteComponent implements OnInit {

  @ViewChild('paginatorCaja', { static: true }) paginator!: MatPaginator;
  @ViewChild('paginatorHistorial', { static: true }) paginatorActivos!: MatPaginator;
  

  constructor( 
    public dialog: MatDialog,
    private auth: AuthService,
    public formulario: FormBuilder,
    private cajaService: CajaService,
    private joinDetalleVentaService: JoinDetalleVentaService,
    private toastr: ToastrService
  ) {

    const userId = this.auth.getIdUsuario(); // id del usuario
    const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
    const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
   
    this.formularioCaja = this.formulario.group({
      fechaApertura: [{ value: "", disabled: true }],
      fechaCierre: ["0000-00-00"],
      cantidadDineroAcumuladoTeoria: ["0"],
      cantidadDineroExistente: ["", Validators.required],
      Recepcionista_idRecepcionista: [userId],
    });
  }
  formularioCaja: FormGroup;
  fechaFin: Date;
  fechaInicio: Date;
  fechaFiltro: string = "";
  opcionSeleccionada: string = "diario";
  totalAPagarCorte: number = 0;
  cerrarCaja: boolean = true;
  botonProductos: boolean = false;
  mostrarInputFlag: boolean = false;
  detallesCaja: any[] = [];
  detallesCajaaaa: any[] = [];
  columnas: string[] = [
    "nombreProducto",
    "cantidadElegida",
    "precioUnitario",
    "fechaVenta",
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  DetallesCaja: any;

  ngOnInit(): void {
    const idUsuario = this.auth.getIdUsuario();
    
    this.obtenerDetallesCaja(idUsuario);
    this.dataSource = new MatTableDataSource(this.detallesCaja);
    this.dataSource.paginator = this.paginator; // Paginador para dataSource
    console.log(this.paginator,"this.dataSource.paginator");
    //////////////////////////////////////////////////////////////////////////
    const userId = this.auth.getIdUsuario(); // ID del usuario actual
    const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`);
    const lastInsertedId = lastInsertedIdString ? parseInt(lastInsertedIdString, 10) : null;
    this.obtenerDetallesCajaaaa(idUsuario, lastInsertedId);
    this.dataSource2 = new MatTableDataSource(this.detallesCajaaaa);
    this.dataSource2.paginator = this.paginatorActivos; // Paginador para dataSource2
  }
  

  aplicarFiltro() {
    const fechaFiltrar = new Date(this.fechaFiltro);
    this.dataSource.filter = fechaFiltrar.toISOString().slice(0, 10); // Ajusta el formato a 'YYYY-MM-DD'
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.fechaVenta.includes(filter); // Compara la fecha con el filtro
    };

    this.dataSource2.filter = fechaFiltrar.toISOString().slice(0, 10); // Ajusta el formato a 'YYYY-MM-DD'
    this.dataSource2.filterPredicate = (data: any, filter: string) => {
      return data.fechaVenta.includes(filter); // Compara la fecha con el filtro
    };
  }

  aplicarFiltross() {
    const fechaInicioFiltrar = new Date(this.fechaInicio);
    const fechaFinFiltrar = new Date(this.fechaFin);
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const fechaItem = new Date(data.fechaVenta); // Ajusta 'fechaVenta' a tu propiedad de fecha
      return fechaItem >= fechaInicioFiltrar && fechaItem <= fechaFinFiltrar;
    };
    // Concatenar las fechas con un carácter que no se espera en las fechas
    const filtro = `${fechaInicioFiltrar.toISOString().slice(0, 10)}_${fechaFinFiltrar.toISOString().slice(0, 10)}`;
    this.dataSource.filter = filtro;


    this.dataSource2.filterPredicate = (data: any, filter: string) => {
      const fechaItem = new Date(data.fechaVenta); // Ajusta 'fechaVenta' a tu propiedad de fecha
      return fechaItem >= fechaInicioFiltrar && fechaItem <= fechaFinFiltrar;
    };
    // Concatenar las fechas con un carácter que no se espera en las fechas
    const filtros = `${fechaInicioFiltrar.toISOString().slice(0, 10)}_${fechaFinFiltrar.toISOString().slice(0, 10)}`;
    this.dataSource2.filter = filtros;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    console.log("this.dataSource.filter", this.dataSource.filter);
  }

  imprimirResumenCorte() {
    this.totalAPagarCorte = this.detallesCaja.reduce(
      (total, detalle) =>
        total + detalle.precioUnitario * detalle.cantidadElegida,
      0
    );
    const totalCantidad = this.detallesCaja.reduce(
      (total, detalle) => total + parseInt(detalle.cantidadElegida, 10),
      0
    );
    const totalEnPesos = this.convertirNumeroAPalabrasPesos(
      this.totalAPagarCorte
    );

    /*const cantidadDinero = this.formularioCaja.get(
      "cantidadDineroExistente"
    )?.value;*/

    const ventanaImpresion = window.open("", "_blank");
    const fechaActual = new Date().toLocaleDateString("es-MX"); // Obtener solo la fecha en formato local de México
    const horaActual = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    }); // Obtener solo la hora en formato local de México
    if (ventanaImpresion) {
      ventanaImpresion.document.open();
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>REPORTE DE CAJA</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .ticket {
                width: 80%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 4px;
                padding: 20px;
                
              }
              h1 {
                text-align: center;
                color: #333;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .total {
                text-align: right;
                margin-top: 20px;
                font-weight: bold;
              }
              .total p {
                margin: 5px 0;
                font-size: 1.1em;
              }
              hr {
                border: none;
                border-top: 1px dashed #ccc;
                margin: 20px 0;
              }
              .brand {
                text-align: center;
                color: #888;
                font-size: 20px;
                margin-top: 20px;
              }
              .fecha-hora {
                display: flex;
                justify-content: space-between;
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              <h1>REPORTE DE CAJA</h1>
              <hr>
              <div class="fecha-hora">
                <p>Fecha: ${fechaActual}</p> <!-- Fecha -->
                <p>Hora: ${horaActual}</p> <!-- Hora -->
              </div>
              <hr>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
          ${this.dataSource.filteredData
            .map(
              (detalle: any) => `
              <tr>
                <td>${detalle.nombreProducto}</td>
                <td>${detalle.cantidadElegida}</td>
                <td>$${detalle.precioUnitario}</td>
                <td>$${detalle.precioUnitario * detalle.cantidadElegida}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
              </table>
              <hr>
              <p></p>
              <p>Cantidad total de productos: ${totalCantidad}</p>
              <div class="total">
             
                <p>Total de ventas: $${this.totalAPagarCorte}</p>
      
              </div>
            </div>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
      ventanaImpresion.close();
    }
  }

  convertirNumeroAPalabrasPesos(numero: number): string {
    const unidades = [
      "CERO",
      "UN",
      "DOS",
      "TRES",
      "CUATRO",
      "CINCO",
      "SEIS",
      "SIETE",
      "OCHO",
      "NUEVE",
    ];
    const decenas = [
      "DIEZ",
      "ONCE",
      "DOCE",
      "TRECE",
      "CATORCE",
      "QUINCE",
      "DIECISEIS",
      "DIECISIETE",
      "DIECIOCHO",
      "DIECINUEVE",
    ];
    const decenasCompuestas = [
      "VEINTE",
      "TREINTA",
      "CUARENTA",
      "CINCUENTA",
      "SESENTA",
      "SETENTA",
      "OCHENTA",
      "NOVENTA",
    ];
    const centenas = [
      "CIENTO",
      "DOSCIENTOS",
      "TRESCIENTOS",
      "CUATROCIENTOS",
      "QUINIENTOS",
      "SEISCIENTOS",
      "SETECIENTOS",
      "OCHOCIENTOS",
      "NOVECIENTOS",
    ];

    const decimales = [
      "CERO",
      "UN",
      "DOS",
      "TRES",
      "CUATRO",
      "CINCO",
      "SEIS",
      "SIETE",
      "OCHO",
      "NUEVE",
    ];

    const miles = "MIL";
    const millones = "MILLÓN";
    const millonesPlural = "MILLONES";

    let palabras = "";
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100); // Obtiene los dos decimales

    if (numero === 0) {
      palabras = "CERO";
    } else if (numero < 10) {
      palabras = unidades[numero];
    } else if (numero < 20) {
      palabras = decenas[numero - 10];
    } else if (numero < 100) {
      palabras = decenasCompuestas[Math.floor(numero / 10) - 2];
      if (numero % 10 !== 0) palabras += ` Y ${unidades[numero % 10]}`;
    } else if (numero < 1000) {
      palabras = centenas[Math.floor(numero / 100) - 1];
      if (numero % 100 !== 0)
        palabras += ` ${this.convertirNumeroAPalabrasPesos(numero % 100)}`;
    } else if (numero < 10000) {
      palabras = unidades[Math.floor(numero / 1000)] + ` ${miles}`;
      if (numero % 1000 !== 0)
        palabras += ` ${this.convertirNumeroAPalabrasPesos(numero % 1000)}`;
    } else if (numero < 1000000) {
      palabras =
        this.convertirNumeroAPalabrasPesos(Math.floor(numero / 1000)) +
        ` ${miles}`;
      if (numero % 1000 !== 0)
        palabras += ` ${this.convertirNumeroAPalabrasPesos(numero % 1000)}`;
    } else {
      palabras = "Número demasiado grande";
    }

    return palabras;
  }



  obtenerDetallesCaja(Recepcionista_idRecepcionista: number | null) {
    const idUsuario = this.auth.getIdUsuario();
    this.joinDetalleVentaService.consultarProductosVentas(idUsuario).subscribe(
      (data) => {
        this.detallesCaja = data;
        // this.dataSource2 = new MatTableDataSource(this.detallesCaja); // Inicializar dataSource2 como MatTableDataSource
        //this.dataSource2.paginator = this.paginator2; // Vincular el paginador con el dataSource2
        // console.log("this.dataSource2.paginator", this.dataSource2.paginator);
        this.dataSource.data = this.detallesCaja; // Asignar los datos al dataSource2
       
      },
      (error) => {
        console.error("Error al obtener detalles de la caja:", error);
      }
    );
  }

  actualizarCaja() {
    const fechaActual1 = new Date();
    const year = fechaActual1.getFullYear();
    const month = (fechaActual1.getMonth() + 1).toString().padStart(2, "0"); // Agrega un 0 si el mes tiene un solo dígito
    const day = fechaActual1.getDate().toString().padStart(2, "0"); // Agrega un 0 si el día tiene un solo dígito
    const hours = fechaActual1.getHours().toString().padStart(2, "0"); // Agrega un 0 si la hora tiene un solo dígito
    const minutes = fechaActual1.getMinutes().toString().padStart(2, "0"); // Agrega un 0 si los minutos tienen un solo dígito
    const seconds = fechaActual1.getSeconds().toString().padStart(2, "0"); // Agrega un 0 si los segundos tienen un solo dígito
    const fechaConHoraPersonalizada1 = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.formularioCaja.get("fechaCierre")?.setValue(fechaConHoraPersonalizada1);
    console.log("this.formularioCaja",this.formularioCaja);
    this.dialog.open(MensajeEliminarComponent, {data: `¿Deseas cerrar la caja?`,})
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const userId = this.auth.getIdUsuario(); //ID del usuario actual
          const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
          const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;

          this.cajaService.actualizarCaja(lastInsertedId, this.formularioCaja.value).subscribe((respuesta) => {
              console.log("Caja actualizada");
              this.mostrarInputFlag = true;
              this.cerrarCaja = false;
              this.botonProductos = false;
            });
        } else {
        }
      });
  }

  obtenerDetallesCajaaaa(Recepcionista_idRecepcionista: number | null, idCaja: number | null) {
    if (Recepcionista_idRecepcionista !== null && idCaja !== null) {
      const recepcionistaId = Recepcionista_idRecepcionista.toString(); // Convertir a string
      const cajaId = idCaja.toString(); // Convertir a string
      this.joinDetalleVentaService.obtenerDetallesCaja(recepcionistaId, cajaId).subscribe(
        (data) => {
          this.detallesCajaaaa = data;
          this.dataSource2.data = this.detallesCajaaaa; 
          console.log('Detalles de la caja:', this.detallesCaja);
        },
        (error) => {
          console.error('Error al obtener detalles de la caja:', error);
        }
      );
    } else {
      console.error('Recepcionista_idRecepcionista o idCaja es nulo');
    }
  }

  descargarPDF(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSource2 || !this.dataSource2.filteredData || this.dataSource2.filteredData.length === 0) {
      this.toastr.error('No hay información para exportar.', 'Error!!!');
      console.warn('No hay datos filtrados para exportar a PDF.');
      return;
    }
  
    // Crear un objeto jsPDF
    const pdf = new (jsPDF as any)();  // Utilizar 'as any' para evitar problemas de tipo
  
    // Encabezado del PDF
    pdf.setFontSize(20);
    pdf.text('Corte de Caja', 105, 15, null, null, 'center');
  
    // Obtener datos filtrados según el filtro actual de la tabla
    const datosFiltrados = this.dataSource2.filteredData.map((detalle: any) => [
      detalle.nombreProducto,
      detalle.cantidadElegida,
      detalle.precioUnitario,
      detalle.fechaVenta
    ]);
  
    // Agregar estilos al PDF
    const styles = {
      theme: 'striped',
      headStyles: {
        fillColor: [249, 166, 64],
        textColor: [255, 255, 255]
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        2: { cellWidth: 'wrap' }
      },
      margin: { top: 30 }
    };
  
    // Añadir filas al PDF con autoTable
    pdf.autoTable({
      head: [['Nombre Producto', 'Cantidad', 'Precio Unitario', 'Fecha']],
      body: datosFiltrados,
      startY: 35,
      styles,
      headStyles: styles.headStyles,
      bodyStyles: styles.bodyStyles,
      alternateRowStyles: styles.alternateRowStyles,
      columnStyles: styles.columnStyles
    });
  
    // Descargar el archivo PDF
    pdf.save('CorteDeCaja.pdf');
  }
  

  descargarExcel(): void {
    // Verificar si hay datos para exportar
    if (!this.dataSource2 || !this.dataSource2.filteredData || this.dataSource2.filteredData.length === 0) {
      this.toastr.error('No hay información para exportar.', 'Error!!!');
      console.warn('No hay datos filtrados para exportar a Excel.');
      return;
    }
  
    const datosFiltrados = this.dataSource2.filteredData.map((detalle: any) => ({
      'Nombre Producto': detalle.nombreProducto,
      'Cantidad': detalle.cantidadElegida,
      'Precio Unitario': detalle.precioUnitario,
      'Fecha': detalle.fechaVenta
    }));
  
    // Crear un objeto de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosFiltrados);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
  
    // Convertir el libro de trabajo a un archivo de Excel binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Crear un Blob y descargar el archivo Excel
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const fecha = new Date().toISOString().split('T')[0]; // Obtener la fecha actual para el nombre del archivo
    const nombreArchivo = `CorteDeCaja_${fecha}.xlsx`;
    saveAs(data, nombreArchivo); // Utiliza la función saveAs para descargar el archivo
  
    this.toastr.success('Archivo Excel generado correctamente.', '¡Éxito!');
  }



  descargarPDF2(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.toastr.error('No hay información para exportar.', 'Error!!!');
      console.warn('No hay datos filtrados para exportar a PDF.');
      return;
    }
  
    // Crear un objeto jsPDF
    const pdf = new (jsPDF as any)();  // Utilizar 'as any' para evitar problemas de tipo
  
    // Encabezado del PDF
    pdf.setFontSize(20);
    pdf.text('Corte de Caja', 105, 15, null, null, 'center');
  
    // Obtener datos filtrados según el filtro actual de la tabla
    const datosFiltrados = this.dataSource.filteredData.map((detalle: any) => [
      detalle.nombreProducto,
      detalle.cantidadElegida,
      detalle.precioUnitario,
      detalle.fechaVenta
    ]);
  
    // Agregar estilos al PDF
    const styles = {
      theme: 'striped',
      headStyles: {
        fillColor: [249, 166, 64],
        textColor: [255, 255, 255]
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        2: { cellWidth: 'wrap' }
      },
      margin: { top: 30 }
    };
  
    // Añadir filas al PDF con autoTable
    pdf.autoTable({
      head: [['Nombre Producto', 'Cantidad', 'Precio Unitario', 'Fecha']],
      body: datosFiltrados,
      startY: 35,
      styles,
      headStyles: styles.headStyles,
      bodyStyles: styles.bodyStyles,
      alternateRowStyles: styles.alternateRowStyles,
      columnStyles: styles.columnStyles
    });
  
    // Descargar el archivo PDF
    pdf.save('CorteDeCaja.pdf');
  }
  

  descargarExcel2(): void {
    // Verificar si hay datos para exportar
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.toastr.error('No hay información para exportar.', 'Error!!!');
      console.warn('No hay datos filtrados para exportar a Excel.');
      return;
    }
  
    const datosFiltrados = this.dataSource.filteredData.map((detalle: any) => ({
      'Nombre Producto': detalle.nombreProducto,
      'Cantidad': detalle.cantidadElegida,
      'Precio Unitario': detalle.precioUnitario,
      'Fecha': detalle.fechaVenta
    }));
  
    // Crear un objeto de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosFiltrados);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
  
    // Convertir el libro de trabajo a un archivo de Excel binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Crear un Blob y descargar el archivo Excel
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const fecha = new Date().toISOString().split('T')[0]; // Obtener la fecha actual para el nombre del archivo
    const nombreArchivo = `CorteDeCaja_${fecha}.xlsx`;
    saveAs(data, nombreArchivo); // Utiliza la función saveAs para descargar el archivo
  
    this.toastr.success('Archivo Excel generado correctamente.', '¡Éxito!');
  }

  cargarArchivo(event: any): void {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const data: ArrayBuffer = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // 'excelData' ahora contiene los datos del archivo Excel
  
      // Asignar 'excelData' al origen de datos de tu tabla (this.dataSource)
      this.dataSource = new MatTableDataSource<any>(excelData);
    };
    reader.readAsArrayBuffer(file);
  }
}
