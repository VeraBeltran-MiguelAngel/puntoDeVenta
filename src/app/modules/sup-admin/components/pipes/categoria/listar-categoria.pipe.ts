import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarCategoria'
})
export class ListarCategoriaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
