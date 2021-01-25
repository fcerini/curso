import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { GlobalService } from '../shared/global.service';
import { PedidoDetalle } from '../shared/pedido-detalle';
import { PedidoDetalleService } from '../shared/pedido-detalle.service';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';


@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetallesComponent implements OnInit {

  @Input() pediId!: number;

  seleccionado = new PedidoDetalle();

  columnas: string[] = ['detaId', 'prodDescripcion', 'detaCantidad', 'detaPrecio', 'acciones'];
  dataSource = new MatTableDataSource<PedidoDetalle>();


  form = new FormGroup({});
  mostrarFormulario = false;

  productos: Producto[] = [];

  detaIdNuevos = -1;


  constructor(public global: GlobalService,
    private pedidoDetalleService: PedidoDetalleService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      detaId: [''],
      detaPediId: [''],
      detaProdId: ['', Validators.required],
      detaCantidad: [''],
      detaPrecio: [''],
      detaBorrado: [''],
      detaFechaAlta: [''],
      prodDescripcion: ['']
    });

    this.pedidoDetalleService.get(`detaPediId=${this.pediId}`)
      .subscribe((pedidoDetalles) => {
        this.global.items = pedidoDetalles;
        this.actualizarTabla();
      }
      );

    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.global.items.filter(x => x.detaBorrado == false);
  }

  agregar() {

    this.detaIdNuevos--;
    this.seleccionado = new PedidoDetalle();
    this.seleccionado.detaId = this.detaIdNuevos;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(row: PedidoDetalle) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        row.detaBorrado = true;
        this.actualizarTabla();
      }
    });
  }

  edit(seleccionado: PedidoDetalle) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);
    /* si el form tiene menos campos que el objeto seleccionado...
        this.form.setValue({
          detaProdId: seleccionado.detaProdId,
          detaCantidad: seleccionado.detaCantidad,
          detaPrecio: seleccionado.detaPrecio
        });
    */
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    // si el formulario es diferente asignar uno por uno...
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;

    // actualizo descripcion para que se vea en la grilla
    this.seleccionado.prodDescripcion = this.productos.find(c => c.prodId == this.seleccionado.detaProdId)!.prodDescripcion;

    // para que sea mas facil, lo borro y agrego de nuevo
    this.global.items = this.global.items.filter(x => x.detaId != this.seleccionado.detaId);
    this.global.items.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();

  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}