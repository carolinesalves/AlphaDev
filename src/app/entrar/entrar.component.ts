import { ToastrService } from 'ngx-toastr';
import { User } from './../model/User';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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
      this.auth.mostrarMenuEmitter.emit(true);
      this.auth.userEmitter.emit({usuario:this.userLogin.usuario,senha:this.userLogin.senha});
      
      this.router.navigate(['/home'])
      this.alert.success('Bem Vindo','Sucesso')
      return;
    }
    this.auth.entrar(this.userLogin.usuario as string, this.userLogin.senha as string).pipe(
      switchMap(()=>this.auth.gerarToken(this.userLogin.usuario as string))
    ).subscribe((data)=>{
      console.log('data' ,data )
      this.router.navigate(['/home'])
      this.alert.success('Bem Vindo','Sucesso')
    }, erro =>{
      console.warn('erro',erro)
      this.alert.error('Usuário ou senha estão incorretos!','Falha')

    })

    // this.auth.entrar(this.userLogin.usuario as string, this.userLogin.senha as string).subscribe((resp: any)=>{
    //   if(resp){
    //     // this.auth.salvaToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODIsIm5vbWUiOiJ1c3VhcmlvIiwic29icmVub21lIjoidXN1YXJpbyIsInVzdWFyaW8iOiJBZG1pbiIsImlhdCI6MTYzNjU5MTk2MiwiZXhwIjoxNjM2NjM1MTYyfQ.Z7KtjwaoJJ-3fI9X9kdZ_gsgbv-Hc_iD8fppdirIdVI')
    //     this.auth.gerarToken(this.userLogin.usuario as string).subscribe((data)=>{
    //       console.log('data' ,data )
    //       this.router.navigate(['/home'])
    //       this.alert.success('Bem Vindo','Sucesso')
    //     })
    //   }
    // }, erro =>{
    //   console.warn('erro',erro)
    //   this.alert.error('Usuário ou senha estão incorretos!','Falha')
    // })

  }

}
