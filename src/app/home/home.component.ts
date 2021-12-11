import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../service/registro.service';
import { IRegistro } from '../model/registro';
import { EstoqueService } from '../service/estoque.service';
import { ProdutoService } from '../service/produto.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment/moment';
moment.locale('pt-br');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  produtos: {id:string, nome:string, quantidade:string, unidadeMedida:string}[]=[]
  produtosEstoque:any[] =[]
  registroDeProdutos:IRegistro[] =[]

  todosRegistros:IRegistro[]= [
    {
        id: 1,
        nome: "Queijo",
        quantidade: 2,
        dataRetirada: "2021/12/10 15:51:06"
    },
    {
        id: 2,
        nome: "Salmão ",
        quantidade: 12,
        dataRetirada: "2021/12/09 23:45:18"
    },
    {
        id: 3,
        nome: "Arroz",
        quantidade: 22,
        dataRetirada: "2021/12/09 23:45:18"
    },
    {
        id: 4,
        nome: "Arroz",
        quantidade: 22,
        dataRetirada: "2021/11/01 23:45:18"
    },
    {
        id: 6,
        nome: "Arroz",
        quantidade: 12,
        dataRetirada: "2021/11/01 23:45:18"
    },
    {
        id: 7,
        nome: "Frango",
        quantidade: 1,
        dataRetirada: "2021/10/01 23:45:18"
    },
    {
        id: 8,
        nome: "Frango",
        quantidade: 24,
        dataRetirada: "2021/08/01 23:45:18"
    },
    {
        id: 9,
        nome: "Frango",
        quantidade: 3,
        dataRetirada: "2021/07/01 23:45:18"
    },
    {
        id: 10,
        nome: "Frango",
        quantidade: 10,
        dataRetirada: "2021/07/17 23:45:18"
    },
    {
        id: 11,
        nome: "Alga",
        quantidade: 1,
        dataRetirada: "2021/11/24 23:45:18"
    },
    {
        id: 12,
        nome: "Alga",
        quantidade: 15,
        dataRetirada: "2021/11/23 23:45:18"
    },
    {
        id: 13,
        nome: "Alga",
        quantidade: 32,
        dataRetirada: "2021/11/23 23:45:18"
    },
    {
        id: 14,
        nome: "Alga",
        quantidade: 42,
        dataRetirada: "2021/11/22 23:45:18"
    },
    {
        id: 15,
        nome: "Alga",
        quantidade: 25,
        dataRetirada: "2021/11/20 23:45:18"
    },
    {
        id: 16,
        nome: "Vinagre",
        quantidade: 32,
        dataRetirada: "2021/11/22 23:45:18"
    },
    {
        id: 17,
        nome: "Vinagre",
        quantidade: 12,
        dataRetirada: "2021/11/28 23:45:18"
    },
    {
        id: 18,
        nome: "Pimentão",
        quantidade: 12,
        dataRetirada: "2021/09/31 23:45:18"
    },
    {
        id: 19,
        nome: "Pimentão",
        quantidade: 2,
        dataRetirada: "2021/09/05 23:45:18"
    },
    {
        id: 20,
        nome: "Pimentão",
        quantidade: 2,
        dataRetirada: "2021/09/04 23:45:18"
    },
    {
        id: 21,
        nome: "Tilápia",
        quantidade: 3,
        dataRetirada: "2021/10/03 23:45:18"
    },
    {
        id: 22,
        nome: "Tilápia",
        quantidade: 4,
        dataRetirada: "2021/11/08 23:45:18"
    },
    {
        id: 23,
        nome: "Salmão",
        quantidade: 25,
        dataRetirada: "2021/11/02 23:45:18"
    },
    {
        id: 24,
        nome: "Salmão",
        quantidade: 5,
        dataRetirada: "2021/11/11 23:45:18"
    },
    {
        id: 25,
        nome: "Hashi",
        quantidade: 6,
        dataRetirada: "2021/11/23 23:45:18"
    },
    {
        id: 26,
        nome: "Hashi",
        quantidade: 8,
        dataRetirada: "2021/11/22 23:45:18"
    },
    {
        id: 27,
        nome: "Cebola",
        quantidade: 4,
        dataRetirada: "2021/08/11 23:45:18"
    },
    {
        id: 28,
        nome: "Cebola",
        quantidade: 2,
        dataRetirada: "2021/11/05 23:45:18"
    },
    {
        id: 29,
        nome: "Cebola",
        quantidade: 1,
        dataRetirada: "2021/09/01 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 5,
        dataRetirada: "2021/11/16 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 5,
        dataRetirada: "2021/11/17 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 20,
        dataRetirada: "2021/11/18 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 2,
        dataRetirada: "2021/11/19 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 9,
        dataRetirada: "2021/11/20 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 7,
        dataRetirada: "2021/11/21 23:45:18"
    },
    {
        id: 30,
        nome: "Arroz",
        quantidade: 10,
        dataRetirada: "2021/11/22 23:45:18"
    },
    {
        id: 5,
        nome: "Vinagre",
        quantidade: 2,
        dataRetirada: "2021/12/10 14:08:26"
    }
  ]

  estoqueAtual =[
    {
        id: 2,
        nomeProduto: "Queijo Gorgonzola",
        quantidade: 105,
        unidadeMedida: "KG"
    },
    {
        id: 11,
        nomeProduto: "Pimenta Biquinho",
        quantidade: 30,
        unidadeMedida: "MG"
    },
    {
        id: 1,
        nomeProduto: "Queijo",
        quantidade: 20,
        unidadeMedida: "KG"
    },
    {
        id: 5,
        nomeProduto: "Alga",
        quantidade: 32,
        unidadeMedida: "MG"
    },
    {
        id: 12,
        nomeProduto: "coca-cola",
        quantidade: 10,
        unidadeMedida: "L"
    },
    {
        id: 13,
        nomeProduto: "Salame",
        quantidade: 5,
        unidadeMedida: "KG"
    },
    {
        id: 14,
        nomeProduto: "Cerveja",
        quantidade: 40,
        unidadeMedida: "L"
    },
    {
        id: 3,
        nomeProduto: "Frango",
        quantidade: 87,
        unidadeMedida: "KG"
    },
    {
        id: 4,
        nomeProduto: "Salmão",
        quantidade: 20,
        unidadeMedida: "KG"
    },
    {
        id: 6,
        nomeProduto: "Vinagre",
        quantidade: 32,
        unidadeMedida: "L"
    },
    {
        id: 7,
        nomeProduto: "Arroz",
        quantidade: 4,
        unidadeMedida: "KG"
    },
    {
        id: 8,
        nomeProduto: "Hashi",
        quantidade: 5,
        unidadeMedida: "UN"
    },
    {
        id: 9,
        nomeProduto: "Cebola",
        quantidade: 6,
        unidadeMedida: "KG"
    },
    {
        id: 10,
        nomeProduto: "Pimentão",
        quantidade: 13,
        unidadeMedida: "KG"
    }
]

  constructor(private registroService: RegistroService,
    private estoqueService : EstoqueService,
    private produtoService : ProdutoService,
    private alert : ToastrService,


    ) { }

  ngOnInit(): void {
    this.buscarEstoque();
    this.registroService.receberRegistro().subscribe((registros)=>{
      this.sugerirCompra(registros);
    })
    // this.sugerirCompra(this.todosRegistros);
    this.produtos=[
      {
        id:'1',
        nome: 'Salmão',
        quantidade:'10',
        unidadeMedida: 'KG',
      },
      {
        id:'2',
        nome: 'Arroz',
        quantidade:'5',
        unidadeMedida: 'KG',
      },
      {
        id:'3',
        nome: 'Shoyu',
        quantidade:'3',
        unidadeMedida: 'UN',
      },
      {
        id:'4',
        nome: 'Carne',
        quantidade:'2',
        unidadeMedida: 'KG',
      },

    ]
  }

  sugerirCompra(registros:IRegistro[]):void{
    // this.registroDeProdutos= registros;
    // console.log('registros', this.registroDeProdutos)
    console.log('lista de produtos ', this.produtosEstoque)
    console.log('todos registros', this.todosRegistros)

    const listaRegistro:IRegistro[]=[];
    
    const hoje = moment(new Date()).format()
    // const dataInicio = moment(new Date()).subtract(15,'days').format();
    const mesPassado = moment(new Date()).subtract(1,'months').format();

    const respostaRegistro =  registros.reduce((acumulador, valorAtual, index, array)=>{
      if(listaRegistro.length === 0){ // Se a lista estiver vazia
        acumulador.contador=1;
        acumulador.datasAcumuladas=[];
        const dataAtual = moment(acumulador.dataRetirada).format()
        if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
          acumulador.datasAcumuladas.push(dataAtual)
          acumulador.quantidadeAcumuladas= acumulador.quantidade
          listaRegistro.push(acumulador);
        }
      }else{
        const encontrado = listaRegistro.findIndex(e => e.nome === valorAtual.nome);
        if(encontrado!== -1){ // Se não encontrou na lista
          const dataAtual = moment(valorAtual.dataRetirada).format()
          if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
            const cont = listaRegistro[encontrado].contador;
            listaRegistro[encontrado].contador = cont? cont+1 : cont;
            listaRegistro[encontrado].datasAcumuladas.push(moment(valorAtual.dataRetirada).format())
            const quantidadeAcumulada = listaRegistro[encontrado].quantidadeAcumuladas
            listaRegistro[encontrado].quantidadeAcumuladas = quantidadeAcumulada? quantidadeAcumulada+valorAtual.quantidade : quantidadeAcumulada;
          }

        }else{ // Se encontrou na lista
          const dataAtual = moment(valorAtual.dataRetirada).format()
          if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
            valorAtual.contador=1;
            valorAtual.datasAcumuladas=[];
            valorAtual.datasAcumuladas.push(moment(valorAtual.dataRetirada).format())
            valorAtual.quantidadeAcumuladas= valorAtual.quantidade
            listaRegistro.push(valorAtual);
          }

        }

      }
      return acumulador;
    })
    // console.log('respostaRegistro',respostaRegistro)
    console.log('listaRegistro',listaRegistro)
    listaRegistro.forEach((e,i)=>{
      const contador = e.contador || 0 
      if( contador > 6 ){
        console.log(' --- Maior que 6 ----',e)
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 14;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        console.log('mediaDiaria ', mediaDiaria)
        console.log('quantidadeMaximaEstoque ', quantidadeMaximaEstoque)
        console.log('quantidadeMinimaEstoque ', quantidadeMinimaEstoque)
        console.log('quantidadeParaComprar ', quantidadeParaComprar)
        return;
      }
      if( contador < 6 && contador > 3 ){
        console.log(' --- entre 6 e 3 ----',e)
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 8;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        console.log('mediaDiaria ', mediaDiaria)
        console.log('quantidadeMaximaEstoque ', quantidadeMaximaEstoque)
        console.log('quantidadeMinimaEstoque ', quantidadeMinimaEstoque)
        console.log('quantidadeParaComprar ', quantidadeParaComprar)
        return;
      }
      if( contador < 3){
        console.log(' --- menor que 3----', e)
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 6;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        console.log('mediaDiaria ', mediaDiaria)
        console.log('quantidadeMaximaEstoque ', quantidadeMaximaEstoque)
        console.log('quantidadeMinimaEstoque ', quantidadeMinimaEstoque)
        console.log('quantidadeParaComprar ', quantidadeParaComprar)
        return;
      }
    })
  }

  buscarEstoque(){
    this.estoqueService.buscarEstoque().subscribe((data)=>{
      // console.log('estoque', data)
      if(Array.isArray(data) && data.length){
        data.forEach((e)=>{
          this.produtoService.buscarProduto(String(e.id)).subscribe(produto=>{
            const item ={
              id : e.id,
              descricaoProduto: produto?.nome || produto?.descricao,
              quantidade: e.quantidade,
              unidadeMedida: e.unidadeMedida,
              qtdminima: produto.quantidade || '0'
            }
            this.produtosEstoque.push(item)
          })
        })
      }
    },error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

}
