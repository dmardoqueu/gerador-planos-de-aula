const SUPABASE_URL = 'https://zduecmqbgqjyyxnwhbeh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdWVjbXFiZ3FqeXl4bndoYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTEyMzEsImV4cCI6MjA3NjA2NzIzMX0.HYE2izX-n4AnYuV6TEFpiHBB4vWwc5_hFIz9R8hdcGI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('plan-form');
const submitButton = document.getElementById('submit-button');
const resultContainer = document.getElementById('result-container');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

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

        if (error) {
            throw error;
        }

        const plano = data.data;
        resultDiv.innerHTML = `
            <h3>Introdução Lúdica</h3>
            <p>${plano.introducao_ludica}</p>
            <h3>Objetivo de Aprendizagem (BNCC)</h3>
            <p>${plano.objetivo_bncc}</p>
            <h3>Passo a Passo da Atividade</h3>
            <p>${plano.passo_a_passo.replace(/\n/g, '<br>')}</p>
            <h3>Rubrica de Avaliação</h3>
            <p>${plano.rubrica_avaliacao.replace(/\n/g, '<br>')}</p>
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