import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IProduto } from '../model/Produto'
import { ProdutoService } from '../service/produto.service'
import { DataTableConfig, DataTableItem } from '../componentes/tabela/tabela.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  formProduto : FormGroup;
  formFields : Record<string, unknown> ={
    nome: [null,Validators.required],
    descricao:[null],
    quantidade:[null, [Validators.required]],
  }

  cabecalhoTabela: DataTableConfig;
  dadosTabela: DataTableItem[];

  editar = false;
  id : any = null;
  name : any = null;

  constructor(
    private fb: FormBuilder,
    private produtoService : ProdutoService,
    private alert : ToastrService,

  ) { 
    this.formProduto = this.fb.group(this.formFields)

  }

  ngOnInit(): void {
    this.carregarTabela();
  }

  carregarTabela(): void{
    this.produtoService.buscarTodosProdutos().subscribe((data)=>{
      console.log('produtos', data)
      const items=[];
      if(Array.isArray(data) && data.length){
        for (const item of data) {
          const usuario ={
            id: item.id,
            nomeProduto: item.nome,
            descricao: item.descricao,
            quantidade: item.quantidade,
            isEditable:true,
            isDeletable:true,
          }
          items.push(usuario)
        }
        items.sort((a,b)=>{
          return new Intl.Collator().compare(a.nomeProduto, b.nomeProduto);
        });
        this.dadosTabela = DataTableItem.collection(items);
      }
    })
    this.cabecalhoTabela = DataTableConfig.default([
      {
        var: 'id',
        label: 'N*',
        type: 'text'
      },
      {
        var: 'nomeProduto',
        label: 'Nome do Produto',
        type: 'text'
      },
      {
        var: 'descricao',
        label: 'Descri????o do produto',
        type: 'text'
      },
      {
        var: 'quantidade',
        label: 'Quantidade m??nima',
        type: 'text'
      }
      
    ], 'id');
    this.cabecalhoTabela.isEditable = true;
    this.cabecalhoTabela.isDeletable = true;
  }

  novoCadastro():void{
    this.editar = false;
    this.id = null;
    this.formProduto.reset();
  }

  cadastrar(): void{
    const body:IProduto  = Object.assign({}, this.formProduto.value)
    console.log('body',body)
    const quantidadeZero = body.quantidade === 0 ? true : false;
    const quantidadeNegativa = body.quantidade && body.quantidade < 1 ? true: false;
    if(quantidadeZero || quantidadeNegativa){
      this.alert.warning('Quantidade zero ou negativo','Falha')
      return;
    }
    if(!this.editar){
      this.produtoService.cadastrar(body).subscribe((data:IProduto)=>{
        this.alert.success('Produto Cadastrado','Sucesso!')
        this.carregarTabela();
        this.novoCadastro();
      }, error =>{
        console.warn('error', error)
        this.alert.error('Tente novamente','Falha')
      })
    }else{
      this.produtoService.atualizar(this.id,body).subscribe((data:IProduto)=>{
        this.alert.success('Cadastro atualizado com sucesso!',)
        this.carregarTabela();
        this.novoCadastro();
      }, error =>{
        console.warn('error', error)
        this.alert.error('Tente novamente','Falha')
      })
    }
  }

  editarCadastro(event: any):void{
    console.log('editarCadastro',event )
    this.editar = true;
    this.id = event.id;
    this.formProduto.get('nome')?.setValue(event.nomeProduto)
    this.formProduto.get('descricao')?.setValue(event.descricao)
    this.formProduto.get('quantidade')?.setValue(event.quantidade)
  }

  async apagarCadastro(event: any):Promise<void>{
    console.log('apagarCadastro',event)
    this.id = event.id;
    this.name = event.nomeProduto;
    const { value: response } = await this.confirmarExclusao();
    if (response) {
      this.alert.success('Cadastrado exclu??do com sucesso!',)
    }
    return;
  }

  async confirmarExclusao():Promise<SweetAlertResult>{
    return await Swal.fire({
      title: `Confirma a exclus??o do produto ${this.name}`,
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
    this.produtoService.excluir(this.id).subscribe((data)=>{
      console.log('Excluir', data)
      this.carregarTabela();
      this.novoCadastro();
    },error =>{
      this.alert.error('Por favor, atualize a p??gina e tente novamente.', 'Erro!');
      this.carregarTabela();
      this.novoCadastro();
      console.info('error =>',error);
    });
  }

}
