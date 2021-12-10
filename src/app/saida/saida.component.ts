import { EstoqueService } from './../service/estoque.service';
import { IPedido } from './../model/Pedido';
import { ProdutoService } from './../service/produto.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.component.html',
  styleUrls: ['./saida.component.css']
})
export class SaidaComponent implements OnInit {
  formSaida : FormGroup;
  formFields : Record<string, unknown> ={
    descricaoProduto: [null],
    quantidade:[null],
  }

  dropdownSettingsSigle: any = {};
  dropdownSettingsMulti: any = {};
  closeDropdownSelection=false;

  listaProduto:{id:any, text:string}[]=[]

  constructor(
    private fb: FormBuilder,
    private alert : ToastrService,
    private produtoService : ProdutoService,
    private estoqueService : EstoqueService,

  )

  { 
    this.formSaida = this.fb.group(this.formFields)
  }

  ngOnInit(): void {
    this.configuracaoDoCampoSelect()
    this.buscarTodosProdutos();
  }

  tratarCampos():IPedido{
    const form = this.formSaida.getRawValue()
    const body :IPedido ={
      id: form.descricaoProduto && form.descricaoProduto.length ? form.descricaoProduto[0].id :'',
      nomeProduto: form.descricaoProduto && form.descricaoProduto.length ? form.descricaoProduto[0].text :'',
      quantidade: form.quantidade ?? 0,
    }
    return body;
  }

  retirar(): void{
    const body = this.tratarCampos();
    this.estoqueService.saidaEstoque(`${body.id}`, body).subscribe((data)=>{
      this.alert.success('Produto Retirado','Sucesso!')
      this.formSaida.reset();
      this.formSaida.get('descricaoProduto')?.setValue({})
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

  buscarTodosProdutos(){
    this.produtoService.buscarTodosProdutos().subscribe((data)=>{
      if(data.length){
        data.forEach(produto => {
          if(produto && produto.nome){
            const lista: {id:any, text:string} ={
              id: produto.id,
              text: produto.nome
            }
            this.listaProduto.push(lista);
          }
        })

      }
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

  configuracaoDoCampoSelect(){
    this.dropdownSettingsSigle = {
      singleSelection: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: this.closeDropdownSelection
    };
    this.dropdownSettingsMulti = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: this.closeDropdownSelection
    };
  }

}
