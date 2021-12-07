import { environment } from './../../environments/environment';
import { IUser } from './../model/User';
import { TokenService } from './../autenticacao/token.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/User';
import jwt_decode from 'jwt-decode';

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioSubject = new BehaviorSubject<IUser>({}) 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { 
    if(this.tokenService.possuiToken()){
      this.decodificaJWT();
    }
  }

  private decodificaJWT(){
    const token = this.tokenService.retornaToken();
    const usuario = jwt_decode(token) as IUser;
    this.usuarioSubject.next(usuario);
  }

  retornaUsuario(){
    return this.usuarioSubject.asObservable();
  }

  salvaToken(token: string){
    this.tokenService.salvaToken(token);
    this.decodificaJWT();
  }

  logout(){
    this.tokenService.excluiToken();
    this.usuarioSubject.next({});
  }

  estaLogado(){
    return this.tokenService.possuiToken();
  }
  entrar(usuario: string, senha:string): Observable<any> {
    let params = new HttpParams();
    params = params.append('usuario', usuario);
    params = params.append('senha', senha);
    return this.http.get(
      `${API}/usuarios/auth`,{params}
      ).pipe(
        tap(x => console.log('get ',x))
      );
  }

  cadastrar(user: User): Observable<User>{
    return this.http.post<User>(`${API}/usuarios`, user)
  }
 
}
