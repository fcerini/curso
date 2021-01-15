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
  editando = false;
  constructor( private productoService: ProductoService ) { }

  ngOnInit(): void {

    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
        console.log(productos);
      } 
    )
  }

  delete( row : Producto){
  }

  edit( row : Producto){
    this.editando = true;
  }

  aceptar(){
    this.editando = false;
  }
  cancelar(){
    this.editando = false;
  }

}
