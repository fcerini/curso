import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { Cliente } from '../shared/cliente';
import { ClienteService } from '../shared/cliente.service';
import { GlobalService } from '../shared/global.service';
import { Pedido } from '../shared/pedido';
import { PedidoDetalleService } from '../shared/pedido-detalle.service';
import { PedidoService } from '../shared/pedido.service';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit, AfterViewInit {

  items: Pedido[] = [];
  seleccionado = new Pedido();

  columnas: string[] = ['pediId', 'pediFecha', 'clienNombre', 'acciones'];
  dataSource = new MatTableDataSource<Pedido>();


  form = new FormGroup({});
  mostrarFormulario = false;

  clientes: Cliente[] = [];

  minDate: Date = new Date();

  constructor(private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private pedidoDetalleService : PedidoDetalleService,
    private global: GlobalService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      pediId: [''],
      pediFecha: ['', Validators.required],
      pediClienId: ['', Validators.required],
      pediFechaAlta: [''],
      pediBorrado: [''],
      clienNombre:['']
    });

    this.pedidoService.get().subscribe(
      (pedidos) => {
        this.items = pedidos;
        this.actualizarTabla();
      }
    );

    this.clienteService.get().subscribe(
      (clientes)=>{
        this.clientes = clientes;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new Pedido();
    this.mostrarFormulario = true;
  }

  delete(row: Pedido) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.pedidoService.delete(row.pediId)
          .subscribe(() => {

            this.items = this.items.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  edit(seleccionado: Pedido) {
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


    // actualizo el nombre para que se vea en la grilla
    this.seleccionado.clienNombre =this.clientes.find(c => c.clienId == this.seleccionado.pediClienId)!.clienNombre;

    if (this.seleccionado.pediId) {
      this.pedidoService.put(this.seleccionado)
        .subscribe((pedido) => {
          this.actualizarDetalle(pedido.pediId);
        });

    } else {
      this.pedidoService.post(this.seleccionado)
        .subscribe((pedido: Pedido) => {
          // solo para que se vea en la grilla
          pedido.clienNombre = this.seleccionado.clienNombre;
          this.items.push(pedido);
          this.actualizarDetalle(pedido.pediId);
          
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }

  actualizarDetalle(pediId:number){
    this.global.items.forEach( (i)=>{
      i.detaPediId = pediId;
      if (i.detaBorrado){
        this.pedidoDetalleService.delete(i.detaId).subscribe();
      }

      if (i.detaId < 0){
        this.pedidoDetalleService.post(i).subscribe();
      }

      if (i.detaId > 0){
        this.pedidoDetalleService.put(i).subscribe();
      }
    });

    this.actualizarTabla();
    this.mostrarFormulario = false;
  }


}
