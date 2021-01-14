import { Component, OnInit } from '@angular/core';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos : Producto[] = [];
  constructor( private productoService: ProductoService ) { }

  ngOnInit(): void {

    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
        console.log(productos);
      } 
    )
  }

}
