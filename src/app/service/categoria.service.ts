import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { proveedor } from '../modules/admin/components/models/proveedor';
import { Categorias } from '../modules/admin/components/models/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  //API: string = 'https://olympus.arvispace.com/conPrincipal/categoria.php';
  API: string = 'http://localhost/plan/categoria.php'

  constructor(private clienteHttp:HttpClient) {
  }

  agregarCategoria(datosCategoria:proveedor):Observable<any>{
    return this.clienteHttp.post(this.API+"?insertar=1",datosCategoria);
  }

  obternerCategoria(){
    return this.clienteHttp.get(this.API)
  }

  obternerCategorias(): Observable<Categorias[]>{
    return this.clienteHttp.get<Categorias[]>(this.API)
  }

  consultarCategoria(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }
  

  borrarCategoria(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+id)
  }

  actualizarCategoria(id:any,datosCategoria:any):Observable<any>{
    return this.clienteHttp.post(this.API+"?actualizar="+id,datosCategoria);
  }  

  updateMembresiaStatus(id: number, estado: { estatus: number }): Observable<any> {
    console.log("status",estado,"id",id);
    return this.clienteHttp.post(this.API+"?actualizarEstatus="+id,estado);;
  }

  consultarCategoriaGym(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultarGym="+id);
  }

  consultarListaCategoria(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultarCategoriaId="+id);
    
  }

}
