import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../service/registro.service';
import { IRegistro } from '../model/registro';
import { EstoqueService } from '../service/estoque.service';
import { ProdutoService } from '../service/produto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  produtos: {id:string, nome:string, quantidade:string, unidadeMedida:string}[]=[]
  produtosEstoque:any[] =[]
  registroDeProdutos:IRegistro[] =[]


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

  sugerirCompra(registros:[any]):void{
    this.registroDeProdutos= registros;
    console.log('registros', this.registroDeProdutos)
    console.log('lista de produtos ', this.produtosEstoque)

    const respostaRegistro =  registros.reduce((soma, cur) =>{
      let nome = cur.nome;
      let repetido = soma.find((elem: any) => elem.nome === nome)
      if(!repetido){
        soma[cur]['total']=1;
        // repetido['total']+= cur.quantidade; 
      }else{
        // soma.push(cur)
        soma[cur]['total']++;
      }
      return soma;
    },[])
    
    // const respostaRegistro =  registros.reduce(function( object , item ){  
    //   console.log( object , item ); 
    //   if ( !object[item].nome ) {
    //      object[item].nome=1;
    //   } else {
    //      object[item].nome++;
    //   }
    //   return object; 
    // },{}) 

    console.log('respostaRegistro',respostaRegistro)
  }

  buscarEstoque(){
    this.estoqueService.buscarEstoque().subscribe((data)=>{
      console.log('estoque', data)
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
