import { Component } from '@angular/core';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-lista-proveedor',
  templateUrl: './lista-proveedor.component.html',
  styleUrls: ['./lista-proveedor.component.css']
})
export class ListaProveedorComponent {
  public proveedores: any;
  public page: number = 0;
  public search: string = '';
  constructor(private proveedorService: ProveedorService){}

  ngOnInit():void{
    this.proveedorService.obternerProveedor().subscribe({
      next: (resultData) => {
        console.log(resultData);
        this.proveedores = resultData;
      }
    }); 
  }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if ( this.page > 0 )
      this.page -= 5;
  }

  onSearchPokemon( search: string ) {
    this.page = 0;
    this.search = search.toLowerCase();
  }
}

 


