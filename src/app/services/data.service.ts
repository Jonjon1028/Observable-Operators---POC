import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { User } from '../user';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DataService {
  constructor(private url: string, private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
      .map(response => response);
  }

  searchUser(term: string): Observable<User[]> {
    let url = `${this.url}?name=${term}`;
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError<User[]>('users', []))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`failed: ${error.message}`);
      return of(result as T);
    };
  }
}
