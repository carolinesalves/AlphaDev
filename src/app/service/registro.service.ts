import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  receberRegistro(): Observable<any>{
    return this.http.get<any>(`${API}/registro`,)
  };
}
