import { RecebidosService } from './../service/recebidos.service';
import { IPedido } from './../model/Pedido';
import { PedidoService } from './../service/pedido.service';
import { DataTableConfig, DataTableItem } from './../componentes/tabela/tabela.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-recebidos',
  templateUrl: './recebidos.component.html',
  styleUrls: ['./recebidos.component.css']
})
export class RecebidosComponent implements OnInit {

  listaDePedidos: DataTableConfig;
  dadosDoPedido: DataTableItem[];

  listaDeProdutos: DataTableConfig;
  dadosDosItens: DataTableItem[];

  todosPedidos : IPedido[];

  numeroPedido = '';
  item :IPedido[];

  constructor(
    private alert: ToastrService,
    private pedidoService: PedidoService,
    private recebidoService: RecebidosService,

  ) {

    this.listaDePedidos = DataTableConfig.default([
      {
        var: 'id',
        label: 'N* do Pedido',
        type: 'text'
      },
      {
        var: 'fornecedor',
        label: 'Fornecedor',
        type: 'text'
      }
    ], 'id');
    

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
        var: 'fornecedor',
        label: 'Fornecedor',
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
      {
        var: 'DataDeValidade',
        label: 'Data de Validade',
        type: 'datePicker'
      },
      {
        var: 'quantidadeRecebida',
        label: 'Quantidade Recebida',
        type: 'input'
      },
      
      
    ], 'id');
    this.listaDeProdutos.isEditable = false;
    this.listaDeProdutos.isDeletable = false;
  }



  ngOnInit(): void {
    this.buscarTodosPedidos();
  }


  buscarTodosPedidos(){
    this.pedidoService.buscarTodosPedido().subscribe((data)=>{
      console.log('todos pedidos', data)
      if(Array.isArray(data) && data.length){
        if(data.length > 0 ){
          this.todosPedidos = data;
          const pedidos : any[]=[];
          data.forEach(pedido => {
            const dadosPedido ={
              id: pedido.id,
              fornecedor: pedido?.fornecedor?.nomeFornecedor,
              isViewItem: true,
            }
            pedidos.push(dadosPedido)
          });
          this.dadosDoPedido = DataTableItem.collection(pedidos)
        }
      }
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

  visualizarPedido(pedido: any) {
    this.numeroPedido = pedido.id
    const pedidoSelecionado = this.todosPedidos.filter((e)=> e.id === pedido.id)
    const items = {
      id: pedidoSelecionado[0]?.produto?.id,
      descricaoProduto: pedidoSelecionado[0]?.produto?.nome,
      fornecedor: pedidoSelecionado[0]?.fornecedor?.nomeFornecedor,
      quantidade: pedidoSelecionado[0]?.quantidade,
      unidadeMedida: pedidoSelecionado[0]?.unidadeMedida,
      DataDeValidade: '',
      quantidadeRecebida:'',
    }
    this.item = [items];
    this.dadosDosItens = DataTableItem.collection(this.item)
  }

  receberPedido() {
    const dataValidade = moment(this.dadosDosItens[0].DataDeValidade).format()
    const hoje = (moment(new Date()).format())
    console.log('this.dadosDosItens', this.dadosDosItens)
    if(moment(dataValidade).isAfter(hoje)){
      const body ={
        produto: {id:this.dadosDosItens[0].id},
        quantidade : parseInt(this.dadosDosItens[0].quantidadeRecebida),
        unidadeMedida: this.dadosDosItens[0].unidadeMedida
      }
      console.log('body', body)
      this.recebidoService.receberPedido(this.numeroPedido, body).subscribe((data)=>{
        this.alert.success('Pedido Recebido','Sucesso!')
        this.item =[];
        this.numeroPedido ='';
        this.dadosDosItens=[];
        this.dadosDoPedido=[];
        this.buscarTodosPedidos();
      }, error =>{
        console.warn('error', error)
        this.alert.error('Tente novamente','Falha')
      })
      return;
    }
    this.alert.info('Produto com data de validade inválida','Sucesso!')


  }

  confirmarItem(event:Event){
  }
}
