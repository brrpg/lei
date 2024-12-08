let campoId = 0; // Contador global para os campos adicionados
let proximoId = 1;
const idsDisponiveis = new Set(); // Armazena IDs liberados para reutilização

document.getElementById('adicionarCampo').addEventListener('click', function () {
    // Determina o próximo número para o campo
    const novoCampoId = idsDisponiveis.size > 0 ? Math.min(...idsDisponiveis) : proximoId++;

    // Remove o ID da lista de disponíveis
    idsDisponiveis.delete(novoCampoId);

    // Cria o grupo do campo
    const novoCampo = document.createElement('div');
    novoCampo.className = 'my-3';
    novoCampo.id = `campo-${novoCampoId}`;

    // Cria o label
    const label = document.createElement('label');
    label.setAttribute('for', `campoExtra${novoCampoId}`);
    label.className = 'form-label';
    label.textContent = `Artigo ${novoCampoId}`;

    // Campo de entrada (textarea)
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control';
    textarea.name = `campoExtra${novoCampoId}`;
    textarea.id = `campoExtra${novoCampoId}`;
    textarea.rows = 2;
    textarea.placeholder = `Digite algo para o campo extra ${novoCampoId}`;

    // Botão de apagar
    const botaoApagar = document.createElement('button');
    botaoApagar.type = 'button';
    botaoApagar.className = 'btn btn-danger mt-2';
    botaoApagar.innerHTML = '<i class="fa-regular fa-xmark"></i> Apagar';
    botaoApagar.onclick = function () {
        // Remove o campo e devolve o ID à lista de disponíveis
        document.getElementById(`campo-${novoCampoId}`).remove();
        idsDisponiveis.add(novoCampoId);
    };

    // Adiciona os elementos ao grupo
    novoCampo.appendChild(label);
    novoCampo.appendChild(textarea);
    novoCampo.appendChild(botaoApagar);

    // Adiciona o grupo ao contêiner
    document.getElementById('camposAdicionais').appendChild(novoCampo);

    // Incrementa o contador global
    campoId++;
});

document.getElementById('Formulario').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os valores dos campos
    const categoria = document.getElementById('categoria').value;
    const id = document.getElementById('idnum').value;
    const data = document.getElementById('data').value;
    const cidade = document.getElementById('cidade').value;
    const nome = document.getElementById('nome').value;
    const cargo = document.getElementById('cargo').value;
    const orgao = document.getElementById('orgao').value;
    const estado = document.getElementById('estado').value;
    const prefacio = document.getElementById('prefacio').value;

    // Converte a data para o objeto Date
    const dataObj = new Date(data + 'T00:00:00');;
    const ano = dataObj.getFullYear();

    // Formato 1: 07/12/2024 (dd/mm/yyyy)
    const dataFormatada1 = dataObj.toLocaleDateString('pt-BR');

    // Formato 2: 7 de dezembro de 2024
    const dataFormatada2 = dataObj.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Formato 3: 7 DE DEZEMBRO DE 2024 (tudo em maiúsculo)
    const dataFormatada3 = dataFormatada2.toUpperCase();

    const categoriaFormatada = categoria.toUpperCase();

    let emoji;
    let estadoNome;
    switch (estado) {
        case 'SP':
            emoji = '<:SP:1301362958982709280>';  // Emoji para São Paulo
            estadoNome = 'São Paulo';
            break;
        case 'SC':
            emoji = ':sc:1301363416379818014';  // Emoji para Santa Catarina
            estadoNome = 'Santa Catarina';
            break;
        case 'PE':
            emoji = ':pe:1301363267897397308';  // Emoji para Pernambuco
            estadoNome = 'Pernambuco';
            break;
        case 'GO':
            emoji = ':GO:1301364791251566643';  // Emoji para Goiás
            estadoNome = 'Goiás';
            break;
        case 'MG':
            emoji = ':mg:1314976256365690984';  // Emoji para Minas Gerais
            estadoNome = 'Minas Gerais';
            break;
        default:
            emoji = ':rfb:1287542222371295387';  // Emoji genérico para estados não mapeados
    }

    let estadoNomeUpper = estadoNome ? estadoNome.toUpperCase() : '';

    // Define o valor do campo com base nas regras
    let campo;
    let diario;

    // Função para formatar o órgão, removendo a primeira palavra
    const formatarOrgao = (orgao) => orgao.split(' ').slice(1).join(' ');

    // Define o diário oficial com base no cargo e estado
    if (cargo === 'Presidente da República') {
        campo = cargo;
        diario = 'DIÁRIO OFICIAL DA UNIÃO';
    } else if (cargo === 'Ministro') {
        campo = `${cargo} ${formatarOrgao(orgao)}`;
        diario = 'DIÁRIO OFICIAL DA UNIÃO';
    } else if (['SP', 'SC', 'PE', 'GO', 'MG'].includes(estado) && (cargo === 'Governador' || cargo === 'Secretário')) {
        campo = `${cargo} ${formatarOrgao(orgao)}`;
        diario = `DIÁRIO OFICIAL DO ESTADO DE ${estadoNomeUpper}`;
    } else {
        campo = ' ';
        diario = '';
    }

    let frase1HTML = '';
    let frase2HTML = '';
    let frase1Sim = '';
    let frase2Sim = '';

    if (cargo === 'Presidente da República') {
        frase1HTML = `REPÚBLICA FEDERATIVA DO BRASIL`;
        frase2HTML = `Gabinete do Presidente da República`;
        frase1Sim = `**<:rfb:1287542222371295387> | REPÚBLICA FEDERATIVA DO BRASIL**`;
        frase2Sim = `Gabinete do Presidente da República`;
    } else if (cargo === 'Ministro') {
        frase1HTML = `REPÚBLICA FEDERATIVA DO BRASIL`;
        frase2HTML = `${orgao}`;
        frase1Sim = `**<:rfb:1287542222371295387> | REPÚBLICA FEDERATIVA DO BRASIL**`;
        frase2Sim = `**<:planalto2:1313532794567135275> | ${orgao}**`;
    } else if (cargo === 'Governador') {
        frase1HTML = `${diario}`;
        frase2HTML = `Gabinete do Governador do Estado do ${estadoNome}`;
        frase1Sim = `**<${emoji}> | ${diario}**`;
        frase2Sim = `**Gabinete do Governador do Estado do ${estadoNome}**`;
    } else if (cargo === 'Secretário') {
        frase1HTML = `${diario}`;
        frase2HTML = `${orgao}`;
        frase1Sim = `<${emoji}> | ${diario}`;
        frase2Sim = `${orgao}`;
    }

    let camposAdicionaisTextoHTML = '';
    let camposAdicionaisTextoSimples = '';
    let ultimoCampoId = campoId + 1;
    for (let i = 1; i <= campoId; i++) {
        const campoExtra = document.querySelector(`textarea[name="campoExtra${i}"]`);
        if (campoExtra) {
            // Adiciona o "º" ao número do campo
            const campoComSufixo = `${i}º`;

            // Formatação para o resultado (HTML)
            camposAdicionaisTextoHTML += `<p><b>Art. ${campoComSufixo} -</b> ${campoExtra.value}</p>`;

            // Formatação para o código (texto simples)
            camposAdicionaisTextoSimples += `Art. ${campoComSufixo} - ${campoExtra.value}\n\n`;
        }
    }

    // Adiciona o "Fim do documento" como o último campo
    const fimDoDocumentoCampo = `${ultimoCampoId}º`; // A numeração segue a sequência
    camposAdicionaisTextoHTML += `<b>Art. ${fimDoDocumentoCampo} -</b> Esta ${categoria} entra em vigor na data de sua publicação.</p>`;
    camposAdicionaisTextoSimples += `Art. ${fimDoDocumentoCampo} - Esta ${categoria} entra em vigor na data de sua publicação.</p>\n`;

    // Monta o conteúdo a ser exibido
    const resultado = `
        <b>${frase1HTML}</b>
        <br><b>${frase2HTML}</b>
        <br>
        <br><b>${categoriaFormatada} Nº ${id}/${ano}, ${dataFormatada3}</b>
        <br>
        <br>${prefacio}
        <br>
        <br>O ${campo}, no uso das atribuições que lhe confere a Constituição da República Federativa do Brasil, resolve:
        <br>
        <br>
        ${camposAdicionaisTextoHTML}
        ${cidade}, ${dataFormatada2}.
        <br>
        <br><b>${nome}</b>
        <br>${campo}
    `;

    const codigo = `**${frase1Sim}**
*${frase2Sim}*

**${categoriaFormatada} Nº ${id}/${ano}, ${dataFormatada3}**

> *${prefacio}*

O ${campo}, no uso das atribuições que lhe confere a Constituição da República Federativa do Brasil, resolve:

${camposAdicionaisTextoSimples}
${cidade}, ${dataFormatada2}.

**${nome}**
${campo}`;

    // Exibe o conteúdo no resultado
    document.getElementById('dados').innerHTML = resultado;
    document.getElementById('codigo').innerText = codigo;
});

// Copiar o texto do #codigo
document.getElementById('copiarCodigo').addEventListener('click', function () {
    const codigo = document.getElementById('codigo').innerText;
    navigator.clipboard.writeText(codigo).then(() => {
        const toastEl = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }).catch(err => console.error('Erro ao copiar:', err));
});

// Copiar o texto do #resultado
document.getElementById('copiarResultado').addEventListener('click', function () {
    const resultado = document.getElementById('dados').innerText;
    navigator.clipboard.writeText(resultado).then(() => {
        const toastEl = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }).catch(err => console.error('Erro ao copiar:', err));
});
