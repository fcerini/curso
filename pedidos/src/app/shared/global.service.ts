import { Injectable } from '@angular/core';
import { PedidoDetalle } from './pedido-detalle';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  items: PedidoDetalle[] = [];

  constructor() { }
}
