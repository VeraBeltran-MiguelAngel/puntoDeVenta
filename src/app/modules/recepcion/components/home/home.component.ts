import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../models/producto';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedProducts: Producto[] = []; //lista de productos seleccionados
  totalAPagar: number = 0;
  dineroRecibido: number = 0;

  //titulos de columnas de la tabla
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
  productData: Producto[] = [];

  dataSource: any;

  constructor(private productoService: ProductosService) {}

  ngOnInit(): void {
    this.productoService.obternerProductos().subscribe((respuesta) => {
      // console.log(respuesta);
      this.productData = respuesta;
      this.dataSource = new MatTableDataSource(this.productData);
    });
  }

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

  imprimirResumen() {
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.open();
      ventanaImpresion.document.write(`
      <html>
      <head>
        <title>Lista de Artículos</title>
      </head>
      <body>
        <h1>Ticket</h1>
        <ul>
          ${this.selectedProducts
            .map(
              (producto) => `
            <li>${producto.nombre} x ${producto.cantidad} - $${
                producto.precio * producto.cantidad
              }</li>
          `
            )
            .join('')}
        </ul>
      </body>
      </html>
    `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
      ventanaImpresion.close();
    }
  }
}
