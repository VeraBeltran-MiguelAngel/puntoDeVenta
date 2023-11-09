import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  // API: string = 'https://apimocha.com/productosgym/listar'
  // API: string = 'http://localhost/productos/productos.php'
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/productos.php/';
  constructor(private clienteHttp: HttpClient) {}

  /**
   * este metodo se utiliza para mostrar los productos a la venta (incluye la columna cantidad que solo es de apoyo)
   * @returns
   */
  obternerProductos(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(this.API+ '?listaProductosRecepcion');
  }
  
  /**
   * Metodo pra listar los productos del admin
   */
  getProductosAdmin():Observable<any>{
    return this.clienteHttp.get(this.API+ '?listaProductosRecepcion');
  }
}
