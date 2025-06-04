
// Dados de exemplo para o tenant único
const tenantData = {
    name: "Minha Empresa",
    dbName: "minha_empresa_db",
    users: [
        { id: 1, name: "João Silva", email: "joao@empresa.com", role: "Admin" },
        { id: 2, name: "Maria Souza", email: "maria@empresa.com", role: "User" },
        { id: 3, name: "Carlos Oliveira", email: "carlos@empresa.com", role: "Manager" }
    ],
    products: [
        { id: 101, name: "Produto Premium", price: 99.90, stock: 50 },
        { id: 102, name: "Produto Standard", price: 49.90, stock: 100 },
        { id: 103, name: "Produto Básico", price: 29.90, stock: 200 }
    ],
    orders: [
        { id: 1001, user_id: 1, total: 299.80, date: "2023-06-15" },
        { id: 1002, user_id: 2, total: 149.90, date: "2023-06-16" },
        { id: 1003, user_id: 3, total: 79.80, date: "2023-06-17" }
    ]
};

function executeQuery(table) {
    const data = tenantData[table];
    
    // Gera a representação do SQL
    const sql = `SELECT * FROM ${table};`;
    document.getElementById('sqlQuery').textContent = sql;
    
    // Processa os resultados
    let resultHtml = `<h4>Resultados da tabela ${table} (${tenantData.dbName}):</h4>`;
    
    if (data && data.length > 0) {
        resultHtml += `<table>`;
        
        // Cabeçalho da tabela
        resultHtml += `<tr>`;
        Object.keys(data[0]).forEach(key => {
            resultHtml += `<th>${key}</th>`;
        });
        resultHtml += `</tr>`;
        
        // Linhas da tabela
        data.forEach(item => {
            resultHtml += `<tr>`;
            Object.values(item).forEach(val => {
                resultHtml += `<td>${val}</td>`;
            });
            resultHtml += `</tr>`;
        });
        
        resultHtml += `</table>`;
        resultHtml += `<p style="margin-top: 10px; font-size: 0.9em; color: #666;">${data.length} registros encontrados</p>`;
    } else {
        resultHtml += `<p>Nenhum dado encontrado nesta tabela</p>`;
    }
    
    document.getElementById('queryResult').innerHTML = resultHtml;
}

function resetQuery() {
    document.getElementById('sqlQuery').textContent = '-- Consulta resetada';
    document.getElementById('queryResult').innerHTML = '<em>Nenhum resultado ainda</em>';
}
