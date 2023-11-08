import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorias } from '../modules/recepcion/components/models/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  API: string = 'http://localhost/productos/categorias.php'
  // API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/categorias.php'
  constructor(private clienteHttp:HttpClient) {
  }

  obternerCategorias(): Observable<Categorias[]>{
    return this.clienteHttp.get<Categorias[]>(this.API)
  }
}
