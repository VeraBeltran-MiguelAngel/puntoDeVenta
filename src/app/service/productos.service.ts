import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';
import { ListaProductos } from '../modules/admin/components/models/listaProductos';
import { AuthService } from './auth.service';
import { Inventario } from '../modules/admin/components/models/inventario';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  //nos ayudara a compartir la lista de productos de la tabla emergente a otros componentes
  private productosSeleccionados = new BehaviorSubject<Producto[]>([]);
  
  // API: string = 'https://apimocha.com/productosgym/listar'
  API: string ='http://localhost/plan/productosv2.php/';
 //API: string ='https://olympus.arvispace.com/puntoDeVenta/conf/productosv2.php/';
 API2: string =  'https://olympus.arvispace.com/panelAdmin/conf/joinDetalleProducto.php';

  constructor(private clienteHttp: HttpClient, private auth: AuthService) {}

  /**
   * este metodo se utiliza para mostrar los productos a la venta (incluye la columna cantidad que solo es de apoyo)
   * para el recepcionista
   * @returns
   */
  obternerProductos(id:any): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(
      this.API + '?listaProductosRecepcion'+id
    );
  }

  actualizarProducto(id: any, datosP: any): Observable<any> {
    const url = `${this.API}?actualizar=${id}`;
    return this.clienteHttp.post(url, datosP);
  }

  /**
   * Metodo pra listar los productos de la franquicia para  el admin
   */
 /* getProductosAdmin(): Observable<ListaProductos[]> {
    return this.clienteHttp
      .get<ListaProductos[]>(this.API + '?listaProductosAdmin')
      .pipe(
        map(
          (respuesta) => {
            let varArrayProductos = respuesta as ListaProductos[];
            return varArrayProductos.map((respuesta: ListaProductos) => {
              respuesta.estatus =
                respuesta.estatus == '1' ? 'Activado' : 'Desactivado';
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

  /**
   * Metodo para listar los productos del inventario dependiendo de la sucursal
   * @returns
   */

  getProductosAdmin(): Observable<ListaProductos[]> {
    return this.clienteHttp.get<ListaProductos[]>(this.API + '?listaProductosAdmin');
  }

  consultarProductoId(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?listaProductoGym="+id);
  }

  obternerInventario(): Observable<Inventario[]> {
    return this.clienteHttp.get<Inventario[]>(this.API + '?listaInventario');
  }

  inventarioGlobal(): Observable<any> {
    return this.clienteHttp.get(this.API + '?inventarioGlobal');
  }


  getProductosSeleccionados() {
    return this.productosSeleccionados.asObservable();
  }

  setProductosSeleccionados(productos: Producto[]) {
     // Crear una copia de la lista
    this.productosSeleccionados.next([...productos]);
  }

  clearProductosSeleccionados() {
    this.productosSeleccionados.next([]);
  }

  /*borrarProductoInventario(inventarioID:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+inventarioID)
  }*/

  borrarProductoInventario(idInv: any, usuaId: any): Observable<any>{
    const params = new HttpParams().set('invenID',idInv).set('userID',usuaId);
    return this.clienteHttp.get(this.API, {params});
  }
  consultarProductosJ(idProducto: number | null): Observable<any[]> {
    const url = `${this.API2}?idProducto=${idProducto}`;
    return this.clienteHttp.get<any[]>(url);
  }

  updateProductoStatus(id: number, estado: { estatus: number }): Observable<any> {
    console.log("status",estado,"id",id);
    return this.clienteHttp.post(this.API+"?actualizarEstatus="+id,estado);;
  }

}
