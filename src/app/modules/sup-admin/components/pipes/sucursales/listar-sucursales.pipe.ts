import { Pipe, PipeTransform } from '@angular/core';
import { gimnasio } from 'src/app/modules/sup-admin/components/models/gimnasio';

@Pipe({
  name: 'listarSucursales'
})
export class ListarSucursalesPipe implements PipeTransform {

  transform(sucursales: gimnasio[],page: number = 0, search: string = ''): gimnasio[] {

    if ( search.length === 0 )
    return sucursales.slice(page, page + 5);
  
  const filteredPokemons = sucursales.filter( gimnasio => gimnasio.nombreGym.toLowerCase().includes( search ) );
  return filteredPokemons.slice(page, page + 5);
  }

}
