import { StatusPedido } from "../types";

/** Observer: contrato de quem quer ser avisado de mudanças de status. */
export interface ObservadorPedido {
  atualizar(evento: EventoPedido): void;
}

/** Dados enviados a cada notificação (imutável). */
export type EventoPedido = Readonly<{
  cliente: string;
  statusAnterior: StatusPedido;
  statusAtual: StatusPedido;
}>;