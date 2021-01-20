import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Cliente } from './cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8888/cliente.php';
  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url)
      .pipe(catchError(this.handleError));
  }

  public handleError(err: Response) {
    //TODO: servicio global de errores
    alert(err.statusText);
    return of([]);
  }

}
