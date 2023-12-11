import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroNombreProducto'
})
export class FiltroNombreProductoPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item =>
      item.nombreProducto.toLowerCase().includes(searchTerm)
    );
  }
}
