import { StatusPedido } from "../types";
import { EventoPedido, ObservadorPedido } from "./Observador";

/** Cozinha: só se interessa quando o pedido entra em preparo. */
export class PainelCozinha implements ObservadorPedido {
  atualizar(evento: EventoPedido): void {
    if (evento.statusAtual === StatusPedido.EM_PREPARO) {
      console.log(`[COZINHA] Preparar pedido de ${evento.cliente}`);
    }
  }
}

/** Cliente: recebe aviso de toda mudança de status. */
export class NotificacaoCliente implements ObservadorPedido {
  atualizar(evento: EventoPedido): void {
    console.log(
      `[CLIENTE ${evento.cliente}] Pedido: ${evento.statusAnterior} -> ${evento.statusAtual}`
    );
  }
}

/** Registro de log: guarda o histórico de eventos em memória. */
export class RegistroLog implements ObservadorPedido {
  private readonly eventos: EventoPedido[] = [];

  atualizar(evento: EventoPedido): void {
    this.eventos.push(evento);
  }

  get total(): number {
    return this.eventos.length;
  }
}