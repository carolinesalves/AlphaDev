import { EstoqueService } from './../service/estoque.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableItem, DataTableConfig } from './../componentes/tabela/tabela.component';
import { Component, OnInit, NgModule } from '@angular/core';
import { ProdutoService } from '../service/produto.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent implements OnInit {

  listaDeProdutos: DataTableConfig;
  dadosDosItens: DataTableItem[];

  constructor(
    private alert : ToastrService,
    private estoqueService : EstoqueService,
    private produtoService : ProdutoService,
  ) { 
    this.listaDeProdutos = DataTableConfig.default([
      {
        var: 'id',
        label: 'N*',
        type: 'text'
      }, 
      {
        var: 'descricaoProduto',
        label: 'Produto',
        type: 'text'
      },
      {
        var: 'quantidade',
        label: 'Quantidade',
        type: 'text'
      },
      {
        var: 'qtdminima',
        label: 'Quantidade mínima',
        type: 'text'
      },
      {
        var: 'unidadeMedida',
        label: 'Unidade de Medida',
        type: 'text'
      },
    ], 'id');
    this.listaDeProdutos.isEditable =false;
    this.listaDeProdutos.isDeletable =false;
  }

  ngOnInit(): void {
    this.buscarEstoque();
  }

  buscarEstoque(){
    this.estoqueService.buscarEstoque().subscribe((data)=>{
      // console.log('estoque', data)
      if(Array.isArray(data) && data.length){
        const produtosEstoque:any[] =[]
        data.forEach((e)=>{
          this.produtoService.buscarProduto(String(e.id)).subscribe(produto=>{
            // console.log('produto', produto)
            const item ={
              id : e.id,
              descricaoProduto: produto?.nome || produto?.descricao,
              quantidade: e.quantidade || '0',
              unidadeMedida: e.unidadeMedida,
              qtdminima: produto.quantidade || '0'
            }
            produtosEstoque.push(item)
            produtosEstoque.sort((a,b)=>{
              return new Intl.Collator().compare(a.descricaoProduto, b.descricaoProduto);
            });
            setTimeout(() => {
              this.dadosDosItens = DataTableItem.collection(produtosEstoque)
            }, 2000);
          })
        })
      }
    },error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

}
