import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroFecha'
})
export class FiltroFechaPipe implements PipeTransform {
  transform(items: any[], fechaInicio: Date, fechaFin: Date): any[] {
    if (!items || !fechaInicio || !fechaFin) {
      return items;
    }

    return items.filter(item => {
      const fechaItem = new Date(item.fecha.replace(/-/g, '/')); // Ajusta esto según la propiedad de fecha en tus datos
      return fechaItem >= fechaInicio && fechaItem <= fechaFin;
    });
  }
}
