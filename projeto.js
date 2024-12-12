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

// Obtendo os elementos
const justSim = document.getElementById('justSim');
const justNao = document.getElementById('justNao');
const justTextarea = document.getElementById('justTextarea');
const justInput = document.getElementById('justificativa'); // Campo de texto associado

// Função para mostrar ou esconder o div com textarea
function toggleJustTextarea() {
    if (justSim.checked) {
        justTextarea.style.display = 'block'; // Mostra o textarea
    } else {
        justTextarea.style.display = 'none'; // Esconde o textarea
        justInput.value = ''; // Zera o valor do campo
    }
}

// Adiciona eventos para monitorar as mudanças nos inputs
justSim.addEventListener('change', toggleJustTextarea);
justNao.addEventListener('change', toggleJustTextarea);

// Chama a função para definir o estado inicial
toggleJustTextarea();

// Obtendo os elementos
const formaArt = document.getElementById('formaArt');
const formaLivre = document.getElementById('formaLivre');
const livreText = document.getElementById('livreText');
const livre = document.getElementById('justificativa');
const camposAdicionais = document.getElementById('camposAdicionais');
const adicionarCampo = document.getElementById('adicionarCampo');

// Função para mostrar ou esconder o div com textarea
function togglelivreText() {
  if (formaArt.checked) {
    livreText.style.display = 'none'; // Esconde o textarea
    adicionarCampo.style.display = 'block';
    camposAdicionais.style.display = 'block'; 
    // Limpar os valores dos textareas
    const camposInput = document.querySelectorAll('#camposAdicionais textarea');
    camposInput.forEach(textarea => {
      textarea.value = ''; 
    });
  } else {
    livreText.style.display = 'block'; 
    camposAdicionais.style.display = 'none';
    adicionarCampo.style.display = 'none';
    livre.value = ''; 
  }
}

// Adicionar evento de mudança ao radio button "formaArt"
formaArt.addEventListener('change', togglelivreText);
formaLivre.addEventListener('change', togglelivreText); 

// Chamar a função inicialmente para definir o estado inicial
togglelivreText(); 

// Adiciona eventos para monitorar as mudanças nos inputs
formaArt.addEventListener('change', togglelivreText);
formaLivre.addEventListener('change', togglelivreText);

// Chama a função para definir o estado inicial
togglelivreText();

// Função carregar imagem
function carregarImagemBase64(caminhoImagem) {
    return new Promise((resolve, reject) => {
        fetch(caminhoImagem)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result); // Base64
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })
            .catch(reject);
    });
}

// Função para gerar o PDF com jsPDF
async function createPDF() {
    const { jsPDF } = window.jspdf;

    // Agrupando os valores em um objeto
    const formData = {
        categoria: document.getElementById('categoria').value || "",
        id: document.getElementById('idnum').value || "",
        data: document.getElementById('data').value || "",
        cidade: document.getElementById('cidade').value || "",
        nome: document.getElementById('nome').value || "",
        cargo: document.getElementById('cargo').value || "",
        orgao: document.getElementById('orgao').value || "",
        estado: document.getElementById('estado').value || "",
        prefacio: document.getElementById('prefacio').value || "",
        fonte: document.getElementById('fonte').value || "helvetica",
        justificativa: document.getElementById('justificativa').value || "",
    };

    const categoria = formData.categoria;
    let categoriaNome;
    switch (categoria) {
        case 'PL':
            categoriaNome = 'Projeto de Lei';
            break;
        case 'PEC':
            categoriaNome = 'Proposta de Emenda à Constituição';
            break;
        case 'PER':
            categoriaNome = 'Proposta de Emenda ao Regimento';
            break;
        case 'PDL':
            categoriaNome = 'Projeto de Decreto Legislativo';
            break;
        case 'PLC':
            categoriaNome = 'Projeto de Lei Complementar';
            break;
        default:
            categoriaNome = 'Categoria Desconhecida';
    }

    let frase1;
    switch(formData.cargo){
        case 'Presidente':
            frase1 = 'O PRESIDENTE DA REPÚBLICA no uso da atribuição que lhe confere na Constituição Federal, ';
            break;
        case 'Senador':
            frase1 = 'O Congresso Nacional ';
            break;
        case 'Deputado':
            frase1 = 'O Congresso Nacional ';
            break;
        case 'Governador':
            frase1 = 'O GOVERNADOR no uso da atribuição que lhe confere na Constituição Federal, ';
            break;
        default:
            frase1 = 'O Congresso Nacional ';
    }

    let frase2;
    if (formData.cargo === 'Presidente' && formData.categoria === 'PL' || formData.cargo === 'Governador' && formData.categoria === 'PL') {
        frase2 = 'protocola o seguinte Projeto de Lei:';
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PEC' || formData.cargo === 'Governador' && formData.categoria ==='PEC') {
        frase2 = 'protocola a seguinte Proposta de Emenda à Constituição:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PER' || formData.cargo === 'Governador' && formData.categoria ==='PER') {
        frase2 = 'protocola a seguinte Proposta de Emenda ao Regimento:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PDL' || formData.cargo === 'Governador' && formData.categoria ==='PDL') {
        frase2 = 'protocola o seguinte Projeto de Decreto Legislativo:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PLC' || formData.cargo === 'Governador' && formData.categoria ==='PLC') {
        frase2 = 'protocola o seguinte Projeto de Lei Complementar:'
    } else {
        frase2 = 'decreta:';
    }
    
    const frase12 = frase1 + frase2;

    const categoriaNomeM = categoriaNome ? categoriaNome.toUpperCase() : '';

    // Converte a data para o objeto Date
    const dataObj = new Date(formData.data + 'T00:00:00');;
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

    // Função para formatar o órgão, removendo a primeira palavra
    const formatarOrgao = (orgao) => orgao.split(' ').slice(1).join(' ');

    // Criando a variável combinada
    const cargoOrgaoFormatado = `${formData.cargo} ${formatarOrgao(formData.orgao)}`;

    // Formato Cargo
    if(formData.cargo === 'Presidente'){
        cargoFormatado = 'Presidente da República';
    } else if(formData.cargo === 'Governador'){
        cargoFormatado = 'Governador';
    } else if(formData.cargo === 'Ministro' || formData.cargo === 'Secretário'){
        cargoFormatado = `${formData.cargo} ${formatarOrgao(formData.orgao)}`;
    } else if(formData.cargo === 'Deputado'){
        cargoFormatado = 'Deputado Federal';
    } else if(formData.cargo === 'Senador'){
        cargoFormatado = 'Senador';
    }

    // Inicializando jsPDF
    const doc = new jsPDF();

    doc.setFontSize(12);
    let y = 10; // Posição inicial no eixo Y
    const pageHeight = 297; // Altura da página em mm
    const marginBottom = 20; // Margem inferior para evitar cortar texto

    // Função para verificar e adicionar quebra de página
    function verificarQuebraPagina(incrementoAltura) {
        if (y + incrementoAltura > pageHeight - marginBottom) {
            doc.addPage();
            y = 10; // Reinicia a posição Y na nova página
        }
    }

    // Carregar a imagem (Brasão)
    try {
        const imagemBase64 = await carregarImagemBase64('../img/brasao.png');
        
        // Adicionar a imagem no PDF
        doc.addImage(imagemBase64, 'PNG', 80, y, 50, 30); // X, Y, Largura, Altura
        y += 20; // Ajuste para o próximo conteúdo

    } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
    }

    // Adicionando cabeçalho
    y += 20;
    verificarQuebraPagina(10);
    doc.setFontSize(14);
    doc.setFont(formData.fonte, 'bold');
    doc.text(`${categoriaNomeM} Nº ${formData.id} DE ${dataFormatada3}`, 100, y, { align: 'center' });

    // Prefácio/ementa
    y += 20;
    doc.setFontSize(12);
    doc.setFont(formData.fonte, 'italic');
    if (formData.prefacio) {
        verificarQuebraPagina(10);
        const prefacioTexto = doc.splitTextToSize(formData.prefacio, 100);
        doc.text(prefacioTexto, 200, y, { align: 'right' });
        y += prefacioTexto.length * 6; // Ajuste para múltiplas linhas
    }

    // Texto inicial
    y += 30;
    doc.setFont(formData.fonte, 'normal');
    if (frase12) {
        verificarQuebraPagina(10);
        const fraseTexto = doc.splitTextToSize(frase12, 180);
        doc.text(fraseTexto, 10, y, { align: 'left' });
        y += fraseTexto.length * 6;
    }

    // Adicionar campos extras
    y += 10;
    for (let i = 1; i <= campoId; i++) {
        const campoExtra = document.querySelector(`textarea[name="campoExtra${i}"]`);
        if (campoExtra) {
            verificarQuebraPagina(10);
            const textoCampo = `Art. ${i}º - ${campoExtra.value}`;
            const textoQuebrado = doc.splitTextToSize(textoCampo, 180);
            doc.text(textoQuebrado, 10, y);
            y += textoQuebrado.length * 6; // Ajuste para múltiplas linhas
        }
    }

    // Adicionar texto final
    const textoFinal = `Art. ${campoId + 1}º - Este ${categoriaNome} entra em vigor na data de sua publicação.`;
    verificarQuebraPagina(10);
    const textoFinalQuebrado = doc.splitTextToSize(textoFinal, 180);
    doc.text(textoFinalQuebrado, 10, y);
    y += textoFinalQuebrado.length * 6;

    // Cidade e data
    y += 20;
    verificarQuebraPagina(10);
    doc.setFont(formData.fonte, 'normal');
    doc.text(`${formData.cidade}, ${dataFormatada2}`, 10, y, { align: 'left' });

    // Assinatura
    y += 20;
    verificarQuebraPagina(10);
    doc.setFont(formData.fonte, 'bold');
    doc.text(`${formData.nome}`, 10, y, { align: 'left' });
    y += 5;
    
    doc.setFontSize(10);
    doc.setFont(formData.fonte, 'normal');
    doc.setFont(formData.fonte, 'italic');
    doc.text(`${cargoFormatado}`, 10, y, { align: 'left' });

    // Nova página para justificativa
    doc.setFontSize(14);
    doc.setFont(formData.fonte, 'bold');
    if(formData.justificativa !== ''){
        doc.addPage();
        y = 30;
        doc.text(`JUSTIFICATIVA`, 110, y, { align: 'center' });

        // Adicionar justificativa
        y += 20;
        doc.setFontSize(12);
        doc.setFont(formData.fonte, 'normal');
        const justificativaTexto = doc.splitTextToSize(formData.justificativa, 180);
        doc.text(justificativaTexto, 10, y);
    }

    // Retornar o documento
    return doc;

}

// Mostrar os dados do formulário em uma div
function showInDiv() {
    const formData = {
        categoria: document.getElementById('categoria').value || "",
        id: document.getElementById('idnum').value || "",
        data: document.getElementById('data').value || "",
        cidade: document.getElementById('cidade').value || "",
        nome: document.getElementById('nome').value || "",
        cargo: document.getElementById('cargo').value || "",
        orgao: document.getElementById('orgao').value || "",
        estado: document.getElementById('estado').value || "",
        prefacio: document.getElementById('prefacio').value || "",
    };

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h4>Resultado:</h4>
        <p><strong>Nome:</strong> ${formData.nome}</p>
        <p><strong>Categoria:</strong> ${formData.categoria}</p>
        <p><strong>Data:</strong> ${formData.data}</p>
        <p><strong>Cidade:</strong> ${formData.cidade}</p>
        <p><strong>Prefácio:</strong> ${formData.prefacio}</p>
    `;
}

function previewPDF() {
    createPDF().then(doc => {
        const pdfBlob = doc.output("blob"); // A função output() foi corrigida para o método correto
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, "_blank");
    });
}

// Baixar o PDF
function downloadPDF() {
    const formData = {
        categoria: document.getElementById('categoria').value || "",
        id: document.getElementById('idnum').value || "",
        data: document.getElementById('data').value || "",
        cidade: document.getElementById('cidade').value || "",
        nome: document.getElementById('nome').value || "",
        cargo: document.getElementById('cargo').value || "",
        orgao: document.getElementById('orgao').value || "",
        estado: document.getElementById('estado').value || "",
        prefacio: document.getElementById('prefacio').value || "",
    };
    // Converte a data para o objeto Date
    const dataObj = new Date(formData.data + 'T00:00:00');;
    const ano = dataObj.getFullYear();
    createPDF().then(doc => {
        doc.save(`${formData.categoria} ${formData.id}/${ano}.pdf`);
    }).catch(error => {
        console.error("Erro ao criar o PDF:", error);
    });
}
