import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
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

  items: PedidoDetalle[] = [];
  seleccionado = new PedidoDetalle();

  columnas: string[] = ['prodDescripcion', 'detaCantidad', 'detaPrecio', 'acciones'];
  dataSource = new MatTableDataSource<PedidoDetalle>();


  form = new FormGroup({});
  mostrarFormulario = false;

  productos: Producto[] = [];
  

  constructor(private pedidoDetalleService: PedidoDetalleService,
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

    this.pedidoDetalleService.get(this.pediId).subscribe(
      (pedidoDetalles) => {
        this.items = pedidoDetalles;
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
    this.dataSource.data = this.items;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new PedidoDetalle();
    this.mostrarFormulario = true;
  }

  delete(row: PedidoDetalle) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.pedidoDetalleService.delete(row.detaId)
          .subscribe(() => {

            this.items = this.items.filter(x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  edit(seleccionado: PedidoDetalle) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);
/*
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


    if (this.seleccionado.detaId) {
      this.pedidoDetalleService.put(this.seleccionado)
        .subscribe((pedidoDetalle) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.seleccionado.detaPediId = this.pediId;

      this.pedidoDetalleService.post(this.seleccionado)
        .subscribe((pedidoDetalle: PedidoDetalle) => {

          pedidoDetalle.prodDescripcion = this.productos.find(c => c.prodId == pedidoDetalle.detaProdId)!.prodDescripcion;
          this.items.push(pedidoDetalle);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}