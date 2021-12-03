export interface IPedido {
  id?:number,
  produto?: number,
  fornecedor?: number | any,
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
}