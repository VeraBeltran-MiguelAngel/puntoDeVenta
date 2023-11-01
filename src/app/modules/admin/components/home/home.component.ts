import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

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

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    //para activar el debug en consola
    // debugger;
      //convertimos la cadena en arreglo y lo guardamos en usuarioRegistrado
      this.usuarioRegistrado = this.auth.getUserData();
      //accedemos al indice 0 (por que solo es un registro) al indice email
      this.correo = this.usuarioRegistrado[0].email;
      this.rol=this.usuarioRegistrado[0].rol;
    
  }
}
