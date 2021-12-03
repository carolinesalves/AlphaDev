import { IProduto } from './Produto';
import { IFornecedor } from './Fornecedor';
export interface IPedido {
  id?:number,
  produto?: number | IProduto | [IProduto] | any,
  fornecedor?: number | IFornecedor | [IFornecedor] | any,
  quantidade?: number | string,
  unidadeMedida?: string,
  isEditable?: boolean;
  isDeletable?: boolean;
  isViewItem?: boolean;
  isVideoTest?: boolean;
  isActivatable?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  showStatus?: boolean;
  enableAgenda?: boolean;
  unidade?:string
}