import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; //para el menu de navegacion
/**
 * es un componente utilizado para envolver varios componentes de Angular Material y aplicar
 * estilos de campo de texto comunes como el subrayado, la etiqueta flotante y los mensajes de sugerencia.
 */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatToolbarModule, //menu navegacion
    MatFormFieldModule,//para campos de formulario
    MatTableModule,//para tablas
    MatTabsModule, // tabs de material (pestañas)
    MatDialogModule, //dialogos emergentes
    MatPaginatorModule,//paginacion de tabla
    MatInputModule,//input box de material
    MatIconModule,//iconos
    MatSelectModule //listas desplegables
  ],
})
export class RecepMaterialModule {}
