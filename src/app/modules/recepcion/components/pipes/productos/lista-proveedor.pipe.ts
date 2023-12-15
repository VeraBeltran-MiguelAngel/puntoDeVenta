import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../../models/producto';

@Pipe({
  name: 'listarProductos'
})
export class ListarProductosPipe implements PipeTransform {

  transform(producto: Producto[] | undefined, page: number = 0, search: string = ''): Producto[] {
    if (!producto) {
      return [];
    }
  

    if (search.length === 0) {
      return producto.slice(page, page + 5);
    }

  
  const filteredPokemons = producto.filter( Producto => Producto.codigo_de_barra.toLowerCase().includes( search.toLowerCase()) );
  return filteredPokemons.slice(page, page + 5);
  }

}
