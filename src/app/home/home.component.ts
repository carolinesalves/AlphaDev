import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../service/registro.service';
import { IRegistro } from '../model/registro';
import { EstoqueService } from '../service/estoque.service';
import { ProdutoService } from '../service/produto.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment/moment';
moment.locale('pt-br');

interface IExibirSugestao {id:number, nome:string, quantidade:string, unidadeMedida:string}
interface IEstoque {
  id ?: number,
  descricaoProduto ?: string
  quantidade?: string | number,
  unidadeMedida?: string
  qtdminima?: string | number,
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  produtosEstoque:IEstoque[] =[]
  registroDeProdutos:IRegistro[] =[]
  produtos: {id:number, nome:string, quantidade:string, unidadeMedida:string}[]=[]
  count = 0;

  constructor(private registroService: RegistroService,
    private estoqueService : EstoqueService,
    private produtoService : ProdutoService,
    private alert : ToastrService,


    ) { }

  ngOnInit(): void {
    this.buscarEstoque();
    this.registroService.receberRegistro().subscribe((registros)=>{
      console.log('registros', registros)
      setTimeout(() => {
        this.sugerirCompra(registros);
      }, 500);
    })
  }

  sugerirCompra(registros:IRegistro[]):void{
    // console.log('registros', registros)
    const listaRegistro:IRegistro[]=[];
    const hoje = moment(new Date()).format()
    // const dataInicio = moment(new Date()).subtract(15,'days').format();
    const mesPassado = moment(new Date()).subtract(1,'months').format();

    const respostaRegistro =  registros.reduce((acumulador, valorAtual, index, array)=>{
      acumulador.quantidade || 0;
      valorAtual.quantidade || 0;
      if(listaRegistro.length === 0){ // Se a lista estiver vazia
        acumulador.contador=1;
        acumulador.datasAcumuladas=[];
        const dataAtual = moment(acumulador.dataRetirada).format()
        if(moment(dataAtual).isSameOrAfter(mesPassado) && moment(dataAtual).isSameOrBefore(hoje)){
          const adicionarData= moment(acumulador.dataRetirada).format('DD/MM/YYYY')
          acumulador.datasAcumuladas.push(adicionarData)
          acumulador.quantidadeAcumuladas= acumulador.quantidade || 0;
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
        const retencao = 7
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
        const periodoMaximo = 12;
        const retencao = 3
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
      if( contador <= 3){
        const mediaDiaria = Math.trunc(e.quantidadeAcumuladas/contador);
        const periodoMaximo = 6;
        const retencao =1
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
    // console.log('estoque', this.produtosEstoque)
    contagemRegistro.forEach(produtoAtual  => {
      // console.log('produtoAtual.nome', produtoAtual.nome)
      const existeProduto = this.produtosEstoque.find(e => e.descricaoProduto === produtoAtual.nome)
      // console.log('existeProduto' ,existeProduto)
      if(existeProduto){
        const quantidadeEmEstoque = existeProduto.quantidade ? existeProduto.quantidade : 0;
        // console.log("produtoAtual.quantidadeParaComprar", produtoAtual.quantidadeParaComprar)
        console.log("produtoAtual", produtoAtual)
        console.log('existeProdutoEstoque' ,existeProduto)

        // if(produtoAtual.quantidadeParaComprar < 1){
        //   if(quantidadeEmEstoque < produtoAtual.quantidadeMinimaEstoque){
        //     produtoAtual.sugerir=true;
        //     produtoAtual.comprar = produtoAtual.mediaDiaria
        //     produtoAtual.unidadeMedida= existeProduto.unidadeMedida;
        //     produtosSugerir.push(produtoAtual);
        //     return;
        //   }else{
        //     produtoAtual.sugerir=false;
        //     produtoAtual.unidadeMedida=existeProduto?.unidadeMedida || '';
        //     produtosSugerir.push(produtoAtual);
        //     return;
        //   }
        // }
        if(quantidadeEmEstoque >= produtoAtual.quantidadeMaximaEstoque){
          produtoAtual.sugerir=false;
          produtoAtual.comprar = produtoAtual.quantidadeParaComprar
          produtoAtual.unidadeMedida= existeProduto.unidadeMedida;
          produtosSugerir.push(produtoAtual);
          return;
        }
        if(quantidadeEmEstoque < produtoAtual.quantidadeMaximaEstoque){
          const diariaEmEstoque = Math.trunc(parseInt(String(quantidadeEmEstoque))/produtoAtual.mediaDiaria)
          console.log('diariaEmEstoque', diariaEmEstoque)
          if( diariaEmEstoque < produtoAtual.periodoMaximo){
            produtoAtual.sugerir=true;
            produtoAtual.comprar = produtoAtual.quantidadeParaComprar
            produtoAtual.unidadeMedida= existeProduto.unidadeMedida;
            produtosSugerir.push(produtoAtual);
            return;
          }else{
            produtoAtual.sugerir=false;
            produtoAtual.comprar = produtoAtual.quantidadeParaComprar
            produtoAtual.unidadeMedida= existeProduto.unidadeMedida;
            produtosSugerir.push(produtoAtual);
            return;
          }
        }else{
          produtoAtual.sugerir=false;
          produtoAtual.comprar = produtoAtual.quantidadeParaComprar
          produtoAtual.unidadeMedida= existeProduto.unidadeMedida;
          produtosSugerir.push(produtoAtual);
          return;
        }
        
      }
    });
    // console.log('produtosSugerir',produtosSugerir)

    produtosSugerir.forEach((item, index) =>{
      if(item.sugerir){
        const produto :IExibirSugestao={
          id: this.count+=1,
          nome: item.nome,
          quantidade: String(item.comprar),
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
            const item: IEstoque ={
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
