// ============================================================
// Tipos base compartilhados por todos os padrões
// ============================================================

/** Tipos de bebida base que a fábrica sabe criar (Factory Method). */
export enum TipoBebida {
  ESPRESSO = "ESPRESSO",
  CAPPUCCINO = "CAPPUCCINO",
  CHA = "CHA",
}

/** Ciclo de vida de um pedido (usado pelo Observer). */
export enum StatusPedido {
  CRIADO = "CRIADO",
  EM_PREPARO = "EM_PREPARO",
  PRONTO = "PRONTO",
  ENTREGUE = "ENTREGUE",
  CANCELADO = "CANCELADO",
}

/** Formas de pagamento aceitas (Strategy). */
export type FormaPagamento = "PIX" | "CARTAO" | "CUPOM";

/** Contrato comum de qualquer bebida (Factory Method + Decorator). */
export interface Bebida {
  getDescricao(): string;
  getPreco(): number;
}

/** Um item do pedido: uma bebida (já decorada) com identificador. */
export interface ItemPedido {
  readonly id: number;
  readonly bebida: Bebida;
}

/** Dados que o cliente pode informar ao montar um pedido (Builder). */
export interface DadosPedido {
  cliente: string;
  observacao: string;
  entrega: boolean;
  enderecoEntrega: string;
}

/** Preço base de cada bebida, tipado para exigir TODOS os tipos do enum. */
export const PRECO_BASE: Record<TipoBebida, number> = {
  [TipoBebida.ESPRESSO]: 5.0,
  [TipoBebida.CAPPUCCINO]: 8.0,
  [TipoBebida.CHA]: 4.5,
};

/** Resultado de um pagamento processado (Strategy). */
export type ResultadoPagamento = Readonly<{
  forma: FormaPagamento;
  valorOriginal: number;
  valorFinal: number;
  descricao: string;
}>;