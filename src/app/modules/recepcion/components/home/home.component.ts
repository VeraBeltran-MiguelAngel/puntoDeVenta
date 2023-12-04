import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table"; //para controlar los datos del api y ponerlos en una tabla
import { MatPaginator } from "@angular/material/paginator"; //para paginacion en la tabla
import { Producto } from "../models/producto";
import { ProductosService } from "src/app/service/productos.service";
import { AuthService } from "src/app/service/auth.service";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, FormGroupDirective, NgForm } from "@angular/forms";
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
import { MensajeEmergenteComponent } from '../mensaje-emergente/mensaje-emergente.component';
import { JoinDetalleVentaService } from "src/app/service/JoinDetalleVenta";
import { MensajeEliminarComponent } from "../mensaje-eliminar/mensaje-eliminar.component";
import { inventarioService } from "src/app/service/inventario.service";
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';


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
export class HomeComponent implements OnInit {
  selectedProducts: Producto[] = [];
  ubicacionGym: string; //lista de productos seleccionados
  totalAPagar: number = 0;
  dineroRecibido: number = 0;
  ubicacion: string;
  numero: any;
  formularioCaja: FormGroup;
  formularioDetalleVenta: FormGroup;
  mostrarInputFlag: boolean = false;
  mostrarProductos: boolean = false;
  mostrarLasVentas: boolean = false;
  listaClientes: any[] = [];
  fecha: string = "";
  hora: string = "";
  fechaConHora: string = "";
  productosArray: FormArray;
  detalle: any;
  detalles: any;
  cliente: any;
  datosParaGuardarDetalleVenta: detalleVenta[] = [];
  datosParaGuardarVenta: Ventas;
  lastInsertedId3: number;
  lastInsertedId: number;
  totalAPagarCorte: number = 0;
  detallesCaja: any[] = []; 
  
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  selectedClient: number | null = null;
  cerrarCaja: boolean = true;
  botonDeshabilitado: boolean = false;
  botonHabilitado: boolean = false;
  botonDeshabilitadoCorte: boolean = true;
  botonProductos: boolean = false;

  producto: any; // Variable para almacenar el producto obtenido
// Reemplaza con la cantidad que se solicita
productos: any;
cantidadSolicitada: number = 0;

  displayedColumns: string[] = [
    "id",
    "categoria",
    "nombre",
    "tamaño",
    "descripcion",
    "precio",
    "cantidad",
    "acciones",
  ];
  productData: Producto[] = []; //para guardar la respuesta del api en un arreglo

  dataSource: any; // instancia para matTableDatasource

  //paginator es una variable de la clase MatPaginator
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('paginator', { static: true }) paginatorPrueba!: MatPaginator;

  constructor(
    private productoService: ProductosService,
    private auth: AuthService,
    private cajaService: CajaService,
    private InventarioService: inventarioService,
    private ventasService: VentasService,
    private DetalleVenta: DetalleVenta,
    private ListarClientesService: listarClientesService,
    private joinDetalleVentaService: JoinDetalleVentaService,
    public formulario: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private toastr: ToastrService,
  ) {
    const lastInsertedId = this.auth.getUltimoIdInsertado();
    console.log("id",lastInsertedId);
    this.cajaService
      .consultarCaja(this.lastInsertedId)
      .subscribe((respuesta) => {
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
      });

    this.formularioCaja = this.formulario.group({
      // fechaApertura: [{ value: '', disabled: true }],
      fechaApertura: [""],
      fechaCierre: ["0000-00-00"],
      cantidadDineroAcumuladoTeoria: ["0"],
      cantidadDineroExistente: ["", Validators.required],
      Recepcionista_idRecepcionista: [1],
    });

    this.formularioDetalleVenta = this.formulario.group({
      productos: this.formulario.array([]),
    });

    this.productosArray = this.formularioDetalleVenta.get(
      "productos"
    ) as FormArray;
    //obtener id del cliente
    this.clienteService.data$.subscribe((data) => {
      console.log("Datos recibidos:", data);
      if (data && data.idCliente) {
        this.obtenerCliente(data.idCliente); // Obtener cliente usando el ID recibido
      }
    });
  }



  ngOnInit(): void {
    //paginator
    
    this.productoService.obternerProductos().subscribe((respuesta) => {
      this.productData = respuesta;
      this.dataSource = new MatTableDataSource(this.productData);
      this.dataSource.paginator = this.paginator;
      console.log("paginator",this.dataSource.paginator)
    });
    //ubicacion
    this.ubicacion = this.auth.getUbicacion();
    //datos de detalle venta
    this.DetalleVenta.obternerVentaDetalle().subscribe({next: (resultData) => {this.detalle = resultData;
      },
    });
   
    this.clienteService;

   //////////////////////////////////////////////////////777777777
   const lastInsertedId = this.auth.getUltimoIdInsertado();
   console.log("idddddddddd",lastInsertedId);
   this.cajaService.consultarCaja(lastInsertedId).subscribe(
     (resultados) => {
       //const fechaApertura =  resultados.fechaApertura;
       console.log("resultados",resultados[0].fechaCierre);
       console.log("resultados",resultados);
       const fechaCierre = resultados[0].fechaCierre;
       //this.mostrarOcultarBoton(fechaApertura);
       this.mostrarOcultarBoton(fechaCierre); // Llamada al método para mostrar u ocultar el botón
       console.log("botoooooon",this.mostrarOcultarBoton(fechaCierre));
     },
     (error) => {
       console.error('Error al consultar la fecha de cierre:', error);
     }
   );

  }

  obtenerDetallesCaja(idCaja: number | null) {
    this.joinDetalleVentaService.consultarProductosVentas(idCaja)
      .subscribe(
        (data) => {
          this.detallesCaja = data; // Asigna los detalles de la caja obtenidos del servicio a la variable del componente
          console.log('Detalles de la caja:', this.detallesCaja);
        },
        (error) => {
          console.error('Error al obtener detalles de la caja:', error);
        }
      );
  }

  obtenerCliente(idCliente: number) {
    this.ListarClientesService.consultarCliente(idCliente).subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          console.log("Datos del cliente:", data[0]);
          this.cliente = data[0]; // Asigna el primer elemento del array como cliente
        }
      }
    );
  }
/*********PARTE DEL DIALOGO *************/
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
  ///////////////////////////////////////////////////////////////
  /**metodo para filtrar la informacion que escribe el usaurio*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    // Verifica si el formulario es válido
    this.formularioCaja.get("fechaApertura")?.setValue(fechaConHoraPersonalizada);
  }

  mostrarOcultarBoton(fechaCierre: string) { 
    console.log("fechaCierre",fechaCierre);
    if (fechaCierre === '0000-00-00 00:00:00' ) {
      this.botonProductos = true;
    } else {
      this.botonProductos = false; 
    }
}

  mostrarCaja() {
    if (this.formularioCaja.valid) {
      this.cajaService
        .agregarCaja(this.formularioCaja.value)
        .subscribe((respuesta) => {
          if (respuesta.success === 1) {
            this.lastInsertedId = respuesta.lastInsertedId;
            console.log("ID insertado caja:", this.lastInsertedId);
            this.mostrarProductos = true;

            localStorage.setItem('lastInsertedId', this.lastInsertedId.toString());
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

  listInventarioData: any[] = [];
  

  enviarDatosYDetallesVenta() {
   console.log("total",this.totalAPagar <= this.dineroRecibido);
    if (this.totalAPagar <= this.dineroRecibido){
    const lastInsertedId = this.auth.getUltimoIdInsertado();
    console.log("id",lastInsertedId);
    const fechaActual = new Date();
    const fechaVenta = fechaActual.toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
    const idCliente = this.cliente?.ID_Cliente || null; // Acceder al ID del cliente seleccionado
    const totalAPagar = this.selectedProducts.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
    // Enviar datos de ventas
    const datosVentas = {
      Cliente_ID_Cliente: idCliente,
      Caja_idCaja: lastInsertedId, 
      fechaVenta: fechaVenta,
      total: totalAPagar,
    };
    console.log("datos a guardar - Ventas", datosVentas);
    this.ventasService.agregarVentas(datosVentas).subscribe((response) => {
      console.log("Datos de ventas guardados correctamente");
      
       const lastInsertedId3 = response.lastInsertedId3;
      console.log("lastInsertedId3", lastInsertedId3);
      // Enviar detalles de ventas
      const detallesVenta = this.selectedProducts.map((producto) => {
        return {
          Ventas_idVentas: lastInsertedId3,
          Producto_idProducto: producto.id,
          nombreProducto: producto.nombre,
          cantidadElegida: producto.cantidad,
          precioUnitario: producto.precio,
          Gimnasio_idGimnasio: this.auth.getIdGym(),
          importe: producto.cantidad*producto.precio
        };
      });
  
      console.log("cosas - Detalles de venta", detallesVenta);
      this.DetalleVenta.agregarVentaDetalle(detallesVenta).subscribe((response) => {
        console.log("Detalles de ventas guardados correctamente");
      });

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
  }else{
    this.toastr.error(
      'Ingresa el pago'
    );
  };
  }

// Luego, en una función para restablecer los valores
  resetearValores() {
    this.selectedProducts = [];
    this.totalAPagar = 0;
    this.cliente = {
      ID_Cliente: '',
      nombre: '',
      apPaterno: '',
      apMaterno: '',
      email: ''
    };
  }

  actualizarCaja() {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Agrega un 0 si el mes tiene un solo dígito
    const day = fechaActual.getDate().toString().padStart(2, "0"); // Agrega un 0 si el día tiene un solo dígito
    const hours = fechaActual.getHours().toString().padStart(2, "0"); // Agrega un 0 si la hora tiene un solo dígito
    const minutes = fechaActual.getMinutes().toString().padStart(2, "0"); // Agrega un 0 si los minutos tienen un solo dígito
    const seconds = fechaActual.getSeconds().toString().padStart(2, "0"); // Agrega un 0 si los segundos tienen un solo dígito
    const fechaConHoraPersonalizada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.formularioCaja.get("fechaCierre")?.setValue(fechaConHoraPersonalizada);
    console.log(this.formularioCaja.value);

    this.dialog.open(MensajeEliminarComponent, {
      data: `¿Deseas cerrar la caja?`,
    })

    .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const lastInsertedId = this.auth.getUltimoIdInsertado();
          console.log("id",lastInsertedId);
          this.cajaService.actualizarCaja(lastInsertedId, this.formularioCaja.value).subscribe((respuesta) => {
            console.log("si actualizo la caja");
            this.botonDeshabilitadoCorte = false;
            this.mostrarInputFlag = false;
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
    const lastInsertedId = this.auth.getUltimoIdInsertado();
    console.log("id",lastInsertedId);
    this.obtenerDetallesCaja(lastInsertedId);
    this.botonDeshabilitado = true;
    this.botonHabilitado = false;
  }

  imprimirResumen() {
    if (this.totalAPagar <= this.dineroRecibido){
    const totalCantidad = this.selectedProducts.reduce(
      (total, producto) => total + producto.cantidad,
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
    }}else{
      this.toastr.error(
        'Ingresa el pago'
      );

    }
  }
  
  imprimirResumenCorte() {
    this.totalAPagarCorte = this.detallesCaja.reduce(
      (total, detalle) => total + detalle.precioUnitario * detalle.cantidadElegida,
      0
    );
    const totalCantidad = this.detallesCaja.reduce(
      (total, detalle) => total + parseInt(detalle.cantidadElegida, 10),
      0
    );
    const totalEnPesos = this.convertirNumeroAPalabrasPesos(this.totalAPagarCorte);
   
      const cantidadDinero = this.formularioCaja.get('cantidadDineroExistente')?.value;
    
       
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
            <title>CORTE DE CAJA</title>
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
              <h1>CORTE DE CAJA</h1>
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
                  ${this.detallesCaja
                    .map(
                      (detalle) => `
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
                <p>Total en caja: $${this.totalAPagarCorte + cantidadDinero }  </p>
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

obtenerProducto(id: any, cantidadSolicitada: number): void {
  this.InventarioService.obtenerProductoPorId(id).subscribe(
    (data) => {
      this.producto = data; // Almacena el producto obtenido en la variable 'producto'
      console.log('Producto obtenido:', this.producto);
      console.log("aca", data[0].cantidadDisponible);
      if (data[0].cantidadDisponible < cantidadSolicitada) {
        console.error('No hay suficiente stock disponible para esta cantidad.');
        // Aquí puedes mostrar un mensaje de error o realizar alguna acción apropiada
        this.toastr.error(
          'No hay suficiente stock disponible para esta cantidad'
        );
      } else {
        // Aquí puedes realizar las operaciones necesarias con el producto obtenido
        
      }
    },
    (error) => {
      console.error('Error al obtener el producto:', error);
    }
  );
}
  /*** Metodo para ir agregando productos a la lista de productos seleccionados* @param producto*/
agregaraBalance(producto: Producto) {
    /*** el método busca si el producto que se está intentando agregar existe en la lista de productos seleccionados
     */
    const productoExistente = this.selectedProducts.find(
      (p) => p.id === producto.id
    );
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
      (total, p) => total + p.precio * p.cantidad, 0
    );

    this.cantidadSolicitada = producto.cantidad;
    console.log("productoExistente",producto.id);
    console.log("producto.cantidad",producto.cantidad);
    this.obtenerProducto(producto.id,producto.cantidad);
    // Reiniciar la cantidad del producto
    producto.cantidad = 0;
  }

 validaryUnir(producto: Producto){
  this.InventarioService.obtenerProductoPorId(producto.id).subscribe(
    (data) => {
      this.producto = data; // Almacena el producto obtenido en la variable 'producto'
      console.log('Producto obtenido:', this.producto);
      console.log("aca", data[0].cantidadDisponible);
      if (data[0].cantidadDisponible < producto.cantidad) {
        console.error('No hay suficiente stock disponible para esta cantidad.');
        // Aquí puedes mostrar un mensaje de error o realizar alguna acción apropiada
        this.toastr.error(
          'No hay suficiente stock disponible para esta cantidad'
        );
      } else {
        const productoExistente = this.selectedProducts.find(
          (p) => p.id === producto.id
        );
        // Aquí puedes realizar las operaciones necesarias con el producto obtenido
        if (productoExistente) {
          productoExistente.cantidad += producto.cantidad;
        } else {
          this.selectedProducts.push({ ...producto });
        }
        // Recalcular el total a pagar
        this.totalAPagar = this.selectedProducts.reduce(
          (total, p) => total + p.precio * p.cantidad, 0
        );

        this.cantidadSolicitada = producto.cantidad;
        console.log("productoExistente",producto.id);
        console.log("producto.cantidad",producto.cantidad);
        this.obtenerProducto(producto.id,producto.cantidad);
        // Reiniciar la cantidad del producto
        producto.cantidad = 0;
      }
    },
    (error) => {
      console.error('Error al obtener el producto:', error);
    }
  );

 }

}
