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
    // const itemTeste = [
    //   {
    //     id : 1,
    //     descricaoProduto: 'Arroz',
    //     fornecedor:'Camil',
    //     quantidade: 20,
    //     unidadeMedida: 'KG'
    //   },
    //   {
    //     id : 2,
    //     descricaoProduto: 'Feijão',
    //     fornecedor:'Kicaldo',
    //     quantidade: 20,
    //     unidadeMedida: 'KG'
    //   },
    //   {
    //     id : 3,
    //     descricaoProduto: 'Nori Alga Marinha',
    //     fornecedor:'Sidchen',
    //     quantidade: 20,
    //     unidadeMedida: 'UN'
    //   },
    // ]
    // this.dadosDosItens = DataTableItem.collection(itemTeste)
    
  }

  buscarEstoque(){
    this.estoqueService.buscarEstoque().subscribe((data)=>{
      console.log('estoque', data)
      if(Array.isArray(data) && data.length){
        // const idProduto = data[0].id;
        const produtosEstoque:any[] =[]
        data.forEach((e)=>{
          console.log('es',e)
          this.produtoService.buscarProduto(String(e.id)).subscribe(produto=>{
            console.log('produto', produto)
            const item ={
              id : e.id,
              descricaoProduto: produto.nome,
              quantidade: e.quantidade,
              unidadeMedida: e.unidade
            }
            produtosEstoque.push(item)
          })
        })
        this.dadosDosItens = DataTableItem.collection(produtosEstoque)
      }
    },error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

}
