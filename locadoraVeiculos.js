document.addEventListener('DOMContentLoaded', () => {
    
    const clientes = [];
    const veiculos = []; 
    const locacoes = [];

    let veiculoEmEdicao = null;

    const formCliente = document.getElementById('form-cliente');
    const cpfInput = document.getElementById('cpf');
    const nomeInput = document.getElementById('nome');
    const dataNascimentoInput = document.getElementById('data-nascimento');
    const tabelaClientes = document.getElementById('tabela-clientes').getElementsByTagName('tbody')[0];
    const quilometragemAtualInput = document.getElementById('quilometragem-devolucao');

    const formVeiculo = document.getElementById('form-veiculo');
    const placaInput = document.getElementById('placa');
    const tipoInput = document.getElementById('tipo');
    const modeloInput = document.getElementById('modelo');
    const anoFabricacaoInput = document.getElementById('ano-fabricacao');
    const valorDiariaInput = document.getElementById('valor-diaria');
    const quilometragemInput = document.getElementById('quilometragem');
    const tabelaVeiculos = document.getElementById('tabela-veiculos').getElementsByTagName('tbody')[0];

    const incluirClienteBtn = document.querySelectorAll('button')[0];
    const consultarClientesBtn = document.querySelectorAll('button')[1];
    const incluirVeiculoBtn = document.querySelectorAll('button')[2];
    const consultarVeiculosBtn = document.querySelectorAll('button')[3];
    const consultarlocacoesBtn = document.querySelectorAll('button')[4];


    carregarDados();

    incluirClienteBtn.addEventListener('click', () => {
        mostrarFormInclusaoCliente();
    });

    consultarClientesBtn.addEventListener('click', () => {
        mostrarListaClientes();
    });

    incluirVeiculoBtn.addEventListener('click', () => {
        mostrarFormInclusaoVeiculo();
    });

    consultarVeiculosBtn.addEventListener('click', () => {
        mostrarListaVeiculos();
    });

    consultarlocacoesBtn.addEventListener('click', () => {
        mostrarListaLocacoes();
    });

    formCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        

        let isValid = true;

        const cpf = cpfInput.value.trim();
        const nome = nomeInput.value.trim();
        const dataNascimentoInputValue = dataNascimentoInput.value;
        let dataNascimento = null;

        if (!dataNascimentoInputValue) {
            document.getElementById('erro-data-nascimento').textContent = 'Data de nascimento é obrigatória';
            isValid = false;
        } else {
            dataNascimento = new Date(dataNascimentoInputValue + 'T00:00:00'); 
            document.getElementById('erro-data-nascimento').textContent = '';
        }

        if (!validarCPF(cpf)) {
            document.getElementById('erro-cpf').textContent = 'CPF inválido';
            isValid = false;
        } else {
            document.getElementById('erro-cpf').textContent = '';
        }

        if (nome.length < 4 || nome.length > 80) {
            document.getElementById('erro-nome').textContent = 'Nome deve ter entre 4 e 80 caracteres';
            isValid = false;
        } else {
            document.getElementById('erro-nome').textContent = '';
        }

        if (dataNascimento) {
            const hoje = new Date();
            const idade = hoje.getFullYear() - dataNascimento.getFullYear();
            if (idade < 18 || (idade === 18 && (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())))) {
                document.getElementById('erro-data-nascimento').textContent = 'Cliente deve ter 18 anos ou mais';
                isValid = false;
            } else {
                document.getElementById('erro-data-nascimento').textContent = '';
            }
        }

        if (clientes.some(cliente => cliente.cpf === cpf)) {
            document.getElementById('erro-cpf').textContent = 'CPF já cadastrado';
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        clientes.push({ cpf, nome, dataNascimento: formatarData(dataNascimentoInputValue), locacoes: [] });
        formCliente.reset();
        alert('Cliente incluído com sucesso!');
        
        mostrarListaClientes();
        salvarDados();
    });

    formVeiculo.addEventListener('submit', (e) => {
        e.preventDefault();
        
    
        let isValid = true;
    
        const placa = placaInput.value.trim().toUpperCase();
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        const modelo = modeloInput.value.trim();
        const anoFabricacao = parseInt(anoFabricacaoInput.value.trim(), 10);
        const valorDiaria = parseFloat(valorDiariaInput.value.trim());
        const quilometragem = parseInt(quilometragemInput.value.trim(), 10);
    
        if (!validarPlaca(placa)) {
            document.getElementById('erro-placa').textContent = 'Placa inválida';
            isValid = false;
        } else if (veiculos.some(veiculo => veiculo.placa === placa && veiculo !== veiculoEmEdicao)) {
            document.getElementById('erro-placa').textContent = 'Placa já cadastrada';
            isValid = false;
        } else {
            document.getElementById('erro-placa').textContent = '';
        }
    
        if (!tipo) {
            document.getElementById('erro-tipo').textContent = 'Tipo é obrigatório';
            isValid = false;
        } else {
            document.getElementById('erro-tipo').textContent = '';
        }
    
        if (modelo.length < 4 || modelo.length > 30) {
            document.getElementById('erro-modelo').textContent = 'Modelo deve ter entre 4 e 30 caracteres';
            isValid = false;
        } else {
            document.getElementById('erro-modelo').textContent = '';
        }
    
        if (isNaN(anoFabricacao) || anoFabricacao < 2000 || anoFabricacao > new Date().getFullYear()) {
            document.getElementById('erro-ano-fabricacao').textContent = 'Ano de fabricação deve ser entre 2000 e o ano atual';
            isValid = false;
        } else {
            document.getElementById('erro-ano-fabricacao').textContent = '';
        }
    
        if (isNaN(valorDiaria) || valorDiaria <= 0) {
            document.getElementById('erro-valor-diaria').textContent = 'Valor da diária deve ser um número maior que 0';
            isValid = false;
        } else {
            document.getElementById('erro-valor-diaria').textContent = '';
        }
    
        if (isNaN(quilometragem) || quilometragem <= 0 || !Number.isInteger(quilometragem)) {
            document.getElementById('erro-quilometragem').textContent = 'Quilometragem deve ser um número inteiro maior que 0';
            isValid = false;
        } else {
            document.getElementById('erro-quilometragem').textContent = '';
        }
    
        if (!isValid) {
            return;
        }
    
        if (veiculoEmEdicao) {
        
            veiculoEmEdicao.placa = placa;
            veiculoEmEdicao.tipo = tipo;
            veiculoEmEdicao.modelo = modelo;
            veiculoEmEdicao.anoFabricacao = anoFabricacao;
            veiculoEmEdicao.valorDiaria = valorDiaria;
            veiculoEmEdicao.quilometragem = quilometragem;
            veiculoEmEdicao = null; 
            alert('Veículo atualizado com sucesso!');
        } else {
            veiculos.push({ placa, tipo, modelo, anoFabricacao, valorDiaria, quilometragem });
            alert('Veículo incluído com sucesso!');
        }
    
        formVeiculo.reset();
        mostrarListaVeiculos();
        salvarDados();
    });
    
    function mostrarListaLocacoes() {
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'block';
        document.getElementById('devolver-veiculo').style.display = 'none';
        
        atualizarListaLocacoes();
    }
    function atualizarListaLocacoes() {
        const tabelaLocacoes = document.getElementById('tabela-locacoes').getElementsByTagName('tbody')[0];
        tabelaLocacoes.innerHTML = '';
        
        locacoes.forEach((locacao, index) => {
            const row = tabelaLocacoes.insertRow();
            row.insertCell(0).textContent = locacao.cpfCliente;
            row.insertCell(1).textContent = locacao.nomeCliente;
            row.insertCell(2).textContent = locacao.placaVeiculo;
            row.insertCell(3).textContent = locacao.modeloVeiculo;
            row.insertCell(4).textContent = `R$ ${locacao.valorDiaria}`;
            row.insertCell(5).textContent = locacao.dataInicio;
    
            
            const devolverBtn = document.createElement('button');
            devolverBtn.textContent = 'Devolver';
            devolverBtn.onclick = () => mostrarFormDevolucao(locacao.placaVeiculo);
            row.insertCell(6).appendChild(devolverBtn);
        });
    }

    document.getElementById('form-devolucao').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const quilometragemDevolucao = parseInt(document.getElementById('quilometragem-devolucao').value.trim(), 10);
        
        if (isNaN(quilometragemDevolucao) || quilometragemDevolucao <= 0) {
            document.getElementById('erro-km').textContent = 'Valor deve ser maior do que a quilometragem atual do veiculo';
            return;
        }
    
        
        const locacaoIndex = locacoes.findIndex(locacao => {
            const veiculo = veiculos.find(v => v.placa === locacao.placaVeiculo);
            return veiculo && quilometragemDevolucao > veiculo.quilometragem;
        });
    
        if (locacaoIndex !== -1) {
            const locacao = locacoes[locacaoIndex];
            
            
            const veiculo = veiculos.find(v => v.placa === locacao.placaVeiculo);
            if (veiculo) {
                veiculo.disponivel = true;
                veiculo.quilometragem = quilometragemDevolucao;
            }
    
            
            locacoes.splice(locacaoIndex, 1);
            
            
            atualizarListaLocacoes();
            
            
            document.getElementById('devolver-veiculo').style.display = 'none';
            
            alert('Veículo devolvido com sucesso!');
            salvarDados();
            mostrarListaLocacoes();
        } else {
            document.getElementById('erro-km').textContent = 'Valor deve ser maior do que a quilometragem atual do veiculo';
        }
    });
    

    function mostrarFormInclusaoCliente() {
        document.getElementById('incluir-cliente').style.display = 'block';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'none';
        cpfInput.focus();
    }

    function mostrarFormDevolucao(placaVeiculo) {
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'block';
        document.getElementById('form-devolucao').reset();
        quilometragemAtualInput.focus();
    
        const locacao = locacoes.find(l => l.placaVeiculo === placaVeiculo);
        const veiculo = veiculos.find(v => v.placa === placaVeiculo);
    
        if (locacao && veiculo) {
            document.getElementById('info-cpf').textContent = locacao.cpfCliente;
            document.getElementById('info-nome').textContent = locacao.nomeCliente;
            document.getElementById('info-placa').textContent = veiculo.placa;
            document.getElementById('info-modelo').textContent = veiculo.modelo;
            document.getElementById('info-valor-diaria').textContent = `R$ ${veiculo.valorDiaria.toFixed(2)}`;
            document.getElementById('info-quilometragem').textContent = veiculo.quilometragem;
            document.getElementById('info-data-locacao').textContent = locacao.dataInicio;
        }
    }
    
    

    function mostrarListaClientes() {
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'block';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'none';
        atualizarListaClientes();
        atualizarEstadoBotoes();
    }

    function mostrarFormInclusaoVeiculo() {
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'block';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'none';
    
        placaInput.focus();
    
        placaInput.disabled = false;
        document.querySelectorAll('input[name="tipo"]').forEach(radio => radio.disabled = false);
        modeloInput.disabled = false;
        anoFabricacaoInput.disabled = false;
        valorDiariaInput.disabled = false;
        quilometragemInput.disabled = false;
        atualizarEstadoBotoes();
    }

    function mostrarListaVeiculos() {
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'block';
        document.getElementById('aluguel-veiculos').style.display = 'none';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'none';
        atualizarListaVeiculos();
        atualizarEstadoBotoes();
    }

    function abrirModalAluguel(cliente) {
        
        document.getElementById('incluir-cliente').style.display = 'none';
        document.getElementById('consultar-clientes').style.display = 'none';
        document.getElementById('incluir-veiculo').style.display = 'none';
        document.getElementById('consultar-veiculos').style.display = 'none';
        document.getElementById('aluguel-veiculos').style.display = 'block';
        document.getElementById('consultar-locacoes').style.display = 'none';
        document.getElementById('devolver-veiculo').style.display = 'none';
    
        
        document.getElementById('cpf-cliente').textContent = cliente.cpf;
        document.getElementById('nome-cliente').textContent = cliente.nome;
    
        atualizarListaVeiculosDisponiveis(cliente);
        atualizarEstadoBotoes();  
    }

    function atualizarListaVeiculosDisponiveis(cliente) {
        const tabelaAluguelVeiculos = document.getElementById('aluguel-veiculos').getElementsByTagName('tbody')[0];
        tabelaAluguelVeiculos.innerHTML = '';
        
        veiculos.forEach(veiculo => {
            if (veiculo.disponivel !== false) { 
                const row = tabelaAluguelVeiculos.insertRow();
                const radioCell = row.insertCell(0);
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'veiculoSelecionado';
                radioInput.value = veiculo.placa;
                radioCell.appendChild(radioInput);
    
                row.insertCell(1).textContent = veiculo.placa;
                row.insertCell(2).textContent = veiculo.tipo;
                row.insertCell(3).textContent = veiculo.modelo;
                row.insertCell(4).textContent = veiculo.anoFabricacao;
                row.insertCell(5).textContent = `R$ ${veiculo.valorDiaria.toFixed(2)}`;
                row.insertCell(6).textContent = veiculo.quilometragem;
            }
        });
    
        const acoesCell = tabelaAluguelVeiculos.insertRow().insertCell(0);
        acoesCell.colSpan = 7;
        const acoesContainer = document.getElementById('acoes-container');
        acoesContainer.innerHTML = '';
        const confirmarBtn = document.createElement('button');
        confirmarBtn.classList.add('alugarBtn');
        confirmarBtn.textContent = 'Alugar';
        confirmarBtn.addEventListener('click', () => confirmarAluguel(cliente)); 
        acoesContainer.appendChild(confirmarBtn);

        atualizarEstadoBotoes();
    }
    

    function confirmarAluguel(cliente) {
        const mensagemErroLocacao = document.getElementById('mensagem-erro-locacao');
        const veiculoSelecionado = document.querySelector('input[name="veiculoSelecionado"]:checked');
        if (veiculoSelecionado) {
            const placaSelecionada = veiculoSelecionado.value;
            const veiculo = veiculos.find(v => v.placa === placaSelecionada);
            
            if (veiculo) {
                
                veiculo.disponivel = false;
                cliente.locacoes.push({ placa: veiculo.placa, dataInicio: new Date().toLocaleDateString() });
                
                
                locacoes.push({
                    cpfCliente: cliente.cpf,
                    nomeCliente: cliente.nome,
                    placaVeiculo: veiculo.placa,
                    modeloVeiculo: veiculo.modelo,
                    valorDiaria: veiculo.valorDiaria.toFixed(2),
                    dataInicio: new Date().toLocaleDateString()
                });
                
                
                alert('Veículo alugado com sucesso!');
                mostrarListaLocacoes();
                salvarDados();

                atualizarEstadoBotoes();
            }
        } else {
            mensagemErroLocacao.textContent = 'Selecione um veículo para alugar.';
        }
    }
    function limparDadosUmaVez() {
        
        localStorage.removeItem('clientes');
        localStorage.removeItem('veiculos');
        localStorage.removeItem('locacoes');
        
        
        
        console.log('Dados do localStorage foram limpos.');
    }
    
    
    

    function atualizarListaClientes() {
        tabelaClientes.innerHTML = '';
        clientes.forEach(cliente => {
            const row = tabelaClientes.insertRow();
            row.insertCell(0).textContent = cliente.cpf;
            row.insertCell(1).textContent = cliente.nome;
            row.insertCell(2).textContent = cliente.dataNascimento;
    
            const acoesCell = row.insertCell(3);
    
            const excluirBtn = document.createElement('button');
            excluirBtn.classList.add('botoes-usuario-excluir');
            excluirBtn.textContent = 'Excluir';
            excluirBtn.disabled = cliente.locacoes.length > 0;
            excluirBtn.onclick = () => {
                if (confirm('Tem certeza que deseja excluir este cliente?')) {
                    const index = clientes.indexOf(cliente);
                    if (index > -1) {
                        clientes.splice(index, 1);
                        atualizarListaClientes();
                        salvarDados();
                        atualizarEstadoBotoes();
                    }
                }
            };
            acoesCell.appendChild(excluirBtn);
            
            const alugarBtn = document.createElement('button');
            alugarBtn.classList.add('botoes-usuario-alugar');
            alugarBtn.textContent = 'Alugar';
            alugarBtn.disabled = cliente.locacoes.length > 0 || !temVeiculosDisponiveis();
            alugarBtn.onclick = () => abrirModalAluguel(cliente);
            acoesCell.appendChild(alugarBtn);
            atualizarEstadoBotoes();
        });
    }
    

    function temVeiculosDisponiveis() {
        return veiculos.some(veiculo => veiculo.disponivel !== false);
    }
    
    function atualizarEstadoBotoes() {
        const clienteSelecionado = obterClienteSelecionado();
        const temLocacaoEmCurso = clienteSelecionado && locacoes.some(locacao => locacao.cpfCliente === clienteSelecionado.cpf);
        const veiculosDisponiveis = veiculos.some(veiculo => veiculo.disponivel !== false);
    
        
        const botoesExcluir = document.querySelectorAll('.botoes-usuario-excluir');
        const botoesAlugar = document.querySelectorAll('.botoes-usuario-alugar');
    
        
        botoesExcluir.forEach(botao => {
            botao.disabled = temLocacaoEmCurso;
        });
    
        
        botoesAlugar.forEach(botao => {
            botao.disabled = temLocacaoEmCurso || !veiculosDisponiveis;
        });
    }

    function obterClienteSelecionado() {
        
        const cpfCliente = document.getElementById('cpf-cliente').textContent;
        return clientes.find(cliente => cliente.cpf === cpfCliente);
    }
    

    function atualizarListaVeiculos() {
        tabelaVeiculos.innerHTML = '';
        veiculos.forEach(veiculo => {
            const row = tabelaVeiculos.insertRow();
            row.insertCell(0).textContent = formatarPlaca(veiculo.placa);
            row.insertCell(1).textContent = veiculo.tipo;
            row.insertCell(2).textContent = veiculo.modelo;
            row.insertCell(3).textContent = veiculo.anoFabricacao;
            row.insertCell(4).textContent = `R$ ${veiculo.valorDiaria.toFixed(2)}`;
            row.insertCell(5).textContent = veiculo.quilometragem;
    
            const acoesCell = row.insertCell(6);
    
            const excluirBtn = document.createElement('button');
            excluirBtn.textContent = 'Excluir';
            console.log(!veiculo.disponivel);
            excluirBtn.disabled = !veiculo.disponivel;
            excluirBtn.onclick = () => {
                if (confirm('Tem certeza que deseja excluir este veículo?')) {
                    const index = veiculos.indexOf(veiculo);
                    if (index > -1) {
                        veiculos.splice(index, 1);
                        atualizarListaVeiculos();
                        salvarDados();
                    }
                }
            };
            acoesCell.appendChild(excluirBtn);

            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.onclick = () => editarVeiculo(veiculo);
            acoesCell.appendChild(editarBtn);
        });
    }
    
    
    

    function formatarPlaca(placa) {
        return placa.slice(0, 3) + '-' + placa.slice(3);
    }
    

    document.getElementById('th-cpf').addEventListener('click', () => {
        clientes.sort((a, b) => a.cpf.localeCompare(b.cpf));
        atualizarListaClientes();
    });

    document.getElementById('th-nome').addEventListener('click', () => {
        clientes.sort((a, b) => a.nome.localeCompare(b.nome));
        atualizarListaClientes();
    });

    document.getElementById('th-placa').addEventListener('click', () => {
        veiculos.sort((a, b) => a.placa.localeCompare(b.placa));
        atualizarListaVeiculos();
    });

    document.getElementById('th-tipo').addEventListener('click', () => {
        veiculos.sort((a, b) => a.tipo.localeCompare(b.tipo));
        atualizarListaVeiculos();
    });

    document.getElementById('th-modelo').addEventListener('click', () => {
        veiculos.sort((a, b) => a.modelo.localeCompare(b.modelo));
        atualizarListaVeiculos();
    });

    document.getElementById('th-ano-fabricacao').addEventListener('click', () => {
        veiculos.sort((a, b) => a.anoFabricacao - b.anoFabricacao);
        atualizarListaVeiculos();
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    function validarPlaca(placa) {
        placa = placa.toUpperCase(); 
        const placaRegex = /^[A-Z]{3}\d{4}$/;
        return placaRegex.test(placa);
    }

    function editarVeiculo(veiculo) {
        mostrarFormInclusaoVeiculo();
    
        veiculoEmEdicao = veiculo; 
    
        placaInput.value = veiculo.placa;
        document.querySelector(`input[name="tipo"][value="${veiculo.tipo}"]`).checked = true;
        modeloInput.value = veiculo.modelo;
        anoFabricacaoInput.value = veiculo.anoFabricacao;
        valorDiariaInput.value = veiculo.valorDiaria;
        quilometragemInput.value = veiculo.quilometragem;
    
        
        placaInput.disabled = true;
        document.querySelectorAll('input[name="tipo"]').forEach(radio => radio.disabled = true);
        modeloInput.disabled = true;
        anoFabricacaoInput.disabled = true;
        quilometragemInput.disabled = true;
    
        valorDiariaInput.disabled = false; 

        valorDiariaInput.focus();
    }

    function formatarData(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function temVeiculosDisponiveis() {
        return true; 
    }

    function salvarDados() {
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        localStorage.setItem('locacoes', JSON.stringify(locacoes)); 
    }

    function carregarDados() {
        console.log("Dados carregados");
        
    
        const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
        const veiculosSalvos = JSON.parse(localStorage.getItem('veiculos')) || [];
        const locacoesSalvas = JSON.parse(localStorage.getItem('locacoes')) || []; 
        
        
        clientes.length = 0;
        clientes.push(...clientesSalvos);
        
        veiculos.length = 0;
        veiculos.push(...veiculosSalvos);
        
        
        locacoes.length = 0; 
        locacoes.push(...locacoesSalvas);
        
        
        atualizarListaClientes();
        atualizarListaVeiculos();
        
        
        atualizarListaLocacoes();
    }
});