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

  produtos: IRegistro[]=[]
  produtosEstoque:any[] =[]
  registroDeProdutos:IRegistro[] =[]

  // todosRegistros:IRegistro[]= [
  //   {
  //       id: 1,
  //       nome: "Queijo",
  //       quantidade: 2,
  //       dataRetirada: "2021/12/10 15:51:06"
  //   },
  //   {
  //       id: 2,
  //       nome: "Salmão ",
  //       quantidade: 12,
  //       dataRetirada: "2021/12/09 23:45:18"
  //   },
  //   {
  //       id: 3,
  //       nome: "Arroz",
  //       quantidade: 22,
  //       dataRetirada: "2021/12/09 23:45:18"
  //   },
  //   {
  //       id: 4,
  //       nome: "Arroz",
  //       quantidade: 22,
  //       dataRetirada: "2021/11/01 23:45:18"
  //   },
  //   {
  //       id: 6,
  //       nome: "Arroz",
  //       quantidade: 12,
  //       dataRetirada: "2021/11/01 23:45:18"
  //   },
  //   {
  //       id: 7,
  //       nome: "Frango",
  //       quantidade: 1,
  //       dataRetirada: "2021/10/01 23:45:18"
  //   },
  //   {
  //       id: 8,
  //       nome: "Frango",
  //       quantidade: 24,
  //       dataRetirada: "2021/08/01 23:45:18"
  //   },
  //   {
  //       id: 9,
  //       nome: "Frango",
  //       quantidade: 3,
  //       dataRetirada: "2021/07/01 23:45:18"
  //   },
  //   {
  //       id: 10,
  //       nome: "Frango",
  //       quantidade: 10,
  //       dataRetirada: "2021/07/17 23:45:18"
  //   },
  //   {
  //       id: 11,
  //       nome: "Alga",
  //       quantidade: 1,
  //       dataRetirada: "2021/11/24 23:45:18"
  //   },
  //   {
  //       id: 12,
  //       nome: "Alga",
  //       quantidade: 15,
  //       dataRetirada: "2021/11/23 23:45:18"
  //   },
  //   {
  //       id: 13,
  //       nome: "Alga",
  //       quantidade: 32,
  //       dataRetirada: "2021/11/23 23:45:18"
  //   },
  //   {
  //       id: 14,
  //       nome: "Alga",
  //       quantidade: 42,
  //       dataRetirada: "2021/11/22 23:45:18"
  //   },
  //   {
  //       id: 15,
  //       nome: "Alga",
  //       quantidade: 25,
  //       dataRetirada: "2021/11/20 23:45:18"
  //   },
  //   {
  //       id: 16,
  //       nome: "Vinagre",
  //       quantidade: 32,
  //       dataRetirada: "2021/11/22 23:45:18"
  //   },
  //   {
  //       id: 17,
  //       nome: "Vinagre",
  //       quantidade: 12,
  //       dataRetirada: "2021/11/28 23:45:18"
  //   },
  //   {
  //       id: 18,
  //       nome: "Pimentão",
  //       quantidade: 12,
  //       dataRetirada: "2021/09/31 23:45:18"
  //   },
  //   {
  //       id: 19,
  //       nome: "Pimentão",
  //       quantidade: 2,
  //       dataRetirada: "2021/09/05 23:45:18"
  //   },
  //   {
  //       id: 20,
  //       nome: "Pimentão",
  //       quantidade: 2,
  //       dataRetirada: "2021/09/04 23:45:18"
  //   },
  //   {
  //       id: 21,
  //       nome: "Tilápia",
  //       quantidade: 3,
  //       dataRetirada: "2021/10/03 23:45:18"
  //   },
  //   {
  //       id: 22,
  //       nome: "Tilápia",
  //       quantidade: 4,
  //       dataRetirada: "2021/11/08 23:45:18"
  //   },
  //   {
  //       id: 23,
  //       nome: "Salmão",
  //       quantidade: 25,
  //       dataRetirada: "2021/11/02 23:45:18"
  //   },
  //   {
  //       id: 24,
  //       nome: "Salmão",
  //       quantidade: 5,
  //       dataRetirada: "2021/11/11 23:45:18"
  //   },
  //   {
  //       id: 25,
  //       nome: "Hashi",
  //       quantidade: 6,
  //       dataRetirada: "2021/11/23 23:45:18"
  //   },
  //   {
  //       id: 26,
  //       nome: "Hashi",
  //       quantidade: 8,
  //       dataRetirada: "2021/11/22 23:45:18"
  //   },
  //   {
  //       id: 27,
  //       nome: "Cebola",
  //       quantidade: 4,
  //       dataRetirada: "2021/08/11 23:45:18"
  //   },
  //   {
  //       id: 28,
  //       nome: "Cebola",
  //       quantidade: 2,
  //       dataRetirada: "2021/11/05 23:45:18"
  //   },
  //   {
  //       id: 29,
  //       nome: "Cebola",
  //       quantidade: 1,
  //       dataRetirada: "2021/09/01 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 5,
  //       dataRetirada: "2021/11/16 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 5,
  //       dataRetirada: "2021/11/17 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 20,
  //       dataRetirada: "2021/11/18 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 2,
  //       dataRetirada: "2021/11/19 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 9,
  //       dataRetirada: "2021/11/20 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 7,
  //       dataRetirada: "2021/11/22 23:45:18"
  //   },
  //   {
  //       id: 30,
  //       nome: "Arroz",
  //       quantidade: 10,
  //       dataRetirada: "2021/11/22 23:45:18"
  //   },
  //   {
  //       id: 5,
  //       nome: "Vinagre",
  //       quantidade: 2,
  //       dataRetirada: "2021/12/10 14:08:26"
  //   }
  // ]

//   estoqueAtual =[
//     {
//         id: 2,
//         descricaoProduto: "Queijo Gorgonzola",
//         quantidade: 105,
//         unidadeMedida: "KG",
//         qtdminima: 4
//     },
//     {
//         id: 11,
//         descricaoProduto: "Pimenta Biquinho",
//         quantidade: 30,
//         unidadeMedida: "MG",
//         qtdminima: 20
//     },
//     {
//         id: 5,
//         descricaoProduto: "Alga",
//         quantidade: 32,
//         unidadeMedida: "MG",
//         qtdminima: 20
//     },
//     {
//         id: 1,
//         descricaoProduto: "Queijo",
//         quantidade: 20,
//         unidadeMedida: "KG",
//         qtdminima: 20
//     },
//     {
//         id: 12,
//         descricaoProduto: "coca-cola",
//         quantidade: 10,
//         unidadeMedida: "L",
//         qtdminima: 2
//     },
//     {
//         id: 13,
//         descricaoProduto: "Salame",
//         quantidade: 5,
//         unidadeMedida: "KG",
//         qtdminima: 4
//     },
//     {
//         id: 3,
//         descricaoProduto: "Frango",
//         quantidade: 87,
//         unidadeMedida: "KG",
//         qtdminima: 20
//     },
//     {
//         id: 6,
//         descricaoProduto: "Vinagre",
//         quantidade: 32,
//         unidadeMedida: "L",
//         qtdminima: 10
//     },
//     {
//         id: 14,
//         descricaoProduto: "Cerveja",
//         quantidade: 40,
//         unidadeMedida: "L",
//         qtdminima: 2
//     },
//     {
//         id: 4,
//         descricaoProduto: "Salmão",
//         quantidade: 20,
//         unidadeMedida: "KG",
//         qtdminima: 2
//     },
//     {
//         id: 7,
//         descricaoProduto: "Arroz",
//         quantidade: 4,
//         unidadeMedida: "KG",
//         qtdminima: 20
//     },
//     {
//         id: 8,
//         descricaoProduto: "Hashi",
//         quantidade: 5,
//         unidadeMedida: "UN",
//         qtdminima: 10
//     },
//     {
//         id: 9,
//         descricaoProduto: "Cebola",
//         quantidade: 6,
//         unidadeMedida: "KG",
//         qtdminima: 10
//     },
//     {
//         id: 10,
//         descricaoProduto: "Pimentão",
//         quantidade: 13,
//         unidadeMedida: "KG",
//         qtdminima: 22
//     }
// ]

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
    // this.produtos=[
    //   {
    //     id:'1',
    //     nome: 'Salmão',
    //     quantidade:'10',
    //     unidadeMedida: 'KG',
    //   },
    //   {
    //     id:'2',
    //     nome: 'Arroz',
    //     quantidade:'5',
    //     unidadeMedida: 'KG',
    //   },
    //   {
    //     id:'3',
    //     nome: 'Shoyu',
    //     quantidade:'3',
    //     unidadeMedida: 'UN',
    //   },
    //   {
    //     id:'4',
    //     nome: 'Carne',
    //     quantidade:'2',
    //     unidadeMedida: 'KG',
    //   },

    // ]
  }

  sugerirCompra(registros:IRegistro[]):void{
    // this.registroDeProdutos= registros;
    // console.log('registros', this.registroDeProdutos)
    // console.log('lista de produtos ', this.produtosEstoque)
    // console.log('todos registros', this.todosRegistros)
    // console.log('estoque', this.estoqueAtual)

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
          const adicionarData= moment(acumulador.dataRetirada).format('DD/MM/YYYY')
          acumulador.datasAcumuladas.push(adicionarData)
          acumulador.quantidadeAcumuladas= acumulador.quantidade
          acumulador.quantidadeDatas=1;
          listaRegistro.push(acumulador);
        }
      }else{
        const encontrado = listaRegistro.findIndex(e => e.nome === valorAtual.nome);
        if(encontrado !== -1){ // Se encontrou na lista
          const dataAtual = moment(valorAtual.dataRetirada).format()
          if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
            const cont = listaRegistro[encontrado].contador;
            listaRegistro[encontrado].contador = cont? cont+1 : cont;
            const adicionarData= moment(valorAtual.dataRetirada).format('DD/MM/YYYY')
            const existeData = listaRegistro[encontrado].datasAcumuladas.includes(adicionarData)
            !existeData ? listaRegistro[encontrado].datasAcumuladas.push(adicionarData) : null;
            const quantidadeAcumulada = listaRegistro[encontrado].quantidadeAcumuladas
            listaRegistro[encontrado].quantidadeAcumuladas = quantidadeAcumulada? quantidadeAcumulada+valorAtual.quantidade : quantidadeAcumulada;
            const quantidadeDatas = listaRegistro[encontrado].quantidadeDatas
            listaRegistro[encontrado].quantidadeDatas = !existeData  ? quantidadeDatas+1 : quantidadeDatas;
          }

        }else{ // Se NÃO encontrou na lista
          const dataAtual = moment(valorAtual.dataRetirada).format()
          if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
            valorAtual.contador=1;
            valorAtual.datasAcumuladas=[];
            const adicionarData= moment(valorAtual.dataRetirada).format('DD/MM/YYYY')
            valorAtual.datasAcumuladas.push(adicionarData)
            valorAtual.quantidadeAcumuladas= valorAtual.quantidade
            valorAtual.quantidadeDatas=1;
            listaRegistro.push(valorAtual);
          }

        }

      }
      return acumulador;
    })
    // console.log('respostaRegistro',respostaRegistro)
    console.log('listaRegistro',listaRegistro)
    const contagemRegistro:IRegistro[] =[];
    listaRegistro.forEach((e,i)=>{
      const contador = e.quantidadeDatas || 0 
      if( contador > 6 ){
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 14;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        e.mediaDiaria = mediaDiaria;
        e.periodoMaximo = periodoMaximo;
        e.retencao = retencao;
        e.quantidadeMaximaEstoque = quantidadeMaximaEstoque;
        e.quantidadeMinimaEstoque = quantidadeMinimaEstoque;
        e.quantidadeParaComprar = quantidadeParaComprar;
        contagemRegistro.push(e);
        return;
      }
      if( contador < 6 && contador > 3 ){
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 8;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        e.mediaDiaria = mediaDiaria;
        e.periodoMaximo = periodoMaximo;
        e.retencao = retencao;
        e.quantidadeMaximaEstoque = quantidadeMaximaEstoque;
        e.quantidadeMinimaEstoque = quantidadeMinimaEstoque;
        e.quantidadeParaComprar = quantidadeParaComprar;
        contagemRegistro.push(e);
        return;
      }
      if( contador < 3){
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 6;
        const retencao =7
        const quantidadeMaximaEstoque = mediaDiaria * periodoMaximo;
        const quantidadeMinimaEstoque = mediaDiaria * retencao;
        const quantidadeParaComprar = quantidadeMaximaEstoque - quantidadeMinimaEstoque;
        e.mediaDiaria = mediaDiaria;
        e.periodoMaximo = periodoMaximo;
        e.retencao = retencao;
        e.quantidadeMaximaEstoque = quantidadeMaximaEstoque;
        e.quantidadeMinimaEstoque = quantidadeMinimaEstoque;
        e.quantidadeParaComprar = quantidadeParaComprar;
        contagemRegistro.push(e);
        return;
      }
    })
    console.log('contagemRegistro', contagemRegistro)
    const produtosSugerir:IRegistro[]=[];
    contagemRegistro.forEach(produtoAtual  => {
      const existeProduto = this.produtosEstoque.find(e => e.descricaoProduto === produtoAtual.nome)
      console.log('exiteProduto', existeProduto)
      const quantidadeEmEstoque = existeProduto?.quantidade || 0;
      if(produtoAtual.quantidadeParaComprar < 1){
        produtoAtual.sugerir=false;
        produtoAtual.unidadeMedida=existeProduto?.unidadeMedida || '';
        produtosSugerir.push(produtoAtual);
        return;
      }
      if(quantidadeEmEstoque < produtoAtual.quantidadeMaximaEstoque ){
        produtoAtual.sugerir=true;
        produtoAtual.unidadeMedida=existeProduto?.unidadeMedida || '';
        produtosSugerir.push(produtoAtual);
        return
      }
    });

    console.log('produtosSugerir', produtosSugerir)
    this.produtos= produtosSugerir;
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
