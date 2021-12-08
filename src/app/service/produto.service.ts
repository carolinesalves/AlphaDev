import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduto } from '../model/Produto'

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    private http: HttpClient

  ) { }

  cadastrar(produto: IProduto): Observable<IProduto>{
    return this.http.post<IProduto>(`${API}/produtos`, produto)
  }
  
  buscarTodosProdutos(): Observable<Array<IProduto>>{
    return this.http.get<[IProduto]>(`${API}/produtos`,)
  }
  buscarProduto(item: string): Observable<IProduto>{
    return this.http.get<IProduto>(`${API}/produtos/${item}`,)
  }
  
}
