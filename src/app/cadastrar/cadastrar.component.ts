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

  regex = '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)(?=.*[@$!%*?&])[A-Za-z\\d!$%@#£€*?&]{8,}$'; 
  confirmarSenha: string
  formUsuario : FormGroup;
  formFields : Record<string, unknown> ={
    nome: [null, Validators.required],
    sobrenome:[null],
    usuario:[null, Validators.required],
    senha:[null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.regex)
     ]],
    confirmeSenha:[null, [
      Validators.required,
      Validators.minLength(8),
     ]],
  }

  cabecalhoTabela: DataTableConfig;
  dadosTabela: DataTableItem[];
  editar = false;
  id : any = null;
  nameUser : any = null;

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
        label: 'Usuário',
        type: 'text'
      }
      
    ], 'id');
    this.cabecalhoTabela.isEditable = true;
    this.cabecalhoTabela.isDeletable = true;
    
    // const dataTeste = [
    //   {
    //       id: 1,
    //       usuario: "admin",
    //       nome: "admin",
    //       sobrenome: "admin"
    //   },
    //   {
    //       id: 4,
    //       usuario: "furia",
    //       nome: "Fabio",
    //       sobrenome: "Furia"
    //   },
    //   {
    //       id: 5,
    //       usuario: "mozart_alemão",
    //       nome: "mozart da silva",
    //       sobrenome: " da silva"
    //   },
    //   {
    //       id: 6,
    //       usuario: "thiago",
    //       nome: "Thiago",
    //       sobrenome: "Suyama"
    //   },
    //   {
    //       id: 8,
    //       usuario: "tese1",
    //       nome: "teste1",
    //       sobrenome: "test1"
    //   }
    // ]
    // const itemsTeste =[]
    // for (const item of dataTeste) {
    //   const usuario ={
    //     id: item.id,
    //     Nome: item.nome,
    //     Sobrenome: item.sobrenome,
    //     Usuario: item.usuario,
    //     isEditable:true,
    //     isDeletable:true,
    //   }
    //   itemsTeste.push(usuario)
    // }
    // itemsTeste.sort((a,b)=>{
    //   return new Intl.Collator().compare(a.Nome, b.Nome);
    // });
    // this.dadosTabela = DataTableItem.collection(itemsTeste);
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
          this.carregarTabela();
          this.novoCadastro();
        }, error =>{
          console.warn('error', error)
          this.alert.error('Tente novamente','Falha')
        })
      }else{
        this.authService.atualizar(this.id,body).subscribe((resp: IUser) => {
          this.alert.success('Cadastro atualizado com sucesso!',)
          this.carregarTabela();
          this.novoCadastro();
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
    this.nameUser = event.Usuario;
    const { value: response } = await this.confirmarExclusao();
    if (response) {
      this.alert.success('Cadastrado excluído com sucesso!',)
    }
    return;
  }

  async confirmarExclusao():Promise<SweetAlertResult>{
    return await Swal.fire({
      title: `Confirma a exclusão do usuário ${this.nameUser}`,
      icon:'warning',
      showCancelButton: true,
      focusCancel: true,
      // width: 1000,
      preConfirm: () =>{
        this.excluir();
      },
     });
  }

  excluir():void{
    this.authService.excluir(this.id).subscribe((data)=>{
      console.log('Excluir', data)
      this.carregarTabela();
      this.novoCadastro();
    },error =>{
      this.alert.error('Por favor, atualize a página e tente novamente.', 'Erro!');
      console.info('error =>',error);
    });
  }

}
