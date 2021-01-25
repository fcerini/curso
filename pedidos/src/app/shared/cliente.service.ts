import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService
  extends ApiService<Cliente>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("cliente.php", http, app);
  }
}
