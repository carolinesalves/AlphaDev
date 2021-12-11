import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../service/registro.service';
import { IRegistro } from '../model/registro';
import { EstoqueService } from '../service/estoque.service';
import { ProdutoService } from '../service/produto.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment/moment';
moment.locale('pt-br');

interface IExibirSugestao {id:string, nome:string, quantidade:string, unidadeMedida:string}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  produtosEstoque:any[] =[]
  registroDeProdutos:IRegistro[] =[]
  produtos: {id:string, nome:string, quantidade:string, unidadeMedida:string}[]=[]
  

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
  }

  sugerirCompra(registros:IRegistro[]):void{
    console.log('estoque', this.produtosEstoque)
    console.log('registros', registros)
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
    // console.log('listaRegistro',listaRegistro)
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
    // console.log('contagemRegistro', contagemRegistro)
    const produtosSugerir:IRegistro[]=[];
    contagemRegistro.forEach(produtoAtual  => {
      const existeProduto = this.produtosEstoque.find(e => e.descricaoProduto === produtoAtual.nome)
      const quantidadeEmEstoque = existeProduto?.quantidade || 0;
      // if(produtoAtual.quantidadeParaComprar < 1){
      //   produtoAtual.sugerir=false;
      //   produtoAtual.unidadeMedida=existeProduto?.unidadeMedida || '';
      //   produtosSugerir.push(produtoAtual);
      //   return;
      // }
      if(quantidadeEmEstoque < produtoAtual.quantidadeMaximaEstoque || quantidadeEmEstoque < produtoAtual.quantidadeMinimaEstoque){
        produtoAtual.sugerir=true;
        produtoAtual.quantidade = produtoAtual.quantidadeMaximaEstoque - quantidadeEmEstoque
        produtoAtual.unidadeMedida=existeProduto?.unidadeMedida || '';
        produtosSugerir.push(produtoAtual);
        return;
      }
    });
    // console.log('produtosSugerir',produtosSugerir)

    produtosSugerir.forEach(item =>{
      if(item.sugerir){
        let cont=0;
        const produto :IExibirSugestao={
          id: String(cont+1),
          nome: item.nome,
          quantidade: item.quantidadeParaComprar,
          unidadeMedida: item.unidadeMedida ? item.unidadeMedida : '',
        }
        this.produtos.push(produto)
      }
    })
    // console.log('this.produtos',this.produtos)
    
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
