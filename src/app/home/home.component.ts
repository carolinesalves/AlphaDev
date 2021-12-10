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

  todosRegistros= [
    {
        "id": 1,
        "nome": "Queijo",
        "quantidade": 2,
        "dataRetirada": "2021/12/10 15:51:06"
    },
    {
        "id": 2,
        "nome": "Salmão ",
        "quantidade": 12,
        "dataRetirada": "2021/12/09 23:45:18"
    },
    {
        "id": 3,
        "nome": "Arroz",
        "quantidade": 22,
        "dataRetirada": "2021/12/09 23:45:18"
    },
    {
        "id": 4,
        "nome": "Arroz",
        "quantidade": 22,
        "dataRetirada": "2021/11/01 23:45:18"
    },
    {
        "id": 6,
        "nome": "Arroz",
        "quantidade": 12,
        "dataRetirada": "2021/11/01 23:45:18"
    },
    {
        "id": 7,
        "nome": "Frango",
        "quantidade": 1,
        "dataRetirada": "2021/10/01 23:45:18"
    },
    {
        "id": 8,
        "nome": "Frango",
        "quantidade": 24,
        "dataRetirada": "2021/08/01 23:45:18"
    },
    {
        "id": 9,
        "nome": "Frango",
        "quantidade": 3,
        "dataRetirada": "2021/07/01 23:45:18"
    },
    {
        "id": 10,
        "nome": "Frango",
        "quantidade": 21,
        "dataRetirada": "2021/07/17 23:45:18"
    },
    {
        "id": 11,
        "nome": "Alga",
        "quantidade": 1,
        "dataRetirada": "2021/06/13 23:45:18"
    },
    {
        "id": 12,
        "nome": "Alga",
        "quantidade": 2,
        "dataRetirada": "2021/10/23 23:45:18"
    },
    {
        "id": 13,
        "nome": "Alga",
        "quantidade": 32,
        "dataRetirada": "2021/10/23 23:45:18"
    },
    {
        "id": 14,
        "nome": "Alga",
        "quantidade": 42,
        "dataRetirada": "2021/10/22 23:45:18"
    },
    {
        "id": 15,
        "nome": "Alga",
        "quantidade": 25,
        "dataRetirada": "2021/10/20 23:45:18"
    },
    {
        "id": 16,
        "nome": "Vinagre",
        "quantidade": 32,
        "dataRetirada": "2021/10/22 23:45:18"
    },
    {
        "id": 17,
        "nome": "Vinagre",
        "quantidade": 12,
        "dataRetirada": "2021/09/28 23:45:18"
    },
    {
        "id": 18,
        "nome": "Pimentão",
        "quantidade": 12,
        "dataRetirada": "2021/09/31 23:45:18"
    },
    {
        "id": 19,
        "nome": "Pimentão",
        "quantidade": 2,
        "dataRetirada": "2021/09/05 23:45:18"
    },
    {
        "id": 20,
        "nome": "Pimentão",
        "quantidade": 2,
        "dataRetirada": "2021/09/04 23:45:18"
    },
    {
        "id": 21,
        "nome": "Tilápia",
        "quantidade": 3,
        "dataRetirada": "2021/10/03 23:45:18"
    },
    {
        "id": 22,
        "nome": "Tilápia",
        "quantidade": 4,
        "dataRetirada": "2021/11/08 23:45:18"
    },
    {
        "id": 23,
        "nome": "Salmão",
        "quantidade": 25,
        "dataRetirada": "2021/11/02 23:45:18"
    },
    {
        "id": 24,
        "nome": "Salmão",
        "quantidade": 5,
        "dataRetirada": "2021/11/11 23:45:18"
    },
    {
        "id": 25,
        "nome": "Hashi",
        "quantidade": 6,
        "dataRetirada": "2021/11/23 23:45:18"
    },
    {
        "id": 26,
        "nome": "Hashi",
        "quantidade": 8,
        "dataRetirada": "2021/11/22 23:45:18"
    },
    {
        "id": 27,
        "nome": "Cebola",
        "quantidade": 4,
        "dataRetirada": "2021/08/11 23:45:18"
    },
    {
        "id": 28,
        "nome": "Cebola",
        "quantidade": 2,
        "dataRetirada": "2021/08/05 23:45:18"
    },
    {
        "id": 29,
        "nome": "Cebola",
        "quantidade": 1,
        "dataRetirada": "2021/09/01 23:45:18"
    },
    {
        "id": 30,
        "nome": "Arroz",
        "quantidade": 5,
        "dataRetirada": "2021/11/02 23:45:18"
    },
    {
        "id": 5,
        "nome": "Vinagre",
        "quantidade": 2,
        "dataRetirada": "2021/12/10 14:08:26"
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

  sugerirCompra(registros:[IRegistro]):void{
    this.registroDeProdutos= registros;
    // console.log('registros', this.registroDeProdutos)
    // console.log('lista de produtos ', this.produtosEstoque)
    console.log('todos registros', this.todosRegistros)

    const respostaRegistro =  registros.reduce((registro:any, index)=>{
      let nome = index.nome;
      let repetido:IRegistro = registro.find((elem:IRegistro)=> elem.nome === nome);
      if(repetido){
        repetido.quantidade +=index.quantidade;
      }else{
        registros.push(index)
      }
    }, []);
    
    // const respostaRegistro =  registros.reduce(function( object , item ){  
    //   console.log( object , item ); 
    //   if ( !object[item].nome ) {
    //      object[item].nome=1;
    //   } else {
    //      object[item].nome++;
    //   }
    //   return object; 
    // },{}) 

    // respostaRegistro.forEach((element:any) => {
    //     console.log('iten', element)
    // });

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
