import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; //para el menu de navegacion
/**
 * es un componente utilizado para envolver varios componentes de Angular Material y aplicar
 * estilos de campo de texto comunes como el subrayado, la etiqueta flotante y los mensajes de sugerencia.
 */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    MatToolbarModule, //menu navegacion
    MatFormFieldModule,//para campos de formulario
    MatTableModule,//para tablas
    MatPaginatorModule,//paginacion de tabla
    MatInputModule,//input box de material
    MatIconModule//iconos
  ],
})
export class RecepMaterialModule {}
