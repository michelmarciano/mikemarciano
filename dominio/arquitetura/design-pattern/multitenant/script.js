// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const tenant1 = document.getElementById('tenant-1');
    const tenant2 = document.getElementById('tenant-2');
    const database1 = document.getElementById('database-1');
    const database2 = document.getElementById('database-2');
    const resetBtn = document.getElementById('reset-btn');
    const infoContent = document.getElementById('info-content');
    const architectureContainer = document.querySelector('.architecture-container');
    
    // Criar conexões entre camadas
    createConnections();
    
    // Adicionar event listeners
    tenant1.addEventListener('click', () => highlightTenant(1));
    tenant2.addEventListener('click', () => highlightTenant(2));
    database1.addEventListener('click', () => highlightDatabase(1));
    database2.addEventListener('click', () => highlightDatabase(2));
    resetBtn.addEventListener('click', resetVisualization);
    
    // Função para criar conexões visuais entre camadas
    function createConnections() {
        // Conexão entre tenant 1 e serviço
        const t1ToService = document.createElement('div');
        t1ToService.className = 'connection connection-vertical tenant-1-connection';
        t1ToService.id = 'conn-t1-service';
        architectureContainer.appendChild(t1ToService);
        
        // Conexão entre tenant 2 e serviço
        const t2ToService = document.createElement('div');
        t2ToService.className = 'connection connection-vertical tenant-2-connection';
        t2ToService.id = 'conn-t2-service';
        architectureContainer.appendChild(t2ToService);
        
        // Conexão entre serviço e database 1
        const serviceToDb1 = document.createElement('div');
        serviceToDb1.className = 'connection connection-vertical tenant-1-connection';
        serviceToDb1.id = 'conn-service-db1';
        architectureContainer.appendChild(serviceToDb1);
        
        // Conexão entre serviço e database 2
        const serviceToDb2 = document.createElement('div');
        serviceToDb2.className = 'connection connection-vertical tenant-2-connection';
        serviceToDb2.id = 'conn-service-db2';
        architectureContainer.appendChild(serviceToDb2);
        
        // Posicionar conexões após renderização completa
        setTimeout(positionConnections, 100);
        
        // Reposicionar conexões quando a janela for redimensionada
        window.addEventListener('resize', positionConnections);
    }
    
    // Função para posicionar conexões com base na posição dos elementos
    function positionConnections() {
        // Obter posições dos elementos
        const t1Rect = tenant1.getBoundingClientRect();
        const t2Rect = tenant2.getBoundingClientRect();
        const serviceRect = document.querySelector('.service-box').getBoundingClientRect();
        const db1Rect = database1.getBoundingClientRect();
        const db2Rect = database2.getBoundingClientRect();
        const containerRect = architectureContainer.getBoundingClientRect();
        
        // Ajustar posições relativas ao container
        const t1Left = t1Rect.left + t1Rect.width / 2 - containerRect.left;
        const t2Left = t2Rect.left + t2Rect.width / 2 - containerRect.left;
        const serviceLeft = serviceRect.left + serviceRect.width / 2 - containerRect.left;
        const db1Left = db1Rect.left + db1Rect.width / 2 - containerRect.left;
        const db2Left = db2Rect.left + db2Rect.width / 2 - containerRect.left;
        
        // Posicionar conexão tenant 1 -> serviço
        const connT1Service = document.getElementById('conn-t1-service');
        connT1Service.style.left = `${t1Left}px`;
        connT1Service.style.top = `${t1Rect.bottom - containerRect.top}px`;
        connT1Service.style.height = `${serviceRect.top - t1Rect.bottom}px`;
        
        // Posicionar conexão tenant 2 -> serviço
        const connT2Service = document.getElementById('conn-t2-service');
        connT2Service.style.left = `${t2Left}px`;
        connT2Service.style.top = `${t2Rect.bottom - containerRect.top}px`;
        connT2Service.style.height = `${serviceRect.top - t2Rect.bottom}px`;
        
        // Posicionar conexão serviço -> database 1
        const connServiceDb1 = document.getElementById('conn-service-db1');
        connServiceDb1.style.left = `${db1Left}px`;
        connServiceDb1.style.top = `${serviceRect.bottom - containerRect.top}px`;
        connServiceDb1.style.height = `${db1Rect.top - serviceRect.bottom}px`;
        
        // Posicionar conexão serviço -> database 2
        const connServiceDb2 = document.getElementById('conn-service-db2');
        connServiceDb2.style.left = `${db2Left}px`;
        connServiceDb2.style.top = `${serviceRect.bottom - containerRect.top}px`;
        connServiceDb2.style.height = `${db2Rect.top - serviceRect.bottom}px`;
    }
    
    // Função para destacar tenant e suas conexões
    function highlightTenant(tenantId) {
        resetVisualization();
        
        if (tenantId === 1) {
            tenant1.classList.add('active-tenant');
            database1.classList.add('active-database');
            document.getElementById('conn-t1-service').classList.add('active-connection');
            document.getElementById('conn-service-db1').classList.add('active-connection');
            
            // Adicionar animação
            tenant1.classList.add('pulse');
            database1.classList.add('pulse');
            
            // Atualizar painel de informações
            updateInfoPanel('tenant', 1);
        } else {
            tenant2.classList.add('active-tenant');
            database2.classList.add('active-database');
            document.getElementById('conn-t2-service').classList.add('active-connection');
            document.getElementById('conn-service-db2').classList.add('active-connection');
            
            // Adicionar animação
            tenant2.classList.add('pulse');
            database2.classList.add('pulse');
            
            // Atualizar painel de informações
            updateInfoPanel('tenant', 2);
        }
    }
    
    // Função para destacar database e suas conexões
    function highlightDatabase(dbId) {
        resetVisualization();
        
        if (dbId === 1) {
            database1.classList.add('active-database');
            tenant1.classList.add('active-tenant');
            document.getElementById('conn-t1-service').classList.add('active-connection');
            document.getElementById('conn-service-db1').classList.add('active-connection');
            
            // Adicionar animação
            database1.classList.add('pulse');
            tenant1.classList.add('pulse');
            
            // Atualizar painel de informações
            updateInfoPanel('database', 1);
        } else {
            database2.classList.add('active-database');
            tenant2.classList.add('active-tenant');
            document.getElementById('conn-t2-service').classList.add('active-connection');
            document.getElementById('conn-service-db2').classList.add('active-connection');
            
            // Adicionar animação
            database2.classList.add('pulse');
            tenant2.classList.add('pulse');
            
            // Atualizar painel de informações
            updateInfoPanel('database', 2);
        }
    }
    
    // Função para resetar a visualização
    function resetVisualization() {
        // Remover classes ativas
        tenant1.classList.remove('active-tenant', 'pulse');
        tenant2.classList.remove('active-tenant', 'pulse');
        database1.classList.remove('active-database', 'pulse');
        database2.classList.remove('active-database', 'pulse');
        
        // Resetar conexões
        document.getElementById('conn-t1-service').classList.remove('active-connection');
        document.getElementById('conn-t2-service').classList.remove('active-connection');
        document.getElementById('conn-service-db1').classList.remove('active-connection');
        document.getElementById('conn-service-db2').classList.remove('active-connection');
        
        // Resetar painel de informações
        infoContent.innerHTML = '<p>Selecione uma empresa ou banco de dados para ver detalhes sobre a arquitetura multitenant.</p>';
    }
    
    // Função para atualizar o painel de informações
    function updateInfoPanel(type, id) {
        let content = '';
        
        if (type === 'tenant') {
            if (id === 1) {
                content = `
                    <h3>Empresa A (Tenant ID: T001)</h3>
                    <p>Esta empresa utiliza a aplicação multitenant compartilhada, mas seus dados são armazenados no Banco de Dados 1, completamente isolados dos dados da Empresa B.</p>
                    <h4>Características:</h4>
                    <p>• Isolamento de dados: Dados armazenados em banco de dados dedicado</p>
                    <p>• Segurança: Alta, com separação física dos dados</p>
                    <p>• Customização: Possibilidade de personalização do esquema de banco de dados</p>
                    <p>• Escalabilidade: Pode escalar independentemente da Empresa B</p>
                `;
            } else {
                content = `
                    <h3>Empresa B (Tenant ID: T002)</h3>
                    <p>Esta empresa utiliza a aplicação multitenant compartilhada, mas seus dados são armazenados no Banco de Dados 2, completamente isolados dos dados da Empresa A.</p>
                    <h4>Características:</h4>
                    <p>• Isolamento de dados: Dados armazenados em banco de dados dedicado</p>
                    <p>• Segurança: Alta, com separação física dos dados</p>
                    <p>• Customização: Possibilidade de personalização do esquema de banco de dados</p>
                    <p>• Escalabilidade: Pode escalar independentemente da Empresa A</p>
                `;
            }
        } else if (type === 'database') {
            if (id === 1) {
                content = `
                    <h3>Banco de Dados 1 (Empresa A)</h3>
                    <p>Este banco de dados é dedicado exclusivamente à Empresa A, garantindo isolamento completo dos dados.</p>
                    <h4>Características:</h4>
                    <p>• Modelo: Banco de dados por tenant</p>
                    <p>• Vantagens: Isolamento total, maior segurança, possibilidade de backup independente</p>
                    <p>• Desvantagens: Maior custo de manutenção, complexidade de gerenciamento</p>
                    <p>• Uso ideal: Para clientes que exigem alto nível de isolamento e segurança</p>
                `;
            } else {
                content = `
                    <h3>Banco de Dados 2 (Empresa B)</h3>
                    <p>Este banco de dados é dedicado exclusivamente à Empresa B, garantindo isolamento completo dos dados.</p>
                    <h4>Características:</h4>
                    <p>• Modelo: Banco de dados por tenant</p>
                    <p>• Vantagens: Isolamento total, maior segurança, possibilidade de backup independente</p>
                    <p>• Desvantagens: Maior custo de manutenção, complexidade de gerenciamento</p>
                    <p>• Uso ideal: Para clientes que exigem alto nível de isolamento e segurança</p>
                `;
            }
        }
        
        infoContent.innerHTML = content;
    }
    
    // Inicializar a visualização
    resetVisualization();
});
