import { Component, OnInit, ViewChild , Inject} from "@angular/core";

import { MatTableDataSource } from "@angular/material/table"; //para controlar los datos del api y ponerlos en una tabla
import { Producto } from "../models/producto";
import { ProductosService } from "src/app/service/productos.service";
import { AuthService } from "src/app/service/auth.service";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { CajaService } from "src/app/service/caja.service";
import { DetalleVenta } from "src/app/service/detalleVenta.service";
import { detalleVenta } from "../models/detalleVenta";
import { listarClientesService } from "src/app/service/listarClientes.service";
import { Router } from "@angular/router";
import { MensajeListaComponent } from "../ListaClientes/mensaje-cargando.component";
import { MatDialog } from "@angular/material/dialog";
import { ClienteService } from "src/app/service/cliente.service";
import { Ventas } from "../models/ventas";
import { VentasService } from "src/app/service/ventas.service";
import { MensajeEmergenteComponent } from "../mensaje-emergente/mensaje-emergente.component";
import { JoinDetalleVentaService } from "src/app/service/JoinDetalleVenta";
import { MensajeEliminarComponent } from "../mensaje-eliminar/mensaje-eliminar.component";
import { inventarioService } from "src/app/service/inventario.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/service/User";
import { ChangeDetectorRef } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HomeComponent } from "../home/home.component";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



interface Cliente {
  ID_Cliente: number;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class VentasComponent implements OnInit {
  formularioCaja: FormGroup;
  productosArray: FormArray;
  formularioDetalleVenta: FormGroup;
  datosParaGuardarVenta: Ventas;
  numero: any;
  detalle: any;
  cliente: any;
  detalles: any;
  producto: any;
  productos: any;
  fechaFin: Date;
  fechaInicio: Date;
  ubicacion: string;
  fecha: string = "";
  hora: string = "";
  ubicacionGym: string; 
  fechaFiltro: string = "";
  fechaConHora: string = "";
  opcionSeleccionada: string = "diario";
  idUsuarioo: number;
  lastInsertedId: number;
  lastInsertedId3: number;
  totalAPagar: number = 0;
  dineroRecibido: number = 0;
  totalAPagarCorte: number = 0;
  cantidadSolicitada: number = 0;
  cerrarCaja: boolean = true;
  modoLectura: boolean = false;
  mostrarRango: boolean = false;
  mostrarDiario: boolean = true;
  botonProductos: boolean = false;
  botonHabilitado: boolean = false;
  mostrarInputFlag: boolean = false;
  mostrarProductos: boolean = false;
  mostrarLasVentas: boolean = false;
  botonDeshabilitado: boolean = true;
  selectedClient: number | null = null;
  detallesCaja: any[] = [];
  clientes: Cliente[] = [];
  listaClientes: any[] = [];
  productData: Producto[] = []; 
  listInventarioData: any[] = [];
  selectedProducts: Producto[] = [];
  clientesFiltrados: Cliente[] = [];
  datosParaGuardarDetalleVenta: detalleVenta[] = [];
  columnas: string[] = [
    "nombreProducto",
    "cantidadElegida",
    "precioUnitario",
    "fechaVenta",
  ];
  displayedColumns: string[] = [
    "codigo_de_barra",
    "categoria",
    "nombre",
    "descripcion",
    "precio",
    "cantidad",
    "acciones",
  ];

  dataSource: MatTableDataSource<any>; 
  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;

  constructor(
    public dialogo: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string,
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService,
    private toastr: ToastrService,
    public formulario: FormBuilder,
    private cajaService: CajaService,
    private DetalleVenta: DetalleVenta,
    private ventasService: VentasService,
    private clienteService: ClienteService,
    private productoService: ProductosService,
    private InventarioService: inventarioService,
    private changeDetectorRef: ChangeDetectorRef,
    private ListarClientesService: listarClientesService,
    private joinDetalleVentaService: JoinDetalleVentaService,
  ) {
    const userId = this.auth.getIdUsuario(); // id del usuario
    const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
    const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
   /* this.cajaService.consultarCaja(lastInsertedId).subscribe((respuesta) => {
      console.log(respuesta);
      this.formularioCaja.setValue({
        fechaApertura: respuesta[0]["fechaApertura"],
        fechaCierre: respuesta[0]["fechaCierre"],
        cantidadDineroAcumuladoTeoria:
          respuesta[0]["cantidadDineroAcumuladoTeoria"],
        cantidadDineroExistente: respuesta[0]["cantidadDineroExistente"],
        Recepcionista_idRecepcionista:
          respuesta[0]["Recepcionista_idRecepcionista"],
      });
    });*/
    this.formularioCaja = this.formulario.group({
      fechaApertura: [{ value: "", disabled: true }],
      fechaCierre: ["0000-00-00"],
      cantidadDineroAcumuladoTeoria: ["0"],
      cantidadDineroExistente: ["", Validators.required],
      Recepcionista_idRecepcionista: [userId],
    });
    /* --------------------------------------------------------------*/
    this.formularioDetalleVenta = this.formulario.group({
      productos: this.formulario.array([]),
    });
    /* --------------------------------------------------------------*/
    this.productosArray = this.formularioDetalleVenta.get(
      "productos"
    ) as FormArray;
    /* --------------------------------------------------------------*/
    //obtener id del cliente
    this.clienteService.data$.subscribe((data) => {
      console.log("Datos recibidos:", data);
      if (data && data.idCliente) {
        this.obtenerCliente(data.idCliente); // Obtener cliente usando el ID recibido
      }
    });
  }

  ngAfterViewInit(): void {
    console.log(this.auth.getIdGym(), "this.auth.getIdGym()");
    this.productoService.obternerProductos(this.auth.getIdGym()).subscribe((respuesta) => {
      this.productData = respuesta;
      console.log("this.productData", this.productData);
      this.dataSource = new MatTableDataSource(this.productData);
      this.dataSource.paginator = this.paginator; // Asignación del paginador aquí
      console.log(this.paginator,"this.paginator");
    });

   
  
  }

  ejecutarServicio(): void {
    // Llama a tu servicio aquí
    this.DetalleVenta.obternerEstatus().subscribe((result) => {
      console.log('Resultado del servicio:', result);
    });
  }
  
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {

    interval(1000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.ejecutarServicio();
    });

    //ubicacion
    this.ubicacion = this.auth.getUbicacion();
    //datos de detalle venta
    this.DetalleVenta.obternerVentaDetalle().subscribe({
      next: (resultData) => {
        this.detalle = resultData;
      },
    });
    this.clienteService;
    //////////////////////////////////////////////////////
    const userId = this.auth.getIdUsuario(); // ID del usuario actual
    const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
    const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
    //obtener datos de caja por id
    this.cajaService.consultarCaja(lastInsertedId).subscribe(
      (resultados) => {
        const fechaCierre = resultados[0].fechaCierre;
        this.mostrarOcultarBoton(fechaCierre); // Llamada al método para mostrar u ocultar el botón
      },
      (error) => {
        console.error("Error al consultar la fecha de cierre:", error);
      }
    );   
  }

  mostrarP(){
    this.mostrarProductos = true;
    this.botonProductos = false;
  }

  /*obtenerDetallesCaja(Recepcionista_idRecepcionista: number | null) {
    const idUsuario = this.auth.getIdUsuario();
    this.joinDetalleVentaService.consultarProductosVentas(idUsuario).subscribe(
      (data) => {
        this.detallesCaja = data;
        // this.dataSource2 = new MatTableDataSource(this.detallesCaja); // Inicializar dataSource2 como MatTableDataSource
        //this.dataSource2.paginator = this.paginator2; // Vincular el paginador con el dataSource2
        // console.log("this.dataSource2.paginator", this.dataSource2.paginator);
        this.dataSource2.data = this.detallesCaja; // Asignar los datos al dataSource2
      },
      (error) => {
        console.error("Error al obtener detalles de la caja:", error);
      }
    );
  }*/

  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;
    if (opcion === "diario") {
      this.mostrarDiario = true; // Define una variable para mostrar elementos de diario
      this.mostrarRango = false; // Oculta los elementos del rango
    } else if (opcion === "rango") {
      this.mostrarRango = true; // Define una variable para mostrar elementos del rango
      this.mostrarDiario = false; // Oculta los elementos de diario
    }
  }

 /* aplicarFiltro() {
    const fechaFiltrar = new Date(this.fechaFiltro);
    this.dataSource2.filter = fechaFiltrar.toISOString().slice(0, 10); // Ajusta el formato a 'YYYY-MM-DD'
    this.dataSource2.filterPredicate = (data: any, filter: string) => {
      return data.fechaVenta.includes(filter); // Compara la fecha con el filtro
    };
  }

  aplicarFiltross() {
    const fechaInicioFiltrar = new Date(this.fechaInicio);
    const fechaFinFiltrar = new Date(this.fechaFin);
    this.dataSource2.filterPredicate = (data: any, filter: string) => {
      const fechaItem = new Date(data.fechaVenta); // Ajusta 'fechaVenta' a tu propiedad de fecha
      return fechaItem >= fechaInicioFiltrar && fechaItem <= fechaFinFiltrar;
    };
    // Concatenar las fechas con un carácter que no se espera en las fechas
    const filtro = `${fechaInicioFiltrar.toISOString().slice(0, 10)}_${fechaFinFiltrar.toISOString().slice(0, 10)}`;
    this.dataSource2.filter = filtro;
  }*/


  obtenerCliente(idCliente: number) {
    this.ListarClientesService.consultarCliente(idCliente).subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          this.cliente = data[0]; // Asigna el primer elemento del array como cliente
        }
      }
    );
  }
  /*********PARTE DEL DIALOGO *************/
  abrirDialogo() {
    this.dialog.open(MensajeListaComponent, {
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

  filtrarClientes(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Filtra los clientes basándote en el valor de búsqueda
    if (searchValue) {
      this.clientesFiltrados = this.clientes.filter((cliente) =>
        `${cliente.nombre} ${cliente.apPaterno} ${cliente.apMaterno}`
          .toLowerCase()
          .includes(searchValue)
      );
    } else {
      // Si no hay valor de búsqueda, muestra todos los clientes
      this.clientesFiltrados = this.clientes;
    }
  }
  /*********HASTA ACA */
  /**metodo para filtrar la informacion que escribe el usaurio*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("this.dataSource.filter", this.dataSource.filter);
  }

  mostrarInput() {
    this.mostrarInputFlag = true;
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Agrega un 0 si el mes tiene un solo dígito
    const day = fechaActual.getDate().toString().padStart(2, "0"); // Agrega un 0 si el día tiene un solo dígito
    const hours = fechaActual.getHours().toString().padStart(2, "0"); // Agrega un 0 si la hora tiene un solo dígito
    const minutes = fechaActual.getMinutes().toString().padStart(2, "0"); // Agrega un 0 si los minutos tienen un solo dígito
    const seconds = fechaActual.getSeconds().toString().padStart(2, "0"); // Agrega un 0 si los segundos tienen un solo dígito
    const fechaConHoraPersonalizada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.formularioCaja.get("fechaApertura")?.setValue(fechaConHoraPersonalizada);  // Verifica si el formulario es válido
  }

  mostrarOcultarBoton(fechaCierre: string) {
    console.log("fechaCierre", fechaCierre);
    if (fechaCierre === "0000-00-00 00:00:00") {
      this.botonProductos = true;
      this.botonDeshabilitado = false;
    } else {
      this.botonProductos = false;
    }
  }

  getUltimoIdInsertado(userId: string): number | null {
    const lastInsertedIdString = localStorage.getItem(
      `lastInsertedId_${userId}`
    );
    if (lastInsertedIdString) {
      return parseInt(lastInsertedIdString, 10);
    }
    return null;
  }

  mostrarCaja() {
    this.formularioCaja.get("fechaApertura")?.enable();
    console.log("this.formularioCaja.value", this.formularioCaja.value);
    if (this.formularioCaja.valid) {
      console.log("ID insertado caja:", this.formularioCaja.value);
      this.cajaService
        .agregarCaja(this.formularioCaja.value)
        .subscribe((respuesta) => {
          console.log("pasa");
          if (respuesta.success === 1) {
            this.lastInsertedId = respuesta.lastInsertedId;

            console.log("ID insertado caja:", this.lastInsertedId);
            this.mostrarProductos = true;

            const userId = this.auth.getIdUsuario(); // Aquí debes obtener el ID del usuario actual
            localStorage.setItem(
              `lastInsertedId_${userId}`,
              this.lastInsertedId.toString()
            );
          } else {
            console.log("Error al insertar la caja");
          }
        });
    } else {
      console.log("Formulario no válido");
    }
    this.botonDeshabilitado = false;
    // Guardamos el registro del usuario en el local storage (en formato cadena)
  }

  enviarDatosYDetallesVenta() {
    console.log("total", this.totalAPagar <= this.dineroRecibido);
    if (this.totalAPagar <= this.dineroRecibido) {
      const userId = this.auth.getIdUsuario(); //ID del usuario actual
      const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
      const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
      const fechaActual = new Date();
      const offset = fechaActual.getTimezoneOffset(); // Obtiene el offset en minutos
      fechaActual.setMinutes(fechaActual.getMinutes() - offset);
      const fechaVenta = fechaActual.toISOString().replace("T", " ").split(".")[0];
      const idCliente = this.cliente?.ID_Cliente || null; // Acceder al ID del cliente seleccionado
      const totalAPagar = this.selectedProducts.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,0);
      // Enviar datos de ventas
      const datosVentas = {
        Cliente_ID_Cliente: idCliente,
        Caja_idCaja: 1,
        fechaVenta: fechaVenta,
        total: totalAPagar,
      };
      this.ventasService.agregarVentas(datosVentas).subscribe((response) => {
        const lastInsertedId3 = response.lastInsertedId3;
        // Enviar detalles de ventas
        const detallesVenta = this.selectedProducts.map((producto) => {
          return {
            Ventas_idVentas: lastInsertedId3,
            Producto_idProducto: producto.id,
            nombreProducto: producto.nombre,
            cantidadElegida: producto.cantidad,
            precioUnitario: producto.precio,
            Gimnasio_idGimnasio: this.auth.getIdGym(),
            importe: producto.cantidad * producto.precio,
          };
        });
        console.log("Detalles de venta", detallesVenta);
        this.DetalleVenta.agregarVentaDetalle(detallesVenta).subscribe(
          (response) => {
            console.log("Detalles de ventas guardados correctamente");
          }
        );
        this.dialog.open(MensajeEmergenteComponent, {
            data: `Productos registrados correctamente`,
          })
          .afterClosed()
          .subscribe((cerrarDialogo: Boolean) => {
            if (cerrarDialogo) {
              this.resetearValores();
            } else {
            }
          });
      });
    } else {
      this.toastr.error("Ingresa el pago");
    }
  }

  resetearValores() {
    this.selectedProducts = [];
    this.totalAPagar = 0;
    this.cliente = {
      ID_Cliente: "",
      nombre: "",
      apPaterno: "",
      apMaterno: "",
      email: "",
    };
    this.dineroRecibido = 0;
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
  //****** MOSTRAR TABLA DEL CORTE ******/
  mostrarVentas() {
    this.mostrarLasVentas = true;
    const userId = this.auth.getIdUsuario(); //ID del usuario actual
    const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`);// Obtener el último ID insertado para ese usuario
    const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
    //this.obtenerDetallesCaja(lastInsertedId);
  }

  imprimirResumen() {
    console.log("total", this.totalAPagar <= this.dineroRecibido);
    if (this.totalAPagar <= this.dineroRecibido) {
      const userId = this.auth.getIdUsuario(); //ID del usuario actual
      const lastInsertedIdString = localStorage.getItem(`lastInsertedId_${userId}`); // Obtener el último ID insertado para ese usuario
      const lastInsertedId = lastInsertedIdString? parseInt(lastInsertedIdString, 10): null;
      const fechaActual = new Date();
      const offset = fechaActual.getTimezoneOffset(); // Obtiene el offset en minutos
      fechaActual.setMinutes(fechaActual.getMinutes() - offset);
      const fechaVenta = fechaActual.toISOString().replace("T", " ").split(".")[0];
      const idCliente = this.cliente?.ID_Cliente || null; // Acceder al ID del cliente seleccionado
      const totalAPagar = this.selectedProducts.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,0);
      // Enviar datos de ventas
      const datosVentas = {
        Cliente_ID_Cliente: idCliente,
        Caja_idCaja: 1,
        fechaVenta: fechaVenta,
        total: totalAPagar,
      };

      console.log(datosVentas, "datosVentas");
      this.ventasService.agregarVentas(datosVentas).subscribe((response) => {
        const lastInsertedId3 = response.lastInsertedId3;
        // Enviar detalles de ventas
        const detallesVenta = this.selectedProducts.map((producto) => {
          return {
            Ventas_idVentas: lastInsertedId3,
            Producto_idProducto: producto.id,
            nombreProducto: producto.nombre,
            cantidadElegida: producto.cantidad,
            precioUnitario: producto.precio,
            Gimnasio_idGimnasio: this.auth.getIdGym(),
            importe: producto.cantidad * producto.precio,
          };
        });
        console.log("Detalles de venta", detallesVenta);
        this.DetalleVenta.agregarVentaDetalle(detallesVenta).subscribe(
          (response) => {
            console.log("response",response);
            console.log("Detalles de ventas guardados correctamente");
          }
        );
        this.dialog.open(MensajeEmergenteComponent, {
            data: `Productos registrados correctamente`,
          })
          .afterClosed()
          .subscribe((cerrarDialogo: Boolean) => {
            if (cerrarDialogo) {
              this.resetearValores();
            } else {
            }
          });
      });
    } else {
      this.toastr.error("Ingresa el pago");
    }



    //this.DetalleVenta.obternerEstatus().subscribe();


    ///////////////////////
    if (this.totalAPagar <= this.dineroRecibido) {
      const totalCantidad = this.selectedProducts.reduce(
        (total, producto) => producto.cantidad,
        0
      );
      const totalEnPesos = this.convertirNumeroAPalabrasPesos(this.totalAPagar);
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
            <title>Ticket de Compra</title>
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
            <img  src='../../../../../../assets/img/logo.jpeg)' alt="Logo">
              <h1>Ticket de Compra</h1>
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
                  ${this.selectedProducts
                    .map(
                      (producto) => `
                      <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.cantidad}</td>
                        <td>$${producto.precio}</td>
                        <td>$${producto.precio * producto.cantidad}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
              <hr>
              <p>Cantidad total de productos: ${totalCantidad}</p>
              <div class="total">
              
                <p>Total a Pagar: $${this.totalAPagar}</p>
                </div>
                <p>(${totalEnPesos} PESOS)</p>
                <div class="total">
                <p>Dinero recibido: $${this.dineroRecibido}</p>
                <p>Cambio: $${this.dineroRecibido - this.totalAPagar}</p>
                
                </div>
                <div class="fecha-hora">
                <p>Fecha: ${fechaActual}</p> <!-- Fecha -->
                <p>Hora: ${horaActual}</p> <!-- Hora -->
              </div>
              <div class="brand">
                <p>Gracias por su compra</p>
                <p>¡Vuelva pronto!</p>
              </div>
            </div>
          </body>
        </html>
      `);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
        ventanaImpresion.close();
      }
    } else {
      this.toastr.error("Ingresa el pago");
    }
  }

 /* imprimirResumenCorte() {
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

    const cantidadDinero = this.formularioCaja.get(
      "cantidadDineroExistente"
    )?.value;

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
                <p>Caja: ${this.lastInsertedId}</p>
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
          ${this.dataSource2.filteredData
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
              <p>Monto inicial en caja: $${cantidadDinero} </P>
                <p>Total de ventas: $${this.totalAPagarCorte}</p>
                <p>Total en caja: $${
                  this.totalAPagarCorte + cantidadDinero
                }  </p>
              </div>
            </div>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
      ventanaImpresion.close();
    }
  }*/

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

  obtenerProducto(id: any, idGimnasio: any, cantidadSolicitada: number): void {
    this.InventarioService.obtenerProductoPorId(id, idGimnasio).subscribe({
      next: (data) => {
        this.producto = data; // Almacena el producto obtenido en la variable 'producto'
        console.log("Producto obtenido:", this.producto);
        console.log("aca", data[0].cantidadDisponible);
        if (data[0].cantidadDisponible < cantidadSolicitada) {
          console.error(
            "No hay suficiente stock disponible para esta cantidad."
          );
          // Aquí puedes mostrar un mensaje de error o realizar alguna acción apropiada
          this.toastr.error(
            "No hay suficiente stock disponible para esta cantidad"
          );
        } else {
          // Aquí puedes realizar las operaciones necesarias con el producto obtenido
        }

        if (data[0].cantidadDisponible < 5) {
          this.toastr.warning(`Quedan solo ${data[0].cantidadDisponible} productos disponibles`);
        }
      },
      error: (error) => {
        console.error("Error al obtener el producto:", error);
      },
    });
  }
  
  agregaraBalance(producto: Producto) {
    /*si el producto que se está intentando agregar existe en la lista de productos seleccionados*/
    const productoExistente = this.selectedProducts.find((p) => p.id === producto.id);
    /**
     * Si se encuentra un producto existente con el mismo id, significa que el producto ya ha sido agregado
     * al carrito. En este caso, el código aumenta la cantidad del producto existente en la lista selectedProducts
     *  al agregar la cantidad del nuevo producto (producto.cantidad) a la cantidad existente del producto.
     */
    if (productoExistente) {
      productoExistente.cantidad += producto.cantidad;
    } else {
      this.selectedProducts.push({ ...producto });
    }
    // Recalcular el total a pagar
    this.totalAPagar = this.selectedProducts.reduce(
      (total, p) => total + p.precio * p.cantidad,
      0
    );
    this.cantidadSolicitada = producto.cantidad;
    this.obtenerProducto(producto.id,this.auth.getIdGym(), producto.cantidad);
    producto.cantidad = 0;
  }

  validarYAgregarProducto(producto: Producto) {
    this.InventarioService.obtenerProductoPorId(producto.id, this.auth.getIdGym()).subscribe(
      (data) => {
        const productoObtenido = data[0];
        
        if (!productoObtenido) {
          this.toastr.error("Producto no encontrado");
          return;
        }
  
        const cantidadDisponible = productoObtenido.cantidadDisponible;
        const cantidadSolicitada = producto.cantidad;
  
        if (cantidadDisponible < cantidadSolicitada) {
          this.toastr.error("No hay suficiente stock disponible para esta cantidad");
          return;
        }
        console.log("cantidadDisponible",cantidadDisponible);
  
        if (cantidadDisponible < 5) {

          console.log("entra aca");
          this.toastr.warning(`Quedan solo ${cantidadDisponible} productos disponibles`);
        }
        
  
        const productoExistente = this.selectedProducts.find(p => p.codigo_de_barra === producto.codigo_de_barra);
  
        if (productoExistente) {
          productoExistente.cantidad += cantidadSolicitada;
        } else {
          this.selectedProducts.push({ ...producto });
        }
  
        this.totalAPagar = this.selectedProducts.reduce(
          (total, p) => total + (p.precio * p.cantidad),
          0
        );
  
        producto.cantidad = 0;
        this.obtenerProducto(producto.id,this.auth.getIdGym(),cantidadSolicitada);
      },
      (error) => {
        console.error("Error al obtener el producto:", error);
        this.toastr.error("Error al obtener el producto");
      }
    );
  }


  
}
