import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IProduto } from '../model/Produto'
import { ProdutoService } from '../service/produto.service'
import { DataTableConfig, DataTableItem } from '../componentes/tabela/tabela.component';

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
        label: 'Descrição do produto',
        type: 'text'
      },
      {
        var: 'quantidade',
        label: 'Quantidade mínima',
        type: 'text'
      }
      
    ], 'id');
    this.cabecalhoTabela.isEditable = true;
    this.cabecalhoTabela.isDeletable = true;
  }

  cadastrar(): void{
    const body:IProduto  = Object.assign({}, this.formProduto.value)
    const quantidadeZero = body.quantidade === 0 ? true : false;
    const quantidadeNegativa = body.quantidade && body.quantidade < 1 ? true: false;
    if(quantidadeZero || quantidadeNegativa){
      this.alert.warning('Quantidade zero ou negativo','Falha')
      return;
    }
    this.produtoService.cadastrar(body).subscribe((data:IProduto)=>{
      this.formProduto.reset()
      this.alert.success('Produto Cadastrado','Sucesso!')
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

  editarCadastro(event: Event):void{
    console.log('editarCadastro',event )
  }

  apagarCadastro(event: Event):void{
    console.log('apagarCadastro',event)
  }
}
