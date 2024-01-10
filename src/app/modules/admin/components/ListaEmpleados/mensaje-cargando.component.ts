import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductosService } from "src/app/service/productos.service";
import { listarClientesService } from "src/app/service/listarClientes.service";
import { DetalleVenta } from "src/app/service/detalleVenta.service";
import { ClienteService } from 'src/app/service/cliente.service';

interface Cliente {
  ID_Cliente: number;
  nombre: string;
 apPaterno: string;
  apMaterno: string;
}

@Component({
  selector: 'app-mensaje-cargando',
  templateUrl: './mensaje-cargando.component.html',
  styleUrls: ['./mensaje-cargando.component.css']
})
export class MensajeListaComponent implements OnInit {
  detalle: any;
  constructor(
    public dialogo: MatDialogRef<MensajeListaComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string,
    private productoService: ProductosService,
    private ListarClientesService:listarClientesService,
    private DetalleVenta: DetalleVenta,
    private clienteService: ClienteService,
  ) {}

  ngOnInit(): void {

    this.DetalleVenta.obternerVentaDetalle().subscribe({
      next: (resultData) => {
        console.log(resultData);
        this.detalle= resultData;
      }
    }) 

    //this.obtenerClientesLista();
  }

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  selectedClient: number | null = null;


 obtenerClientesLista() {
    this.clienteService.obtenerUsuariosPorId(1).subscribe(
      (data: any) => {
        this.clientes = data as Cliente[];
        console.log("this.clientes",this.clientes); // Asigna datos si coinciden con la estructura de Cliente[]
        this.clientesFiltrados = this.clientes.slice(); // Inicializa la lista filtrada con la lista completa
      },
      (error: any) => {
        // Manejo de errores si es necesario
      }
    );
  }
  
  

  filtrarClientes(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Filtra los clientes basándote en el valor de búsqueda
    if (searchValue) {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apPaterno} ${cliente.apMaterno}`.toLowerCase().includes(searchValue)
      );
    } else {
      // Si no hay valor de búsqueda, muestra todos los clientes
      this.clientesFiltrados = this.clientes;
    }
  }

  seleccionarCliente(idCliente: number) {
    // Aquí puedes implementar la lógica para manejar la selección del cliente
    this.selectedClient = idCliente;
    console.log('ID del cliente seleccionado:', idCliente);

    // O cualquier otra lógica que necesites hacer al seleccionar un cliente
  }
  // ... Importaciones y código previo

  enviarDatosAlOtroComponente() {
    const dataToSend = {  idCliente: this.selectedClient };
    this.clienteService.sendData(dataToSend);
    this.dialogo.close();
  }


}
