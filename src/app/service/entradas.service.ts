import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntradaProducto } from '../modules/admin/components/models/entradas';

@Injectable({
  providedIn: 'root',
})
export class EntradasService {
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/entradas.php';
  constructor(private clienteHttp: HttpClient) {}

  /**
   * Metodo para insertar una entrada de producto
   * @param datosEntradaProducto datos del modelo
   * @returns un observable de tipo any
   */
  agregarEntradaProducto(
    datosEntradaProducto: EntradaProducto
  ): Observable<any> {
    return this.clienteHttp.post(
      this.API + '?resgistraEntrada',
      datosEntradaProducto
    );
  }
}
