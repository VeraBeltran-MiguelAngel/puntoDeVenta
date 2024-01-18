import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // API: string = 'http://localhost/uploadFiles/creaProductoV3.php';
  API: string =
    'https://olympus.arvispace.com/panelAdmin/conf/creaProductoV3.php';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  creaProducto(datosFormulario: any): Observable<any> {
    return this.clienteHttp.post(this.API + '?creaProducto', datosFormulario, {
      headers: this.httpHeaders,
    });
  }

  /**
   * Este metodo comprueba si se estan enviando imagenes al back
   * @param imagenes
   * @returns
   */
  subirImagenes(imagenes: File[]): Observable<any> {
    const formData: FormData = new FormData();
    // !es muy importante que el nombre tenga llaves files[] , de lo contrario php no lo reconoce
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('files[]', imagenes[i]);
    }

    // Imprime el contenido de formData en la consola
    console.log('Datos de las imagenes tipo formData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.clienteHttp.post(this.API + '?subirImagenes', formData);
  }
}
