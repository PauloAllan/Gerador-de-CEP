const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuração do mecanismo de visualização EJS
app.set('view engine', 'ejs');

// Configuração do body-parser para tratar requisições JSON
app.use(bodyParser.json());

// Endpoint para salvar os dados do CEP no arquivo JSON
app.post('/save', (req, res) => {
    // Receber os dados do CEP do corpo da requisição
    const newCep = req.body;

    // Ler os CEPs existentes do arquivo JSON
    fs.readFile('ceps.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo ceps.json:', err);
            res.status(500).send('Erro ao salvar o CEP');
            return;
        }

        // Converter os dados existentes para um array de objetos JavaScript
        const ceps = JSON.parse(data) || [];

        // Verificar se o CEP já existe na lista
        const existingCep = ceps.find(cep => cep.cep === newCep.cep);
        if (existingCep) {
            res.status(400).send('CEP já existe na lista');
            return;
        }

        // Adicionar o novo CEP à lista de CEPs
        ceps.push(newCep);

        // Salvar os CEPs atualizados no arquivo JSON
        fs.writeFile('ceps.json', JSON.stringify(ceps), (err) => {
            if (err) {
                console.error('Erro ao salvar os CEPs:', err);
                res.status(500).send('Erro ao salvar o CEP');
                return;
            }
            console.log('CEP salvo com sucesso!');
            res.status(200).send(newCep);
        });
    });
});

// Endpoint para obter todos os CEPs salvos do arquivo JSON
// Endpoint para obter todos os CEPs salvos do arquivo JSON
app.get('/ceps/data', (req, res) => {
    // Ler os CEPs existentes do arquivo JSON
    fs.readFile('ceps.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo ceps.json:', err);
            res.status(500).send('Erro ao recuperar os CEPs');
            return;
        }
        const savedCeps = JSON.parse(data) || [];
        res.json(savedCeps);
    });
});


// Endpoint para excluir um CEP específico
app.delete('/ceps/:cep', (req, res) => {
    const cepToDelete = req.params.cep;
    fs.readFile('ceps.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo ceps.json:', err);
            res.status(500).send('Erro ao excluir o CEP');
            return;
        }
        let ceps = JSON.parse(data) || [];
        // Filtrar os CEPs mantendo apenas aqueles que não correspondem ao CEP a ser excluído
        ceps = ceps.filter(cep => cep.cep !== cepToDelete);
        fs.writeFile('ceps.json', JSON.stringify(ceps), (err) => {
            if (err) {
                console.error('Erro ao salvar os CEPs:', err);
                res.status(500).send('Erro ao excluir o CEP');
                return;
            }
            console.log('CEP excluído com sucesso!');
            res.status(200).send('CEP excluído com sucesso');
        });
    });
});

// Servir os arquivos estáticos (frontend)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
