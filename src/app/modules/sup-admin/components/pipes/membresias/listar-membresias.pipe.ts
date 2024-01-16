import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarMembresias'
})
export class ListarMembresiasPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
