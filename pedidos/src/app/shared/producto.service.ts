import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService 
extends ApiService<Producto>{
  path = "producto.php";
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("producto", http, app);
  }


}