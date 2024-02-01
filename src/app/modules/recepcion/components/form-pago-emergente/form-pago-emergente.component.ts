import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PagoMembresiaEfectivoService } from 'src/app/service/pago-membresia-efectivo.service'
import { MensajeEmergenteComponent } from '../mensaje-emergente/mensaje-emergente.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-pago-emergente',
  templateUrl: './form-pago-emergente.component.html',
  styleUrls: ['./form-pago-emergente.component.css']
})
export class FormPagoEmergenteComponent implements OnInit{

  idSucursal: number;
  membresias: any[] = [];
  membresiaSeleccionada: any;
  idMembresiaSelec: any;
  precio: any;
  duracion: any;
  moneyRecibido: number; // =0
  @Output() actualizarTablas = new EventEmitter<boolean>();
  constructor(private toastr: ToastrService, public dialog: MatDialog, private membresiaService: PagoMembresiaEfectivoService, public dialogo: MatDialogRef<FormPagoEmergenteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

    
  ngOnInit(): void {
    // Llamar al servicio para obtener la lista de membresías
    this.precio = this.data.precio;
    this.duracion = this.data.duracion + ' ' + 'días';
    //console.log('el detalle membresia del cliente es: ', this.data.detMemID )
    if(this.data.action == 'Online' ){
      this.idMembresiaSelec = this.data.idMem;
      console.log('membresia seleccionada: ', this.idMembresiaSelec);
    }
    //console.log('membresia seleccionada2: ', this.membresiaSeleccionada);

    //console.log('ID del cliente:', this.data.idCliente);

    this.getMembresiasLista(this.data.idSucursal);
    console.log('ID de la sucursal:', this.data.idSucursal);
  }

  getMembresiasLista(idgimnasio: number): void {
    this.membresiaService.membresiasLista(idgimnasio)
      .subscribe(data => {
        this.membresias = data;
        console.log(this.membresias);
      }, error => {
        console.error('Error al obtener la lista de membresías:', error);
      });
  }

  onMembresiaChange(): void {
    this.membresiaService.membresiasInfo(this.membresiaSeleccionada).subscribe((resultado)=> {
      console.log('Membresía seleccionada:', this.membresiaSeleccionada);
      this.duracion = `${resultado.Duracion} días`;
      this.precio = `${resultado.Precio}`;
    });
  }

  cancelDialogo(): void {
    this.dialogo.close(true);
    }
  
    successDialog(): void {
      if(this.membresiaSeleccionada != undefined){
        if(this.moneyRecibido >= this.precio){
          const PrecioCalcular = this.moneyRecibido - this.precio ;
          console.log(PrecioCalcular);
        
          this.membresiaService.actualizacionMemebresia(this.data.idCliente, this.membresiaSeleccionada, this.data.detMemID).subscribe((dataResponse: any)=> {
          console.log(dataResponse.msg)
  
          this.actualizarTablas.emit(true);
          
          this.dialogo.close(true);
          
          this.dialog.open(MensajeEmergenteComponent, {
            data: `Pago exitoso, el cambio es de: $${PrecioCalcular}`,
          })
          .afterClosed()
          .subscribe((cerrarDialogo: Boolean) => {
            if (cerrarDialogo) {
  
            } else {
  
            }
          });
        });
      
        }else{
          this.toastr.error('No alcanza para pagar esta membresia', 'Error!!!');
        }
      } else if (this.idMembresiaSelec != undefined && this.membresiaSeleccionada == undefined){
        this.membresiaSeleccionada = this.idMembresiaSelec;
        console.log(this.membresiaSeleccionada );
        if(this.moneyRecibido >= this.precio){
          const PrecioCalcular = this.moneyRecibido - this.precio ;
          console.log(PrecioCalcular);
        
          this.membresiaService.actualizacionMemebresia(this.data.idCliente, this.membresiaSeleccionada, this.data.detMemID).subscribe((dataResponse: any)=> {
          console.log(dataResponse.msg)
  
          this.actualizarTablas.emit(true);
          
          this.dialogo.close(true);
          
          this.dialog.open(MensajeEmergenteComponent, {
            data: `Pago exitoso, el cambio es de: $${PrecioCalcular}`,
          })
          .afterClosed()
          .subscribe((cerrarDialogo: Boolean) => {
            if (cerrarDialogo) {
  
            } else {
  
            }
          });
        });
      
        }else{
          this.toastr.error('No alcanza para pagar esta membresia', 'Error!!!');
        }
      }
      else {
        this.toastr.warning('Selecciona una membresía', 'Alerta!!!');
      }
    }
}
