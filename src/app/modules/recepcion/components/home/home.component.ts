import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedProducts: Producto[] = []; //lista de productos seleccionados
  totalAPagar: number = 0;

  displayedColumns: string[] = [
    'id',
    'categoria',
    'nombre',
    'tamaño',
    'descripcion',
    'precio',
    'cantidad',
    'acciones',
  ];
  productData: Producto[] = [
    {
      id: 1,
      categoria: 'Bebidas',
      nombre: 'Agua ciel',
      tamaño: '500 ml',
      descripcion: 'agua simple',
      precio: 9.5,
      cantidad: 0,
    },
    {
      id: 2,
      categoria: 'Bebidas',
      nombre: 'Agua bonafont',
      tamaño: '250 ml',
      descripcion: 'agua simple',
      precio: 5.8,
      cantidad: 0,
    },
    {
      id: 3,
      categoria: 'Bebidas',
      nombre: 'Gatorade',
      tamaño: '500 ml',
      descripcion: 'bebida deportiva',
      precio: 20.5,
      cantidad: 0,
    },
    {
      id: 4,
      categoria: 'Suplementos',
      nombre: 'Proteina marca tal',
      tamaño: '500 gr',
      descripcion: '30 scopes',
      precio: 250.5,
      cantidad: 0,
    },
    {
      id: 5,
      categoria: 'Suplementos',
      nombre: 'Creatina marca tal',
      tamaño: '500 gr',
      descripcion: '30 scopes',
      precio: 200.8,
      cantidad: 0,
    },
  ];
  dataSource = new MatTableDataSource(this.productData);

  ngOnInit(): void {}

  /**
   * metodo para filtrar la informacion que escribe el usaurio
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Metodo para ir agregando productos a la lista de productos seleccionados
   * @param producto 
   */
  agregaraBalance(producto: Producto) {
    /**
     * el método busca si el producto que se está intentando agregar
     * existe en la lista de productos seleccionados (
     */
    const productoExistente = this.selectedProducts.find(
      (p) => p.id === producto.id
    );

    /**
     * Si se encuentra un producto existente con el mismo id, significa que el producto ya ha sido agregado 
     * al carrito. En este caso, el código aumenta la cantidad del producto existente en la lista selectedProducts
     *  al agregar la cantidad del nuevo producto (producto.cantidad) a la cantidad existente del producto.
     */
    if (productoExistente) {
      productoExistente.cantidad += producto.cantidad;
    } else {
      this.selectedProducts.push({ ...producto });
    }

    // Recalcular el total a pagar
    this.totalAPagar = this.selectedProducts.reduce(
      (total, p) => total + p.precio * p.cantidad,
      0
    );

    // Reiniciar la cantidad del producto
    producto.cantidad = 0;
  }
}
