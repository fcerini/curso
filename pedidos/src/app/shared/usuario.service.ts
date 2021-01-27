import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService
  extends ApiService<Usuario>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("login", http, app);
  }
}
