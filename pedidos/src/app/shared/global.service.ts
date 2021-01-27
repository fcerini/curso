import { Injectable } from '@angular/core';
import { PedidoDetalle } from './pedido-detalle';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  items: PedidoDetalle[] = [];

  usuarioLogueado = new Usuario();

  constructor() { }
}
