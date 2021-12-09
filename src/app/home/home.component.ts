import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../service/registro.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  produtos: {id:string, nome:string, quantidade:string, unidadeMedida:string}[]=[]
  constructor(private registroService: RegistroService) { }

  ngOnInit(): void {
    this.registroService.receberRegistro().subscribe((data)=>{
      console.log('data', data)
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


}
