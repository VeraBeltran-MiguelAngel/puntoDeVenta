import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarSucursales'
})
export class ListarSucursalesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
