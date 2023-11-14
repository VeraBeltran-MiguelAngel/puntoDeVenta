import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';
import { ListaProductos } from '../modules/admin/components/models/listaProductos';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  // API: string = 'https://apimocha.com/productosgym/listar'
  // API: string = 'http://localhost/login/productos.php/';
  API: string =
    'https://olympus.arvispace.com/puntoDeVenta/conf/productosv2.php/';
  constructor(private clienteHttp: HttpClient, private auth: AuthService) {}

  /**
   * este metodo se utiliza para mostrar los productos a la venta (incluye la columna cantidad que solo es de apoyo)
   * @returns
   */
  obternerProductos(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(
      this.API + '?listaProductosRecepcion'
    );
  }

  /**
   * Metodo pra listar los productos del admin
   */
  getProductosAdmin(): Observable<ListaProductos[]> {
    return this.clienteHttp
      .get<ListaProductos[]>(this.API + '?listaProductosAdmin')
      .pipe(
        map(
          (respuesta) => {
            let varArrayProductos = respuesta as ListaProductos[];
            return varArrayProductos.map((respuesta: ListaProductos) => {
              respuesta.estatus =
                respuesta.estatus === '1' ? 'Activado' : 'Desactivado';
              return respuesta;
            });
          }

          // respuesta.map((response) => ({
          //   ...response,
          //   estatus: response.estatus === '1' ? 'Activado' : 'Desactivado',
          // }))
        )
      );
  }
}
