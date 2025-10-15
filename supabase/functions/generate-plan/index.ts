import { createClient } from 'npm:@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.1.3';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tema_aula, ano_escolar } = await req.json();
    if (!tema_aula || !ano_escolar) throw new Error("Tema e ano são obrigatórios.");

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY não foi encontrada.");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Gere um plano de aula sobre "${tema_aula}" para o "${ano_escolar}". Retorne APENAS um objeto JSON com as chaves: "introducao_ludica", "objetivo_bncc", "passo_a_passo", "rubrica_avaliacao".`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let textResponse = response.text();
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (jsonMatch && jsonMatch[0]) {
      textResponse = jsonMatch[0];
    }
    const planoGerado = JSON.parse(textResponse);

    console.log("Plano gerado:", planoGerado);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data, error } = await supabaseClient.from('planos_de_aula').insert({ tema_aula, ano_escolar, ...planoGerado }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro detalhado na execução da função:", error);

    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});