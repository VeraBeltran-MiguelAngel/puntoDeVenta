import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; //para el menu de navegacion
/**
 * es un componente utilizado para envolver varios componentes de Angular Material y aplicar
 * estilos de campo de texto comunes como el subrayado, la etiqueta flotante y los mensajes de sugerencia.
 */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  exports: [
    MatToolbarModule, //menu navegacion
    MatFormFieldModule,
    MatTableModule,
    MatInputModule
  ],
})
export class RecepMaterialModule {}
