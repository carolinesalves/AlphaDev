import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IRegistro } from '../model/registro';

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  receberRegistro(): Observable<[IRegistro]>{
    return this.http.get<[IRegistro]>(`${API}/registro`,)
  };
}
