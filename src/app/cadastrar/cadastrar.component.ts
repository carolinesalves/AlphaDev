import { ToastrService } from 'ngx-toastr';
import { IUser } from '../model/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../service/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DataTableItem, DataTableConfig } from '../componentes/tabela/tabela.component';
import Swal, { SweetAlertResult } from 'sweetalert2';


@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  // user: User = new User
  confirmarSenha: string
  formUsuario : FormGroup;
  formFields : Record<string, unknown> ={
    nome: [null, Validators.required],
    sobrenome:[null],
    usuario:[null, Validators.required],
    senha:[null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
     ]],
    confirmeSenha:[null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
     ]],
  }

  cabecalhoTabela: DataTableConfig;
  dadosTabela: DataTableItem[];
  editar = false;
  id : any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert : ToastrService,
    private fb: FormBuilder,

  ) {
    this.formUsuario = this.fb.group(this.formFields)
   }

  ngOnInit() {
    window.scroll(0,0)
    this.carregarTabela();
  }

  carregarTabela(): void{
    this.authService.buscarTodosUsuarios().subscribe((data)=>{
      console.log('usuarios', data)
      const items=[];
      if(Array.isArray(data) && data.length){
        for (const item of data) {
          const usuario ={
            id: item.id,
            Nome: item.nome,
            Sobrenome: item.sobrenome,
            Usuario: item.usuario,
            isEditable:true,
            isDeletable:true,
          }
          items.push(usuario)
        }
        items.sort((a,b)=>{
          return new Intl.Collator().compare(a.Nome, b.Nome);
        });
        this.dadosTabela = DataTableItem.collection(items);
      }
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })

    this.cabecalhoTabela = DataTableConfig.default([
      {
        var: 'id',
        label: 'N*',
        type: 'text'
      },
      {
        var: 'Nome',
        label: 'Nome',
        type: 'text'
      },
      {
        var: 'Sobrenome',
        label: 'Sobrenome',
        type: 'text'
      },
      {
        var: 'Usuario',
        label: 'Usuario',
        type: 'text'
      }
      
    ], 'id');
    this.cabecalhoTabela.isEditable = true;
    this.cabecalhoTabela.isDeletable = true;
    
  }

  confirmeSenha() :boolean {
    const senha = this.formUsuario.get('senha')?.value
    const confirmeSenha = this.formUsuario.get('confirmeSenha')?.value
    if(senha === confirmeSenha){
      return true
    }
    this.alert.warning('As senhas estão incorretas.','Atenção')
    return false
  }

  novoCadastro():void{
    this.editar = false;
    this.id = null;
    this.formUsuario.reset();
  }
  
  cadastrar():void {
    if(this.confirmeSenha()) {
      const body = this.formUsuario.getRawValue();
      if(!this.editar){
        this.authService.cadastrar(body).subscribe((resp: IUser) => {
          this.alert.success('Usuário cadastrado com sucesso!',)
          this.formUsuario.reset();
          this.carregarTabela();
        }, error =>{
          console.warn('error', error)
          this.alert.error('Tente novamente','Falha')
        })
      }else{
        this.authService.atualizar(this.id,body).subscribe((resp: IUser) => {
          this.alert.success('Cadastrado atualizado com sucesso!',)
          this.formUsuario.reset();
          this.carregarTabela();
        }, error =>{
          console.warn('error', error)
          this.alert.error('Tente novamente','Falha')
        })
      }
    }
  }

  editarCadastro(event: any):void{
    console.log('editarCadastro',event )
    this.editar = true;
    this.id = event.id;
    this.formUsuario.get('nome')?.setValue(event.Nome)
    this.formUsuario.get('sobrenome')?.setValue(event.Sobrenome)
    this.formUsuario.get('usuario')?.setValue(event.Usuario)
  }

  async apagarCadastro(event: any):Promise<void>{
    console.log('apagarCadastro',event)
    this.id = event.id;
    const { value: response } = await this.confirmarExclusao();
    if (response) {
      this.alert.success('Cadastrado excluído com sucesso!',)
    }
    return;
  }

  async confirmarExclusao():Promise<SweetAlertResult>{
    return await Swal.fire({
      title: 'Excluir cadastro',
      icon:'warning',
      showCancelButton: true,
      focusCancel: true,
      width: 1000,
      preConfirm: () =>{
        this.excluir();
      },
     });
  }

  excluir():void{
    this.authService.excluir(this.id).subscribe((data)=>{
      console.log('Excluir', data)
    },error =>{
      this.alert.error('Por favor, atualize a página e tente novamente.', 'Erro!');
      console.info('error =>',error);
    });
  }

}
