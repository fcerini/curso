import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  items: Producto[] = [];
  seleccionado = new Producto();

  form = new FormGroup({});

  mostrarFormulario = false;
  constructor(private productoService: ProductoService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      prodId: [''],
      prodDescripcion: ['', Validators.required],
      prodPrecio: ['', Validators.required],
      prodBorrado: [''],
      prodFechaAlta: ['']
    });

    this.productoService.get().subscribe(
      (productos) => {
        this.items = productos;
        console.log(productos);
      }
    )
  }
  agregar() {
    this.form.reset();
    this.seleccionado = new Producto();
    this.mostrarFormulario = true;
  }

  delete(row: Producto) {
    this.productoService.delete(row.prodId)
      .subscribe(() => {
        this.items = this.items.filter((x) => {
          if (x.prodId != row.prodId) {
            return true
          } else {
            return false
          }
        });
      });
  }

  edit(seleccionado: Producto) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    // si el formulario es diferente asignar uno por uno...
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;


    if (this.seleccionado.prodId) {
      this.productoService.put(this.seleccionado)
        .subscribe((producto) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.productoService.post(this.seleccionado)
        .subscribe((producto) => {
          this.items.push(producto);
          this.mostrarFormulario = false;
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }

}
