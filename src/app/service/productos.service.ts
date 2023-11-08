import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modules/recepcion/components/models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // API: string = 'https://apimocha.com/productosgym/listar'
  // API: string = 'http://localhost/productos/productos.php'
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/productos.php'
  constructor(private clienteHttp:HttpClient) {
  }

  obternerProductos(): Observable<Producto[]>{
    return this.clienteHttp.get<Producto[]>(this.API)
  }
}
