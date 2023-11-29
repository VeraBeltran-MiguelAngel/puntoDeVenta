import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedores } from '../modules/admin/components/models/proveedores';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  // API: string = 'http://localhost/productos/categorias.php';
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/proveedores.php'

  constructor(private clienteHttp: HttpClient) {}

  /**
   * Metodo para poblar la tabla global de proveedores
   * @returns 
   */
  obtenerProveedores(): Observable<Proveedores[]> {
    return this.clienteHttp.get<Proveedores[]>(this.API);
  }

  /**
   * Metodo usado para poblar el mat select
   * @returns 
   */
  listaProveedores():Observable<any>{
    return this.clienteHttp.get(this.API);
  }
}
