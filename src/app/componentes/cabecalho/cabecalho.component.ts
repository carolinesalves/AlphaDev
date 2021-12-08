import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../model/User';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent  implements OnInit  {
  user$ = this.auth.retornaUsuario()
  mostrarMenu = false;
  usuarioLogado: IUser;

  constructor(
    private auth: AuthService,
    private router:Router,
    
    ) { }

    logout(){
      this.auth.logout();
      this.router.navigate(['']);
    }

    ngOnInit(): void{
      this.user$.subscribe((data)=>{
        console.log('menu', data)
      })
      this.auth.logout();
      this.auth.mostrarMenuEmitter.subscribe((mostrar) => {
        this.mostrarMenu = mostrar
        this.auth.userEmitter.subscribe(usuario => this.usuarioLogado = usuario)
      })
    }

}
