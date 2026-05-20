// arquivo: server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que seu frontend chame a API

app.get('/api/calcular', (req, res) => {
    // Pega o valor da URL ou usa 650 como padrão
    const L = parseFloat(req.query.escala) || 650;
    const totalTrastes = parseInt(req.query.trastes) || 24; 
    
    const resultado = [];
    let dn_anterior = 0;

    for (let n = 1; n <= totalTrastes; n++) {
        // Fórmula 1: Distância da Pestana (d_n)
        const dn = L * (1 - 1 / Math.pow(2, n / 12));
        
        // Fórmula 2: Espaçamento
        const espacamento = (n === 1) ? dn : (dn - dn_anterior);
        
        // Fórmula 3: Distância da Ponte/Rastilho
        const distRastilho = L - dn;

        resultado.push({
            traste: n,
            espacamento_mm: parseFloat(espacamento.toFixed(2)),
            distancia_rastilho_mm: parseFloat(distRastilho.toFixed(2)),
            distancia_pestana_mm: parseFloat(dn.toFixed(2))
        });

        // Salva o d_n atual para ser usado no cálculo do espaçamento do próximo traste
        dn_anterior = dn; 
    }

    res.json({ escala: L, trastes: resultado });
});

app.listen(3000, () => {
    console.log('API JS rodando em http://localhost:3000');
});