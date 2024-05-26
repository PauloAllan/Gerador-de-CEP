document.getElementById('cepForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário

    const cep = document.getElementById('cep').value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao consultar o CEP');
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }

            const resultado = document.getElementById('resultado');
            resultado.innerHTML = `
                <p><strong>CEP:</strong> ${data.cep}</p>
                <p><strong>Logradouro:</strong> ${data.logradouro}</p>
                <p><strong>Bairro:</strong> ${data.bairro}</p>
                <p><strong>Cidade:</strong> ${data.localidade}</p>
                <p><strong>Estado:</strong> ${data.uf}</p>
            `;

            // Limpar os dados exibidos
            document.getElementById('limparDados').addEventListener('click', function() {
                resultado.innerHTML = '';
            });

            // Guardar o CEP
            document.getElementById('guardarCep').addEventListener('click', function() {
                const cepInfo = resultado.querySelectorAll('p');
                const data = {
                    cep: cepInfo[0].innerText.split(': ')[1],
                    logradouro: cepInfo[1].innerText.split(': ')[1],
                    bairro: cepInfo[2].innerText.split(': ')[1],
                    localidade: cepInfo[3].innerText.split(': ')[1],
                    uf: cepInfo[4].innerText.split(': ')[1]
                };

                fetch('/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Dados salvos com sucesso:', result);
                    mostrarSucesso('CEP salvo com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao salvar os dados:', error);
                    mostrarErro('CEP já Cadastrado');
                });
            });
        })
        .catch(error => {
            const resultado = document.getElementById('resultado');
            resultado.innerHTML = `<p class="error">${error.message}</p>`;
            mostrarErro(error.message);
        });
});

// Quando houver um erro ao salvar o CEP
function mostrarErro(mensagem) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.innerHTML = `<p class="error">${mensagem}</p>`;
}

// Quando o CEP for salvo com sucesso
function mostrarSucesso(mensagem) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.innerHTML = `<p class="success">${mensagem}</p>`;
}
