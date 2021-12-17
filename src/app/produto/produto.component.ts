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
    this.produtoService.buscarTodosProdutos().subscribe((data)=>{
      console.log('produtos', data)
    })
    this.cabecalhoTabela = DataTableConfig.default([
      {
        var: 'id',
        label: 'N*',
        type: 'text'
      },
      {
        var: 'Nome do Produto',
        label: 'Nome do Produto',
        type: 'text'
      },
      {
        var: 'Descrição do produto',
        label: 'Descrição do produto',
        type: 'text'
      },
      {
        var: 'Quantidade mínima',
        label: 'Quantidade mínima',
        type: 'text'
      }
      
    ], 'id');
    // this.cabecalhoTabela.isEditable = false;
    // this.cabecalhoTabela.isDeletable = false;
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

}
