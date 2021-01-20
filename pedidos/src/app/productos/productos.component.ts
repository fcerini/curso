import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit{

  items: Producto[] = [];
  seleccionado = new Producto();

  columnas: string[] = ['prodId', 'prodDescripcion', 'prodPrecio', 'prodFechaAlta', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();


  form = new FormGroup({});

  mostrarFormulario = false;
  constructor(private productoService: ProductoService,
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
      prodId: [''],
      prodDescripcion: ['', Validators.required],
      prodPrecio: ['', Validators.required],
      prodBorrado: [''],
      prodFechaAlta: ['']
    });

    this.productoService.get().subscribe(
      (productos) => {
        this.items = productos;
        this.actualizarTabla();
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
    this.seleccionado = new Producto();
    this.mostrarFormulario = true;
  }

  delete(row: Producto) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.productoService.delete(row.prodId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.prodId != row.prodId) {
                return true
              } else {
                return false
              }
            });

            this.actualizarTabla();
          });
      }
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
          this.actualizarTabla();
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }

}
