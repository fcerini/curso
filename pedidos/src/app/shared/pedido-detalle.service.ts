import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';

import { AppConfigService } from '../core/config.service';
import { PedidoDetalle } from './pedido-detalle';

@Injectable({
  providedIn: 'root'
})
export class PedidoDetalleService
  extends ApiService<PedidoDetalle>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("pedido-detalle.php", http, app);
  }

}
