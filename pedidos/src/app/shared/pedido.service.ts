import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Pedido } from './pedido';


@Injectable({
  providedIn: 'root'
})
export class PedidoService
  extends ApiService<Pedido>{
    constructor(
      protected http: HttpClient,
      protected app: AppConfigService
    ) {
      super("pedido", http, app);
    }
  
    
}