import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-tabela-paginacao',
  templateUrl: './tabela-paginacao.component.html',
  styleUrls: ['./tabela-paginacao.component.css']
})
export class TabelaPaginacaoComponent implements OnInit {
  
  @Output() pageChange = new EventEmitter();
  @Input() page = 1;
  @Input() perPage = 10;
  @Input() collectionSize: number;

  constructor() { }

  ngOnInit(): void {
  }

}
