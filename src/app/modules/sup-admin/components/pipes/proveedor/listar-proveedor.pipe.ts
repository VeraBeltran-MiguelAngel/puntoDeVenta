import { Pipe, PipeTransform } from '@angular/core';
import { proveedor } from 'src/app/modules/sup-admin/components/models/proveedor';
@Pipe({
  name: 'listarProveedor'
})
export class ListaProveedorPipe implements PipeTransform {

  transform(proveedores: proveedor[] | undefined, page: number = 0, search: string = ''): proveedor[] {
    if (!proveedores) {
      return [];
    }

    if (search.length === 0) {
      return proveedores.slice(page, page + 5);
    }

    const formattedSearch = search.toLowerCase();
    const filteredProveedores = proveedores.filter(proveedor =>
      `${proveedor.nombre} ${proveedor.apPaterno} ${proveedor.apMaterno}`
        .toLowerCase()
        .includes(formattedSearch)
    );

    return filteredProveedores.slice(page, page + 5);
  }
}

