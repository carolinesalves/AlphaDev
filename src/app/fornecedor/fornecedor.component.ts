import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IFornecedor } from '../model/Fornecedor'
import { FornecedorService } from '../service/fornecedor.service'
import { cnpj } from 'cpf-cnpj-validator';
import { ToastrService } from 'ngx-toastr';
import { DataTableConfig, DataTableItem } from '../componentes/tabela/tabela.component';
@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {
  formFornecedor : FormGroup;
  formFields : Record<string, unknown> ={
    nomeFornecedor: [null,Validators.required],
    cnpj:[null,Validators.required],
    inscricaoEsdadual:[null],
    observacao:[null],
  }

  cabecalhoTabela: DataTableConfig;
  dadosTabela: DataTableItem[];

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private alert : ToastrService,
  ) { 
    this.formFornecedor = this.fb.group(this.formFields)
  }

  ngOnInit(): void {
    this.validarCampoCnpj()
    this.carregarTabela()
  }

  carregarTabela():void{
    this.fornecedorService.buscarTodosFornecedor().subscribe((data)=>{
      console.log('Fornecedores', data)
      const items=[];
      if(Array.isArray(data) && data.length){
        for (const item of data) {
          const usuario ={
            id: item.id,
            NomeDoFornecedor: item.nomeFornecedor,
            CNPJ: item.cnpj,
            inscricaoEstadual: item.inscricaoEstadual,
            isEditable:true,
            isDeletable:true,
          }
          items.push(usuario)
        }
        items.sort((a,b)=>{
          return new Intl.Collator().compare(a.NomeDoFornecedor, b.NomeDoFornecedor);
        });
        this.dadosTabela = DataTableItem.collection(items);
      }
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
    
    this.cabecalhoTabela = DataTableConfig.default([
      {
        var: 'id',
        label: 'N*',
        type: 'text'
      },
      {
        var: 'NomeDoFornecedor',
        label: 'Nome do fornecedor',
        type: 'text'
      },
      {
        var: 'CNPJ',
        label: 'CNPJ',
        type: 'text'
      },
      {
        var: 'inscricaoEstadual',
        label: 'Inscrição estadual',
        type: 'text'
      }
      
    ], 'id');
    this.cabecalhoTabela.isEditable = true;
    this.cabecalhoTabela.isDeletable = true;
  }

  cadastrar(): void{
    const body:IFornecedor  = Object.assign({}, this.formFornecedor.value)
    if(!this.validarCNPJ(body.cnpj)){
      return
    }
    this.fornecedorService.cadastrar(body).subscribe((data:IFornecedor)=>{
      this.formFornecedor.reset()
      this.alert.success('Fornecedor Cadastrado','Sucesso!')
    }, error =>{
      console.warn('error', error)
      this.alert.error('Tente novamente','Falha')
    })
  }

  validarCNPJ(cnpjData:string): boolean{
    const cnpjValid = cnpj.isValid(cnpjData)
    if(!cnpjValid){
      this.alert.error('CNPJ Inválido', 'Erro')
      return false;
    }
    return true;
  }

  validarCampoCnpj(){
    this.formFornecedor.get('cnpj')?.valueChanges.subscribe(cnpj =>{
      if(cnpj.length === 14){
        this.validarCNPJ(cnpj)
        return
      }
    })
  }

  editarCadastro(event: Event):void{
    console.log('editarCadastro',event )
  }

  apagarCadastro(event: Event):void{
    console.log('apagarCadastro',event)
  }

}
