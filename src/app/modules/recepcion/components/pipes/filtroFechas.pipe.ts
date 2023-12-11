import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDate'
})
export class FilterByDatePipe implements PipeTransform {
  transform(items: any[], fechaFiltro: Date): any[] {
    if (!items || !fechaFiltro) {
      return items;
    }

    return items.filter(item => {
      // Filtrar por fecha comparando solo el año, mes y día
      return item.date.toDateString() === fechaFiltro.toDateString();
    });
  }
}
