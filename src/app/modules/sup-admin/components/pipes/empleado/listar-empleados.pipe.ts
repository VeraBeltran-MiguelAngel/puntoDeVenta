import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarEmpleados'
})
export class ListarEmpleadosPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
