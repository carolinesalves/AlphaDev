export interface IRegistro{
  id?: number,
  nome: string,
  quantidade: number,
  dataRetirada: string,
  contador?: number,
  datasAcumuladas?: any,
  quantidadeAcumuladas?: any,
}