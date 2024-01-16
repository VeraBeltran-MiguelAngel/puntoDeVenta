import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarProveedor'
})
export class ListarProveedorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
