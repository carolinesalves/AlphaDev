import { environment } from './../../environments/environment';
import { IUser } from './../model/User';
import { TokenService } from './../autenticacao/token.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
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

  mostrarMenuEmitter = new EventEmitter<boolean>()
  userEmitter = new EventEmitter<IUser>()

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
    this.mostrarMenuEmitter.emit(false);
    this.userEmitter.emit({});
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
        // tap(x => console.log('get ',x))
        tap((res)=>{
          if(res){
            this.mostrarMenuEmitter.emit(true);
            this.userEmitter.emit({usuario,senha});
          }else{
            this.mostrarMenuEmitter.emit(false);
            this.userEmitter.emit({});
          }
          // console.log('resosta ', res),
          // const authToken = res.headers.get('x-access-token') ?? '';
          // this.salvaToken(authToken);
        })
      );
  }


  gerarToken(usuario: string): Observable<HttpResponse<any>> {
    return this.http.post(
      `http://localhost:3000/auth`,
      {
        usuario,
      },
      { observe: 'response' }
      ).pipe(
        tap((res)=>{
          const authToken = res.headers.get('x-access-token') ?? '';
          console.log('authToken', authToken)
          this.salvaToken(authToken);
        })
      );
  }

  cadastrar(user: User): Observable<User>{
    return this.http.post<User>(`${API}/usuarios`, user)
  }
 
}
