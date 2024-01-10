import { Component, OnInit, ViewChild } from '@angular/core';
import { PagoMembresiaEfectivoService } from 'src/app/service/pago-membresia-efectivo.service';
import { MatPaginator } from '@angular/material/paginator'; //para paginacion en la tabla
import { MatTableDataSource } from '@angular/material/table'; //para controlar los datos del api y ponerlos en una tabla
import { MensajeEmergenteComponent } from '../mensaje-emergente/mensaje-emergente.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormPagoEmergenteComponent } from '../form-pago-emergente/form-pago-emergente.component';
import { MensajeListaComponent } from '../ListaClientes/mensaje-cargando.component';
import { listarClientesService } from 'src/app/service/listarClientes.service';
import { ClienteService } from 'src/app/service/cliente.service';
import { HuellaService } from 'src/app/service/huella.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

interface ClientesActivos {
  ID: number;
  Nombre: string;
  Sucursal: string;
  Membresia: string;
  Info_Membresia: string;
  Fecha_Inicio: string;
  Fecha_Fin: string;
  Status: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    formulario: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-lista-membresias-pago-efec',
  templateUrl: './lista-membresias-pago-efec.component.html',
  styleUrls: ['./lista-membresias-pago-efec.component.css'],
  providers: [DatePipe],
})

export class ListaMembresiasPagoEfecComponent implements OnInit {
  
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  clientePago: any;
  //clienteActivo: any;
  clienteReenovacion: any;
  cliente: any;
  clienteActivo: ClientesActivos[] = [];   //clienteActivo debe tener el tipo adecuado (en este caso, un array de ClientesActivos)
  dataSource: any; // instancia para matTableDatasource
  dataSourceActivos: any;
  dataSourceReenovacion: any;
  fechaInicio: Date = new Date(); // Inicializa como una nueva fecha
  fechaFin: Date = new Date();    // Inicializa como una nueva fecha
  id: any;
  //titulos de columnas de la tabla de pago online
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Sucursal',
    'Membresia',
    'Precio',
    'Status',
    'Dinero recibido',
    'Pagar',
  ];
  //titulos de columnas de la tabla clientes activos
  displayedColumnsActivos: string[] = [
    'ID',
    'Nombre',
    'Sucursal',
    'Membresia',
    'Info Membresia',
    'Fecha Inicio',
    'Fecha Fin',
    'Status',
  ];

  //titulos de columnas de la tabla Reenovacion de membresias
  displayedColumnsReenovacionMem: string[] = [
    'ID',
    'Nombre',
    'Sucursal',
    'Membresia',
    'Precio',
    'Fecha_Inicio',
    'Fecha_Fin',
    'Status',
    'Dinero recibido',
    'Pagar',
    'Actualizar',
  ];
  dineroRecibido: number; // =0
  moneyRecibido: number; // =0
  IDvalid: number;

  //paginator es una variable de la clase MatPaginator
  @ViewChild('paginatorPagoOnline', { static: true }) paginator!: MatPaginator;
  @ViewChild('paginatorActivos', { static: true }) paginatorActivos!: MatPaginator;
  @ViewChild('paginatorReenovacionMem', { static: true }) paginatorReenovacion!: MatPaginator;

  constructor(
    private pagoService: PagoMembresiaEfectivoService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private ListarClientesService: listarClientesService,
    private huellasService: HuellaService,
    private clienteService: ClienteService,
    private datePipe: DatePipe,
  ) {
    this.form = this.fb.group({
      idUsuario: [''],
      action: ['add'],
      // id_module: ['', Validators.compose([Validators.required])],
    });

    //obtener id del cliente
    this.clienteService.data$.subscribe((data: any) => {
      console.log('Datos recibidos:', data);
      if (data && data.idCliente) {
        this.obtenerCliente(data.idCliente); // Obtener cliente usando el ID recibido
        this.id = data.idCliente;
        // Actualizar el valor del control 'id' en el formulario
        this.form.get('idUsuario')?.setValue(this.id);
      }
    });
  }

  ngOnInit(): void {
    this.pagoService.obternerDataMem().subscribe((respuesta) => {
      console.log(respuesta);
      this.clientePago = respuesta;
      this.dataSource = new MatTableDataSource(this.clientePago);
      this.dataSource.paginator = this.paginator;
    });

    /*this.pagoService.obtenerActivos(this.formatDate(this.fechaInicio),
                                    this.formatDate(this.fechaFin
                                    ).subscribe((response) => {
      console.log(response);
      this.clienteActivo = response;
      this.dataSourceActivos = new MatTableDataSource(this.clienteActivo);
      this.dataSourceActivos.paginator = this.paginatorActivos;
    });*/

    this.pagoService.clientesMemReenovar().subscribe((data) => {
      console.log(data);
      this.clienteReenovacion = data;
      this.dataSourceReenovacion = new MatTableDataSource(this.clienteReenovacion);
      this.dataSourceReenovacion.paginator = this.paginatorReenovacion;
    });

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
  
    this.pagoService.obtenerActivos(
      this.formatDate(this.fechaInicio),
      this.formatDate(this.fechaFin)
    ).subscribe(
      response => {
        console.log(response);
  
        if (response.msg == 'No hay resultados') {
          // Si no hay datos, resetea la tabla
          this.clienteActivo = [];
          this.dataSourceActivos = new MatTableDataSource(this.clienteActivo);
          this.dataSourceActivos.paginator = this.paginatorActivos;
          //console.log('No hay clientes activos en este rango de fechas.');
          this.toastr.info('No hay clientes activos en este rango de fechas.', 'Info!!!');

        } else if(response){
          // Si hay datos, actualiza la tabla
          this.clienteActivo = response;
          this.dataSourceActivos = new MatTableDataSource(this.clienteActivo);
          this.dataSourceActivos.paginator = this.paginatorActivos;
          this.toastr.success('Datos encontrados.', 'Success!!!');
        }
      },
      error => {
        console.error('Error en la solicitud:', error);
        // Manejo de errores adicional si es necesario
        this.clienteActivo = [];
        this.dataSourceActivos = new MatTableDataSource(this.clienteActivo);
        this.dataSourceActivos.paginator = this.paginatorActivos;
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

  applyFilterActivos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceActivos.filter = filterValue.trim().toLowerCase();
  }

  applyFilterReenovacion(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReenovacion.filter = filterValue.trim().toLowerCase();
  }

  //Se resta el dinero recibido del precio para el apartado de actualizacion de membresia
  realizarPago(updMem: any): void {
    if (updMem.moneyRecibido >= updMem.Precio) {
      updMem.PrecioCalcular = updMem.moneyRecibido - updMem.Precio;
      console.log(updMem.PrecioCalcular);
      console.log(updMem.ID);

      this.pagoService
        .pagoMemOpcion1(updMem.ID)
        .subscribe((dataResponse: any) => {
          console.log(dataResponse.msg);

          // Eliminar la fila de la tabla uno
          const index = this.dataSourceReenovacion.data.indexOf(updMem);
          if (index !== -1) {
            this.dataSourceReenovacion.data.splice(index, 1);
            this.dataSourceReenovacion._updateChangeSubscription(); // Notificar a la tabla sobre el cambio
          }

          // Agregar y Actualizar la fila a la tabla dos (dataSourceActivos)
          this.pagoService.obtenerActivos(this.formatDate(this.fechaInicio),
                                          this.formatDate(this.fechaFin)
                                          ).subscribe((respuesta) => {
            console.log(respuesta);
            this.clienteActivo = respuesta;
            // Actualizar la fuente de datos de la segunda tabla (dataSourceActivos)
            this.dataSourceActivos.data = this.clienteActivo.slice();
            // Notificar a la tabla sobre el cambio
            this.dataSourceActivos._updateChangeSubscription();
          });

          this.dialog
            .open(MensajeEmergenteComponent, {
              data: `Pago exitoso, el cambio es de: $${updMem.PrecioCalcular}`,
            })
            .afterClosed()
            .subscribe((cerrarDialogo: Boolean) => {
              if (cerrarDialogo) {
                // Recargar la página actual
                //location.reload();
                //this.router.navigateByUrl(`/index/`);
              } else {
              }
            });
        });
    } else {
      this.toastr.error('No alcanza para pagar esta membresia', 'Error!!!');
    }
  }

  abrirEmergente(updMem: any) {
    // Abre el diálogo y almacena la referencia
    const dialogRef = this.dialog.open(FormPagoEmergenteComponent, {
      data: {
        idCliente: `${updMem.ID}`,
        nombre: `${updMem.Nombre}`,
        sucursal: `${updMem.Sucursal}`,
        membresia: `${updMem.Membresia}`,
        precio: `${updMem.Precio}`,
        duracion: `${updMem.Duracion}`,
        idSucursal: `${updMem.Gimnasio_idGimnasio}`,
      },
    });

    // Suscríbete al evento actualizarTablas del diálogo
    dialogRef.componentInstance.actualizarTablas.subscribe(
      (actualizar: boolean) => {
        if (actualizar) {
          // Realiza las operaciones de actualización necesarias aquí
          // Eliminar la fila de la tabla uno
          const index = this.dataSourceReenovacion.data.indexOf(updMem);
          if (index !== -1) {
            this.dataSourceReenovacion.data.splice(index, 1);
            this.dataSourceReenovacion._updateChangeSubscription(); // Notificar a la tabla sobre el cambio
          }

          // Agregar y Actualizar la fila a la tabla dos (dataSourceActivos)
          this.pagoService.obtenerActivos(this.formatDate(this.fechaInicio),
                                          this.formatDate(this.fechaFin)
                                          ).subscribe((respuesta) => {
            console.log(respuesta);
            this.clienteActivo = respuesta;
            // Actualizar la fuente de datos de la segunda tabla (dataSourceActivos)
            this.dataSourceActivos.data = this.clienteActivo.slice();
            // Notificar a la tabla sobre el cambio
            this.dataSourceActivos._updateChangeSubscription();
          });
        }
      }
    );

    // Suscríbete al evento afterClosed() para manejar el caso en que se cierra el diálogo
    dialogRef.afterClosed().subscribe((cancelDialog: boolean) => {
      if (cancelDialog) {
      
      } else {
        
      }
    });
  }

  //Se resta el dinero recibido del precio para el apartado de pago de membresia cliente online
  realizarCalculo(prod: any): void {
    if (prod.dineroRecibido >= prod.Precio) {
      prod.PrecioCalculado = prod.dineroRecibido - prod.Precio;
      console.log(prod.PrecioCalculado);

      this.pagoService
        .idPagoSucursal(prod.ID, prod.idDetMem)
        .subscribe((response: any) => {
          console.log(response.msg);

          // Eliminar la fila de la tabla uno
          const index = this.dataSource.data.indexOf(prod);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription(); // Notificar a la tabla sobre el cambio
          }

          // Agregar y Actualizar la fila a la tabla dos (dataSourceActivos)
          this.pagoService.obtenerActivos(this.formatDate(this.fechaInicio),
                                          this.formatDate(this.fechaFin)
                                          ).subscribe((response) => {
            console.log(response);
            this.clienteActivo = response;
            // Actualizar la fuente de datos de la segunda tabla (dataSourceActivos)
            this.dataSourceActivos.data = this.clienteActivo.slice();
            // Notificar a la tabla sobre el cambio
            this.dataSourceActivos._updateChangeSubscription();
          });

          this.dialog
            .open(MensajeEmergenteComponent, {
              data: `Pago exitoso, el cambio es de: $${prod.PrecioCalculado}`,
            })
            .afterClosed()
            .subscribe((cerrarDialogo: Boolean) => {
              if (cerrarDialogo) {
                // Recargar la página actual
                //location.reload();
                //this.router.navigateByUrl(`/index/`);
              } else {
              }
            });
        });
    } else {
      this.toastr.error('No alcanza para pagar esta membresia', 'Error!!!');
    }
  }

  /*********PARTE DEL DIALOGO *************/
  abrirDialogo() {
    this.dialog
      .open(MensajeListaComponent, {
        //data: `Membresía agregada exitosamente`,
        width: '500px',
        height: '500px',
      })
      .afterClosed()
      .subscribe((cerrarDialogo: Boolean) => {
        if (cerrarDialogo) {
          this.router.navigateByUrl('/admin/listaMembresias');
        } else {
        }
      });
  }

  obtenerCliente(idCliente: number) {
    this.ListarClientesService.consultarCliente(idCliente).subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          console.log('Datos del cliente:', data[0]);
          this.cliente = data[0]; // Asigna el primer elemento del array como cliente
        }
      }
    );
  }

  RegistrarHuella(idCliente: number): void {
    //console.log(idCliente);
    this.huellasService
      .registroHuella(idCliente)
      .subscribe((dataResponse: any) => {
        console.log(dataResponse);
        if (dataResponse) {
          console.log(
            'Mi ID es: ',
            dataResponse.ID_Cliente,
            'Y mi nombre es: ',
            dataResponse.nombre
          );
        } else {
          console.log('No existe el cliente');
        }
      });
  }

  mandaInstruccionTorniquete() {
    console.log(this.form.value);
    this.huellasService.insertarInstruccion(this.form.value).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.toastr.success(respuesta.message, 'Exito', {
          positionClass: 'toast-bottom-left',
        });
      },
      error: (paramError) => {
        console.log(paramError);
          this.toastr.error(paramError.message, 'Error', {
            positionClass: 'toast-bottom-left',
          });
        
      },
    });
  }

  //Descarga el archivo en excel
  descargarExcel(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSourceActivos || !this.dataSourceActivos.filteredData || this.dataSourceActivos.filteredData.length === 0) {
      this.toastr.error('No hay datos para exportar.', 'Error!!!');
      //console.warn('No hay datos para exportar a Excel.');
      return;
    }

    // Mapea la información de this.productosVendidos a un arreglo bidimensional
    const datos = [
      ['ID', 'Nombre', 'Sucursal', 'Membresia', 'Info Membresia', 'Fecha Inicio', 'Fecha Fin', 'Status'],
      ...this.dataSourceActivos.filteredData.map((activos: ClientesActivos) => [
        activos.ID,
        activos.Nombre,
        activos.Sucursal,
        activos.Membresia,
        activos.Info_Membresia,
        activos.Fecha_Inicio,  // La propiedad debe tener el nombre correcto
        activos.Fecha_Fin,
        activos.Status
      ])
    ];

    // Crear un objeto de libro de Excel
    const workbook = XLSX.utils.book_new();
    const hojaDatos = XLSX.utils.aoa_to_sheet(datos);
    // Establecer propiedades de formato para las columnas
    hojaDatos['!cols'] = [
      // Se le asigna un ancho a cada columna comenzando con la A
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
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
    saveAs(newBlob, 'Clientes Activos.xlsx');
  }

  private formatDateV2(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  
  //Descarga el archivo en PDF
  descargarPDF(): void {
    // Verifica si hay datos para exportar
    if (!this.dataSourceActivos || !this.dataSourceActivos.filteredData || this.dataSourceActivos.filteredData.length === 0) {
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
    pdf.text(`Reporte de los clientes activos (${fechaInicio} - ${fechaFin})`, 10, 10);
    
    // Contenido del PDF
    const datos = this.dataSourceActivos.filteredData.map((activos: ClientesActivos) => [
      activos.ID,
      activos.Nombre,
      activos.Sucursal,
      activos.Membresia,
      activos.Info_Membresia,
      activos.Fecha_Inicio,
      activos.Fecha_Fin,
      activos.Status
    ]);
  
    // Añadir filas al PDF con encabezado naranja
    pdf.autoTable({
      head: [['ID', 'Nombre', 'Sucursal', 'Membresia', 'Info Membresia', 'Fecha Inicio', 'Fecha Fin', 'Status']],
      body: datos,
      startY: 20,  // Ajusta la posición inicial del contenido
      headStyles: {
        fillColor: [249, 166, 64],  // Color naranja RGB
        textColor: [255, 255, 255]  // Color blanco para el texto
      }
    });
  
    // Descargar el archivo PDF
    pdf.save('Clientes Activos.pdf');
  }
}
