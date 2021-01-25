import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from './config.service';

export abstract class ApiService<T> {
  
  private url = "";
  constructor(
    protected path: string,
    protected http: HttpClient,
    protected app: AppConfigService,
    ) {
    this.url =  app.config.apiUrl + "/" + path;
  }

  get(params?: string): Observable<T[]> {
    const p = params ? '?' + params : '';
    return this.http.get<T[]>
      (`${this.url}${p}`)
      .pipe(catchError(this.handleError));
  }

  getId(id?: number, params?: string): Observable<T> {
    const p = params ? '?' + params : '';
    return this.http.get<T>
      (`${this.url}/${id}${p}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  put(data: T): Observable<T> {
    let payload = JSON.stringify(data);
    return this.http.put<T>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  post(data: T): Observable<T> {
    let payload = JSON.stringify(data);
    return this.http.post<T>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  public handleError(error1: Response) {
    if (error1.status === 410) {
      console.log(error1);
      window.location.href = '/';
    }
    return throwError(error1.toString());
  }

}