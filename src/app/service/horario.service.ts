import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { horario } from '../modules/admin/components/models/horario';

@Injectable({
  providedIn: 'root'
})
export class horarioService {
  APIHorario: string = 'https://olympus.arvispace.com/conPrincipal/horario.php' // Cambia la URL a la de tu servicio PHP
  constructor(private clienteHttp:HttpClient) {
  }

  obternerHorario(){
    return this.clienteHttp.get(this.APIHorario);
  }

  // Angular service method
  agregarHorario(datosHorario: horario):Observable<any>{
    console.log("si")
    return this.clienteHttp.post(this.APIHorario+"?insertar=1", datosHorario);
  }

 // Cambia el servicio para que el observable emita un arreglo de Horario

 actualizarHorario(id: any, datosPlan: any): Observable<any> {
  console.log("aca si llega");
  return this.clienteHttp.post(`${this.APIHorario}?actualizar=${id}`, datosPlan, { headers: { 'Content-Type': 'application/json' }, responseType: 'text' });
}


  consultarHorario(id:any):Observable<any>{
    return this.clienteHttp.get(this.APIHorario+"?consultar="+id);
  }

  borrarHorario(id:any):Observable<any>{
    console.log("si entro aca") 
    return this.clienteHttp.get(this.APIHorario+"?borrar="+id)
    //this.message = "¡Error al eliminar!, Restricción en la base de datos";
  }
}
