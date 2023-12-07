import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transferencia } from '../modules/recepcion/components/models/transferencia';
import { Observable } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';

@Injectable({
  providedIn: 'root',
})
export class TransferirProductoService {
  API: string = 'http://localhost/productos/transferirProductos.php';
  // API :string ='https://olympus.arvispace.com/puntoDeVenta/conf/transferirProductos.php';

  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  /**
   * Metodo para enviar los productos
   * @param transferencia  valores para tabla transferencia (formulario)
   * @param productosParaTransferir  arreglo de productos para la tabla detalle
   * @returns
   */
  transferirProductos(
    transferencia: Transferencia,
    productosParaTransferir: Producto[]
  ): Observable<any> {
    return this.clienteHttp.post(
      this.API + '?transferirPro',
      { transferencia, productosParaTransferir },
      {
        headers: this.httpHeaders,
      }
    );
  }


  verTransferencias(): Observable<any> {
    return this.clienteHttp.get(this.API + '?transferenciasSinValidar');
  }
}
