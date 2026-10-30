import { PedidoBuilder } from "./builder/PedidoBuilder";
import { StatusPedido, TipoBebida } from "./types";
import { obterBarista } from "./factory/Barista";
import {
  LeiteDecorator,
  ChantillyDecorator,
  CarameloDecorator,
} from "./decorator/extras";
import { Atendente } from "./command/Atendente";
import { AdicionarItemCommand, RemoverItemCommand } from "./command/comandos";
import { Caixa } from "./strategy/Caixa";
import { PagamentoPix, PagamentoCartao } from "./strategy/estrategias";
import {
  PainelCozinha,
  NotificacaoCliente,
  RegistroLog,
} from "./observer/observadores";

function titulo(texto: string): void {
  console.log(`\n=== ${texto} ===`);
}

// ------------------------------------------------------------
// 1. BUILDER: montar o pedido com campos opcionais
// ------------------------------------------------------------
titulo("1. Builder: criando o pedido");
const pedido = new PedidoBuilder("Ana")
  .comObservacao("Sem açúcar")
  .paraEntrega("Rua das Flores, 123")
  .build();
console.log(`Pedido de ${pedido.cliente} criado (entrega: ${pedido.entrega})`);

// ------------------------------------------------------------
// 2. OBSERVER: inscrever cozinha, cliente e log no pedido
// ------------------------------------------------------------
titulo("2. Observer: inscrevendo interessados");
const log = new RegistroLog();
pedido.inscrever(new PainelCozinha());
pedido.inscrever(new NotificacaoCliente());
pedido.inscrever(log);
console.log("Cozinha, cliente e log inscritos.");

// ------------------------------------------------------------
// 3. FACTORY METHOD + DECORATOR: criar e personalizar bebidas
// ------------------------------------------------------------
titulo("3. Factory Method + Decorator: preparando bebidas");
const espresso = obterBarista(TipoBebida.ESPRESSO).preparar();
const cappuccino = new CarameloDecorator(
  new ChantillyDecorator(
    new LeiteDecorator(obterBarista(TipoBebida.CAPPUCCINO).preparar())
  )
);
const cha = obterBarista(TipoBebida.CHA).preparar();

// ------------------------------------------------------------
// 4. COMMAND: adicionar itens e desfazer
// ------------------------------------------------------------
titulo("4. Command: adicionando itens ao pedido");
const atendente = new Atendente();
atendente.executar(new AdicionarItemCommand(pedido, espresso));
atendente.executar(new AdicionarItemCommand(pedido, cappuccino));
atendente.executar(new AdicionarItemCommand(pedido, cha));
console.log(`Total parcial: R$ ${pedido.total.toFixed(2)}`);

console.log("\nA cliente desistiu do chá:");
atendente.desfazer();
console.log(`Total parcial: R$ ${pedido.total.toFixed(2)}`);

console.log("\nMas tirou o espresso também, e depois se arrependeu:");
atendente.executar(new RemoverItemCommand(pedido, 1));
atendente.desfazer();

console.log("\nItens finais do pedido:");
for (const item of pedido.itens) {
  console.log(
    `  #${item.id} ${item.bebida.getDescricao()} - R$ ${item.bebida
      .getPreco()
      .toFixed(2)}`
  );
}
console.log(`Total: R$ ${pedido.total.toFixed(2)}`);

// ------------------------------------------------------------
// 5. STRATEGY: pagar com PIX e comparar com cartão
// ------------------------------------------------------------
titulo("5. Strategy: pagamento");
const caixa = new Caixa(new PagamentoPix());
console.log(caixa.processar(pedido.total));

caixa.setEstrategia(new PagamentoCartao());
console.log("Se fosse no cartão:", caixa.processar(pedido.total).descricao);

caixa.setEstrategia(new PagamentoPix());
const pagamento = caixa.processar(pedido.total);
console.log(`Pago via ${pagamento.forma}: R$ ${pagamento.valorFinal.toFixed(2)}`);

// ------------------------------------------------------------
// 6. OBSERVER (de novo): ciclo de vida do pedido
// ------------------------------------------------------------
titulo("6. Observer: mudanças de status");
pedido.mudarStatus(StatusPedido.EM_PREPARO);
pedido.mudarStatus(StatusPedido.PRONTO);
pedido.mudarStatus(StatusPedido.ENTREGUE);

console.log(`\nEventos registrados no log: ${log.total}`);
console.log("Fim da demonstração.");