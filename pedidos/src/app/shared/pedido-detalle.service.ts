import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { PedidoDetalle } from './pedido-detalle';



@Injectable({
  providedIn: 'root'
})
export class PedidoDetalleService {

  private url = 'http://localhost:8888/pedido-detalle.php';
  constructor(
    private http: HttpClient
  ) { }

  get( detaPediId: number): Observable<PedidoDetalle[]> {
    return this.http.get<PedidoDetalle[]>
    (`${this.url}?detaPediId=${detaPediId}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  put(pedidoDetalle: PedidoDetalle): Observable<any> {
    let payload = JSON.stringify(pedidoDetalle);
    return this.http.put<PedidoDetalle>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  post(pedidoDetalle: PedidoDetalle): Observable<any> {
    let payload = JSON.stringify(pedidoDetalle);
    return this.http.post<PedidoDetalle>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  public handleError(err: Response) {
    //TODO: servicio global de errores
    alert(err.statusText);
    return of([]);
  }
}