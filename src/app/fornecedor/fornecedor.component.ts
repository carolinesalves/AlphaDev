import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IFornecedor } from '../model/Fornecedor'
import { FornecedorService } from '../service/fornecedor.service'
import { cnpj } from 'cpf-cnpj-validator';
import { ToastrService } from 'ngx-toastr';
import { DataTableConfig, DataTableItem } from '../componentes/tabela/tabela.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

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
  
  editar = false;
  id : any = null;
  name : any = null;

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
            observacao: item.observacao,
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
    if(!this.editar){
      this.fornecedorService.cadastrar(body).subscribe((data:IFornecedor)=>{
        this.alert.success('Fornecedor Cadastrado','Sucesso!')
        this.carregarTabela();
        this.novoCadastro();
      }, error =>{
        console.warn('error', error)
        this.alert.error('Tente novamente','Falha')
      })
    }else{
      this.fornecedorService.atualizar(this.id,body).subscribe((data:IFornecedor)=>{
        this.alert.success('Cadastro atualizado com sucesso!',)
        this.carregarTabela();
        this.novoCadastro();
      }, error =>{
        console.warn('error', error)
        this.alert.error('Tente novamente','Falha')
      })
    }
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

  novoCadastro():void{
    this.editar = false;
    this.id = null;
    this.formFornecedor.reset();
  }

  editarCadastro(event: any):void{
    console.log('editarCadastro',event )
    this.editar = true;
    this.id = event.id;
    this.formFornecedor.get('nomeFornecedor')?.setValue(event.NomeDoFornecedor)
    this.formFornecedor.get('cnpj')?.setValue(event.CNPJ)
    this.formFornecedor.get('inscricaoEsdadual')?.setValue(event.inscricaoEstadual)
    this.formFornecedor.get('observacao')?.setValue(event.observacao)
  }

  async apagarCadastro(event: any):Promise<void>{
    console.log('apagarCadastro',event)
    this.id = event.id;
    this.name = event.nomeFornecedor;
    const { value: response } = await this.confirmarExclusao();
    if (response) {
      this.alert.success('Cadastrado excluído com sucesso!',)
    }
    return;
  }

  async confirmarExclusao():Promise<SweetAlertResult>{
    return await Swal.fire({
      title: `Confirma a exclusão do fornecedor ${this.name}`,
      icon:'warning',
      showCancelButton: true,
      focusCancel: true,
      // width: 1000,
      preConfirm: () =>{
        this.excluir();
      },
     });
  }

  excluir():void{
    this.fornecedorService.excluir(this.id).subscribe((data)=>{
      console.log('Excluir', data)
      this.carregarTabela();
      this.novoCadastro();
    },error =>{
      this.alert.error('Por favor, atualize a página e tente novamente.', 'Erro!');
      console.info('error =>',error);
    });
  }

}
