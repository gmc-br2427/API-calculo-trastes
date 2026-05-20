// Captura os elementos que podem existir na tela
const botaoOficina = document.getElementById('btn-oficina');
const botaoCalculo = document.getElementById('btn-calculo'); // Esse botão existe nas DUAS páginas

// Elementos exclusivos da página de cálculo
const inputEscala = document.getElementById('input-escala');
const areaResultados = document.getElementById('area-resultados');
const corpoTabela = document.getElementById('corpo-tabela');
const labelEscala = document.getElementById('label-escala');


/* ==========================================
   LÓGICA DA PÁGINA INICIAL
   ========================================== */
// Se o botão cálculo existe, mas o input da escala NÃO existe, estamos na tela inicial
if (botaoCalculo && !inputEscala) {

    botaoCalculo.addEventListener('click', function() {
        // Redireciona para a página de cálculo de trastes
        window.location.href = "trastes.html";
    });

    if (botaoOficina) {
        botaoOficina.addEventListener('click', function() {
            alert('Ação: Redirecionando para a página da Oficina...');
        });
    }
}


/* ==========================================
   LÓGICA DA PÁGINA DE CÁLCULO (API CLOJURE)
   ========================================== */
// Se o botão cálculo existe E o input da escala também existe, estamos na calculadora
if (botaoCalculo && inputEscala) {
    
    botaoCalculo.addEventListener('click', async () => {
        const valorEscala = inputEscala.value;

        if (!valorEscala || valorEscala <= 0) {
            alert("Por favor, insira um valor válido para a escala.");
            return;
        }

        try {
            // Chama o servidor backend rodando no Leiningen
            const resposta = await fetch(`http://localhost:3000/api/calcular?escala=${valorEscala}`);
            
            if (!resposta.ok) throw new Error("Erro na API");
            
            const dados = await resposta.json();
            
            // Limpa a tabela e preenche os dados
            corpoTabela.innerHTML = ''; 
            labelEscala.textContent = parseFloat(valorEscala).toFixed(2);

            dados.trastes.forEach(traste => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${traste.traste}</td>
                    <td>${traste.espacamento_mm.toFixed(2)}</td>
                    <td>${traste.distancia_rastilho_mm.toFixed(2)}</td>
                    <td>${traste.distancia_pestana_mm.toFixed(2)}</td>
                `;
                corpoTabela.appendChild(linha);
            });

            areaResultados.style.display = 'block';

        } catch (erro) {
            console.error("Erro ao buscar cálculo:", erro);
            alert("Não foi possível conectar. Verifique se o 'lein run' está rodando no terminal do VS Code.");
        }
    });
}