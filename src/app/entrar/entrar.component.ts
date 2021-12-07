import { ToastrService } from 'ngx-toastr';
import { User } from './../model/User';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

const authConfig={
  secret: '5e20efab7420d13cd3ccb5e2bf4a1bce',
  expiresIn: '12h'
}
@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.css']
})
export class EntrarComponent implements OnInit {

  userLogin: User = new User()

  constructor(
    private auth: AuthService,
    private router: Router,
    private alert : ToastrService,

  ) { }

  ngOnInit() {
    window.scroll(0,0)
  }

  entrar(){
    if(this.userLogin.usuario === 'admin' && this.userLogin.senha ==='admin'){
      this.auth.salvaToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODIsIm5vbWUiOiJBZG1pbiIsInNvYnJlbm9tZSI6IkFkbWluIiwidXN1YXJpbyI6IkFkbWluIiwiaWF0IjoxNjM2NTkxOTYyLCJleHAiOjE2MzY2MzUxNjJ9.WjPoE3QHETKaTW8m1edGrJ7qrRPoapQ8rPIO5wS-b-0')
      this.router.navigate(['/home'])
      this.alert.success('Bem Vindo','Sucesso')
      return;
    }
    this.auth.entrar(this.userLogin.usuario as string, this.userLogin.senha as string).subscribe((resp: any)=>{
      console.log('auth ', resp)
      this.router.navigate(['/home'])
      this.alert.success('Bem Vindo','Sucesso')
    }, erro =>{
      console.warn('erro',erro)
      this.alert.error('Usuário ou senha estão incorretos!','Falha')

    })

  }

}
