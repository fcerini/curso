import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pedido } from './pedido';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url = 'http://localhost:8888/pedido.php';
  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  put(pedido: Pedido): Observable<any> {
    let payload = JSON.stringify(pedido);
    return this.http.put<Pedido>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  post(pedido: Pedido): Observable<any> {
    let payload = JSON.stringify(pedido);
    return this.http.post<Pedido>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  public handleError(err: Response) {
    //TODO: servicio global de errores
    alert(err.statusText);
    return of([]);
  }
}