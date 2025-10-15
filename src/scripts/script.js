const SUPABASE_URL = 'https://zduecmqbgqjyyxnwhbeh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdWVjbXFiZ3FqeXl4bndoYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTEyMzEsImV4cCI6MjA3NjA2NzIzMX0.HYE2izX-n4AnYuV6TEFpiHBB4vWwc5_hFIz9R8hdcGI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('plan-form');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

function formatarTexto(texto) {
    if (!texto) return '';
    let textoFormatado = texto;
    textoFormatado = textoFormatado.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    textoFormatado = textoFormatado.replace(/\n/g, '<br>');
    return textoFormatado;
}

function formatarRubrica(rubrica) {
    if (!rubrica) return '';
    try {
        const rubricaJSON = JSON.parse(rubrica);

        if (rubricaJSON.criterios_de_avaliacao && Array.isArray(rubricaJSON.criterios_de_avaliacao)) {
            const itensLista = rubricaJSON.criterios_de_avaliacao.map(item => 
                `<li><strong>${item.criterio}:</strong> ${formatarTexto(item.descricao)}</li>`
            ).join('');
            return `<ul>${itensLista}</ul>`;
        } 
        else if (typeof rubricaJSON === 'object' && !Array.isArray(rubricaJSON) && Object.keys(rubricaJSON).length > 0) {
            const itensLista = Object.entries(rubricaJSON).map(([criterio, descricao]) => 
                `<li><strong>${criterio}:</strong> ${formatarTexto(descricao)}</li>`
            ).join('');
            return `<ul>${itensLista}</ul>`;
        }
    } catch (e) {
    }
    return `<p>${formatarTexto(rubrica)}</p>`;
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tema = document.getElementById('tema').value;
    const ano = document.getElementById('ano').value;

    submitButton.disabled = true;
    loadingDiv.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    errorDiv.classList.add('hidden');

    try {
        const { data, error } = await supabase.functions.invoke('generate-plan', {
            body: { tema_aula: tema, ano_escolar: ano },
        });

        if (error) throw error;

        const plano = data.data;

        let passos = plano.passo_a_passo;
        if (typeof passos === 'string') {
            try {
                passos = JSON.parse(passos);
            } catch {
                passos = [{ etapa: '1', descricao: passos }];
            }
        }

        let passosHTML = '';
        if (Array.isArray(passos)) {
            passosHTML = passos.map(p => `
                <div class="passo">
                    <h4>Etapa ${p.etapa}${p.titulo ? ` — ${p.titulo}` : ''}</h4>
                    <p>${formatarTexto(p.descricao)}</p>
                </div>
            `).join('');
        }

        resultDiv.innerHTML = `
            <h3>Introdução Lúdica</h3>
            <p>${formatarTexto(plano.introducao_ludica)}</p>

            <h3>Objetivo de Aprendizagem (BNCC)</h3>
            <p>${formatarTexto(plano.objetivo_bncc)}</p>

            <h3>Passo a Passo da Atividade</h3>
            ${passosHTML}

            <h3>Rubrica de Avaliação</h3>
            ${formatarRubrica(plano.rubrica_avaliacao)}
        `;

        resultContainer.classList.remove('hidden');

    } catch (error) {
        errorDiv.textContent = `Ocorreu um erro: ${error.message}`;
        errorDiv.classList.remove('hidden');
    } finally {
        submitButton.disabled = false;
        loadingDiv.classList.add('hidden');
    }
});