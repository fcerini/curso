import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = 'http://localhost:8888/producto.php';
  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url)
            .pipe(catchError(this.handleError));;
  }


  public handleError(err: Response){
    //TODO: servicio global de errores
    alert(err.statusText);
    return of([]);
  }

}
