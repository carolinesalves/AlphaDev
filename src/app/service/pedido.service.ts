import { environment } from './../../environments/environment.prod';
import { IPedido } from './../model/Pedido';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  gerarPedido(listaPedido: IPedido): Observable<IPedido>{
    return this.http.post<IPedido>(`${API}/pedidos`, listaPedido)
  }

  buscarTodosPedido(): Observable<[IPedido]>{
    return this.http.get<[IPedido]>(`${API}/pedidos`,)
  }

  buscarUmPedido(idPedido: string): Observable<[IPedido]>{
    return this.http.get<[IPedido]>(`${API}/pedidos/${idPedido}`,)
  }

}

