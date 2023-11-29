import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transferencia } from '../modules/recepcion/components/models/transferencia';
import { Observable } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';

@Injectable({
  providedIn: 'root',
})
export class TransferirProductoService {
  API: string = 'http://localhost/productos/transferirProductos.php/';

  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  transferirProductos(
    transferencia: Transferencia,
    productosParaTransferir: Producto
  ): Observable<any> {
    return this.clienteHttp.post(
      this.API + '?transferirPro',
      { transferencia, productosParaTransferir },
      {
        headers: this.httpHeaders,
      }
    );
  }
}
