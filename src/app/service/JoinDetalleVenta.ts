import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoinDetalleVentaService {
  API: string = 'https://localhost/plan/JoinDetalleVenta.php'
  constructor(private clienteHttp:HttpClient) {
  }

  consultarProductosVentas(idCaja: number | null):Observable<any[]>{
    const url = `${this.API}?idCaja=${idCaja}`;
    return this.clienteHttp.get<any[]>(url);
  }
}
