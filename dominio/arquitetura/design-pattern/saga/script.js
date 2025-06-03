// Implementação do padrão Saga com efeitos visuais de transação
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const startSagaBtn = document.getElementById('start-saga');
    const startSagaFailPaymentBtn = document.getElementById('start-saga-fail-payment');
    const startSagaFailStockBtn = document.getElementById('start-saga-fail-stock');
    const startSagaFailDeliveryBtn = document.getElementById('start-saga-fail-delivery');
    const resetSagaBtn = document.getElementById('reset-saga');
    const sagaStatus = document.getElementById('saga-status').querySelector('p');
    
    // Etapas da Saga
    const criarPedidoStep = document.getElementById('criar-pedido');
    const processarPagamentoStep = document.getElementById('processar-pagamento');
    const verificarEstoqueStep = document.getElementById('verificar-estoque');
    const realizarEntregaStep = document.getElementById('realizar-entrega');
    
    // Estado da Saga
    let sagaEmExecucao = false;
    
    // Funções auxiliares para atualizar o estado visual
    function atualizarStatus(elemento, status, mensagem) {
        elemento.className = `step ${status}`;
        elemento.querySelector('p').textContent = `Status: ${mensagem}`;
    }
    
    function atualizarStatusGeral(mensagem) {
        sagaStatus.textContent = `Status Geral: ${mensagem}`;
    }
    
    // Função para criar efeito visual de transação
    function criarEfeitoTransacao(origem, destino, tipo = 'transaction') {
        const origemRect = origem.getBoundingClientRect();
        const destinoRect = destino.getBoundingClientRect();
        
        const efeitoDiv = document.createElement('div');
        efeitoDiv.className = `${tipo}-effect`;
        
        // Posicionar o efeito
        efeitoDiv.style.left = `${origemRect.right}px`;
        efeitoDiv.style.top = `${origemRect.top + origemRect.height / 2}px`;
        
        // Calcular a distância para a animação
        const distanciaX = destinoRect.left - origemRect.right;
        
        // Ajustar a animação com base na distância
        efeitoDiv.style.animation = `move${tipo === 'transaction' ? 'Transaction' : 'Compensation'} 1s linear forwards`;
        
        // Adicionar ao DOM
        document.body.appendChild(efeitoDiv);
        
        // Remover após a animação
        setTimeout(() => {
            efeitoDiv.remove();
        }, 1000);
    }
    
    // Resetar a Saga
    function resetarSaga() {
        atualizarStatus(criarPedidoStep, 'pending', 'Pendente');
        atualizarStatus(processarPagamentoStep, 'pending', 'Pendente');
        atualizarStatus(verificarEstoqueStep, 'pending', 'Pendente');
        atualizarStatus(realizarEntregaStep, 'pending', 'Pendente');
        atualizarStatusGeral('Pronto para iniciar');
        sagaEmExecucao = false;
        
        // Habilitar botões
        startSagaBtn.disabled = false;
        startSagaFailPaymentBtn.disabled = false;
        startSagaFailStockBtn.disabled = false;
        startSagaFailDeliveryBtn.disabled = false;
    }
    
    // Implementação das transações da Saga
    
    // 1. Criar Pedido
    function criarPedido() {
        return new Promise((resolve) => {
            atualizarStatus(criarPedidoStep, 'processing', 'Processando...');
            atualizarStatusGeral('Criando pedido...');
            
            setTimeout(() => {
                atualizarStatus(criarPedidoStep, 'success', 'Concluído');
                resolve();
            }, 1500);
        });
    }
    
    // 2. Processar Pagamento
    function processarPagamento(falhar = false) {
        return new Promise((resolve, reject) => {
            atualizarStatus(processarPagamentoStep, 'processing', 'Processando...');
            atualizarStatusGeral('Processando pagamento...');
            
            // Criar efeito visual de transação
            criarEfeitoTransacao(criarPedidoStep, processarPagamentoStep);
            
            setTimeout(() => {
                if (falhar) {
                    atualizarStatus(processarPagamentoStep, 'failed', 'Falha');
                    reject(new Error('Falha no processamento do pagamento'));
                } else {
                    atualizarStatus(processarPagamentoStep, 'success', 'Concluído');
                    resolve();
                }
            }, 2000);
        });
    }
    
    // 3. Verificar Estoque
    function verificarEstoque(falhar = false) {
        return new Promise((resolve, reject) => {
            atualizarStatus(verificarEstoqueStep, 'processing', 'Processando...');
            atualizarStatusGeral('Verificando disponibilidade no estoque...');
            
            // Criar efeito visual de transação
            criarEfeitoTransacao(processarPagamentoStep, verificarEstoqueStep);
            
            setTimeout(() => {
                if (falhar) {
                    atualizarStatus(verificarEstoqueStep, 'failed', 'Falha');
                    reject(new Error('Produto indisponível no estoque'));
                } else {
                    atualizarStatus(verificarEstoqueStep, 'success', 'Concluído');
                    resolve();
                }
            }, 2000);
        });
    }
    
    // 4. Realizar Entrega
    function realizarEntrega(falhar = false) {
        return new Promise((resolve, reject) => {
            atualizarStatus(realizarEntregaStep, 'processing', 'Processando...');
            atualizarStatusGeral('Preparando entrega...');
            
            // Criar efeito visual de transação
            criarEfeitoTransacao(verificarEstoqueStep, realizarEntregaStep);
            
            setTimeout(() => {
                if (falhar) {
                    atualizarStatus(realizarEntregaStep, 'failed', 'Falha');
                    reject(new Error('Falha na entrega do pedido'));
                } else {
                    atualizarStatus(realizarEntregaStep, 'success', 'Concluído');
                    resolve();
                }
            }, 2000);
        });
    }
    
    // Transações de compensação (rollback)
    
    // 4. Cancelar Entrega
    function cancelarEntrega() {
        return new Promise((resolve) => {
            atualizarStatus(realizarEntregaStep, 'compensating', 'Cancelando...');
            atualizarStatusGeral('Cancelando entrega...');
            
            // Criar efeito visual de compensação
            criarEfeitoTransacao(realizarEntregaStep, verificarEstoqueStep, 'compensation');
            
            setTimeout(() => {
                atualizarStatus(realizarEntregaStep, 'pending', 'Cancelado');
                resolve();
            }, 1500);
        });
    }
    
    // 3. Devolver ao Estoque
    function devolverAoEstoque() {
        return new Promise((resolve) => {
            atualizarStatus(verificarEstoqueStep, 'compensating', 'Devolvendo...');
            atualizarStatusGeral('Devolvendo item ao estoque...');
            
            // Criar efeito visual de compensação
            criarEfeitoTransacao(verificarEstoqueStep, processarPagamentoStep, 'compensation');
            
            setTimeout(() => {
                atualizarStatus(verificarEstoqueStep, 'pending', 'Devolvido');
                resolve();
            }, 1500);
        });
    }
    
    // 2. Estornar Pagamento
    function estornarPagamento() {
        return new Promise((resolve) => {
            atualizarStatus(processarPagamentoStep, 'compensating', 'Estornando...');
            atualizarStatusGeral('Estornando pagamento...');
            
            // Criar efeito visual de compensação
            criarEfeitoTransacao(processarPagamentoStep, criarPedidoStep, 'compensation');
            
            setTimeout(() => {
                atualizarStatus(processarPagamentoStep, 'pending', 'Estornado');
                resolve();
            }, 1500);
        });
    }
    
    // 1. Cancelar Pedido
    function cancelarPedido() {
        return new Promise((resolve) => {
            atualizarStatus(criarPedidoStep, 'compensating', 'Cancelando...');
            atualizarStatusGeral('Cancelando pedido...');
            
            setTimeout(() => {
                atualizarStatus(criarPedidoStep, 'pending', 'Cancelado');
                resolve();
            }, 1500);
        });
    }
    
    // Orquestrador da Saga - Fluxo de Sucesso
    async function executarSaga() {
        if (sagaEmExecucao) return;
        sagaEmExecucao = true;
        
        // Desabilitar botões durante a execução
        startSagaBtn.disabled = true;
        startSagaFailPaymentBtn.disabled = true;
        startSagaFailStockBtn.disabled = true;
        startSagaFailDeliveryBtn.disabled = true;
        
        try {
            await criarPedido();
            await processarPagamento();
            await verificarEstoque();
            await realizarEntrega();
            
            atualizarStatusGeral('Saga concluída com sucesso!');
        } catch (error) {
            atualizarStatusGeral(`Erro: ${error.message}. Iniciando compensação...`);
            
            // Não é necessário compensar neste fluxo de sucesso
        }
    }
    
    // Orquestrador da Saga - Falha no Pagamento
    async function executarSagaFalhaPagamento() {
        if (sagaEmExecucao) return;
        sagaEmExecucao = true;
        
        // Desabilitar botões durante a execução
        startSagaBtn.disabled = true;
        startSagaFailPaymentBtn.disabled = true;
        startSagaFailStockBtn.disabled = true;
        startSagaFailDeliveryBtn.disabled = true;
        
        try {
            await criarPedido();
            await processarPagamento(true); // Forçar falha
            await verificarEstoque();
            await realizarEntrega();
            
            atualizarStatusGeral('Saga concluída com sucesso!');
        } catch (error) {
            atualizarStatusGeral(`Erro: ${error.message}. Iniciando compensação...`);
            
            // Compensação em ordem reversa
            if (error.message.includes('pagamento')) {
                await cancelarPedido();
            }
            
            atualizarStatusGeral('Compensação concluída. Saga revertida.');
        }
    }
    
    // Orquestrador da Saga - Falha no Estoque
    async function executarSagaFalhaEstoque() {
        if (sagaEmExecucao) return;
        sagaEmExecucao = true;
        
        // Desabilitar botões durante a execução
        startSagaBtn.disabled = true;
        startSagaFailPaymentBtn.disabled = true;
        startSagaFailStockBtn.disabled = true;
        startSagaFailDeliveryBtn.disabled = true;
        
        try {
            await criarPedido();
            await processarPagamento();
            await verificarEstoque(true); // Forçar falha
            await realizarEntrega();
            
            atualizarStatusGeral('Saga concluída com sucesso!');
        } catch (error) {
            atualizarStatusGeral(`Erro: ${error.message}. Iniciando compensação...`);
            
            // Compensação em ordem reversa
            if (error.message.includes('estoque')) {
                await estornarPagamento();
                await cancelarPedido();
            }
            
            atualizarStatusGeral('Compensação concluída. Saga revertida.');
        }
    }
    
    // Orquestrador da Saga - Falha na Entrega
    async function executarSagaFalhaEntrega() {
        if (sagaEmExecucao) return;
        sagaEmExecucao = true;
        
        // Desabilitar botões durante a execução
        startSagaBtn.disabled = true;
        startSagaFailPaymentBtn.disabled = true;
        startSagaFailStockBtn.disabled = true;
        startSagaFailDeliveryBtn.disabled = true;
        
        try {
            await criarPedido();
            await processarPagamento();
            await verificarEstoque();
            await realizarEntrega(true); // Forçar falha
            
            atualizarStatusGeral('Saga concluída com sucesso!');
        } catch (error) {
            atualizarStatusGeral(`Erro: ${error.message}. Iniciando compensação...`);
            
            // Compensação em ordem reversa
            if (error.message.includes('entrega')) {
                await devolverAoEstoque();
                await estornarPagamento();
                await cancelarPedido();
            }
            
            atualizarStatusGeral('Compensação concluída. Saga revertida.');
        }
    }
    
    // Event Listeners
    startSagaBtn.addEventListener('click', executarSaga);
    startSagaFailPaymentBtn.addEventListener('click', executarSagaFalhaPagamento);
    startSagaFailStockBtn.addEventListener('click', executarSagaFalhaEstoque);
    startSagaFailDeliveryBtn.addEventListener('click', executarSagaFalhaEntrega);
    resetSagaBtn.addEventListener('click', resetarSaga);
});
