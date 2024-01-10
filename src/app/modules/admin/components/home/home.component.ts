import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ListProductVendidosService } from 'src/app/service/list-product-vendidos.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //para poder usar los valores del local(solo es un string) storage tienes que crear un arreglo
  usuarioRegistrado: any[] = [];
  correo: string;
  rol: string;
  ubicacion :string;
  topProductos: any;
  mesActual: string;
  anioActual: number;

  constructor(private auth: AuthService, private listProd: ListProductVendidosService) {}

  ngOnInit(): void {
    //para activar el debug en consola
    // debugger;
      //convertimos la cadena en arreglo y lo guardamos en usuarioRegistrado
      this.usuarioRegistrado = this.auth.getUserData();
      //accedemos al indice 0 (por que solo es un registro) al indice email
      this.correo = this.usuarioRegistrado[0].email;
      this.rol=this.auth.getRol();
      this.ubicacion=this.auth.getUbicacion();
    
      

      //Obtengo el top 5 de productos vendidos en el mes y año actual
      this.listProd.topVentasMes().subscribe((respuesta) => {
        console.log(respuesta);
        this.topProductos = respuesta;
      });

      //Obtengo el mes y año actual
      const fechaActual = new Date();

      // Obtener el nombre del mes
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      this.mesActual = meses[fechaActual.getMonth()];

      // Obtener el año
      this.anioActual = fechaActual.getFullYear();
  }
}
