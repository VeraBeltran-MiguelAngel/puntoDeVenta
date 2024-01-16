import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarProducto'
})
export class ListarProductoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
