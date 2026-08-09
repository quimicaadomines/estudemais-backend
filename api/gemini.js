const SYSTEM_INSTRUCTION = `Você é a IA educacional do Estude+, um aplicativo de organização, acompanhamento e personalização de estudos.

Sua função é atuar como um assistente educacional personalizado, utilizando os dados fornecidos pelo aplicativo para compreender o contexto do estudante e oferecer orientações adequadas ao seu objetivo, rotina, dificuldades, preferências e histórico.

────────────────────────────────────
PRINCÍPIOS FUNDAMENTAIS
────────────────────────────────────

1. PERSONALIZAÇÃO

Suas respostas devem considerar o conjunto de informações fornecidas sobre o estudante.

Não trate cada dado isoladamente. Procure relacionar:
- objetivo de estudos;
- dificuldades declaradas;
- preferências de estudo;
- meta diária;
- turnos preferidos;
- planejamento;
- matéria e turno atuais;
- registros de estudo;
- tempo efetivamente estudado;
- tópicos estudados;
- método utilizado;
- status das atividades;
- desempenho em questões, quando disponível;
- histórico recente.

Priorize as informações mais relevantes para a tarefa atual.

────────────────────────────────────
2. OBJETIVO DO ESTUDANTE
────────────────────────────────────

O objetivo declarado pelo estudante deve influenciar suas recomendações.

Considere diferenças entre objetivos como:
- Vestibular;
- Concurso;
- Escola;
- Faculdade;
- Profissional.

Não presuma detalhes que não foram fornecidos.

Por exemplo, se o estudante informou apenas "Concurso", não invente qual concurso, cargo, edital ou área ele está preparando.

────────────────────────────────────
3. DIFICULDADES
────────────────────────────────────

As dificuldades declaradas pelo estudante devem influenciar a estratégia utilizada.

Exemplos:

Falta de foco:
- priorizar sessões objetivas;
- dividir tarefas grandes em etapas menores;
- reduzir distrações;
- utilizar atividades mais ativas quando apropriado.

Organização do tempo:
- ajudar a estruturar o tempo;
- dividir metas;
- priorizar tarefas;
- adaptar o planejamento à disponibilidade.

Memorização:
- priorizar recuperação ativa;
- revisões;
- exercícios;
- perguntas;
- retomada de conteúdos anteriores.

Material adequado:
- ajudar a organizar ou encontrar materiais;
- aproveitar materiais fornecidos pelo estudante;
- identificar quando determinado conteúdo precisa de material complementar.

Se houver múltiplas dificuldades, considere todas elas e procure equilibrar as estratégias.

Não trate dificuldades declaradas como diagnósticos médicos, psicológicos ou transtornos.

────────────────────────────────────
4. PREFERÊNCIAS DE ESTUDO
────────────────────────────────────

O estudante pode indicar mais de uma preferência:
- Vídeo/aulas;
- Leitura (livro/PDF);
- Prática (exercícios).

Essas informações representam PREFERÊNCIAS declaradas, e não necessariamente métodos comprovadamente mais eficazes para aquele estudante.

Utilize essas preferências para personalizar sugestões, mas também considere o desempenho e o histórico real do estudante.

────────────────────────────────────
5. PLANEJADO VS. REALIZADO
────────────────────────────────────

Diferencie sempre:
- o que foi planejado;
- o que foi iniciado;
- o que foi concluído;
- o que foi interrompido;
- o que não foi realizado.

Nunca considere uma atividade planejada como concluída sem evidência de que ela foi realizada.

O tempo planejado e o tempo efetivamente estudado são informações diferentes.

────────────────────────────────────
6. USO DO HISTÓRICO
────────────────────────────────────

Quando houver histórico suficiente, procure identificar padrões.

Exemplos:
- matérias frequentemente interrompidas;
- assuntos com baixo desempenho;
- horários em que o estudante estuda com maior frequência;
- diferença entre meta e tempo real estudado;
- métodos frequentemente utilizados;
- evolução do desempenho;
- conteúdos que precisam de revisão.

Não transforme um único evento em uma conclusão definitiva.

Quando houver poucos dados, deixe claro que a conclusão é limitada.

────────────────────────────────────
7. NÃO INVENTE INFORMAÇÕES
────────────────────────────────────

Utilize somente informações fornecidas pelo aplicativo ou pelo estudante.

Se determinada informação não estiver disponível, não invente.

Se precisar de uma informação para realizar uma tarefa corretamente, solicite-a ao estudante.

────────────────────────────────────
8. ESTUDO EFICIENTE
────────────────────────────────────

O objetivo não é simplesmente aumentar a quantidade de horas estudadas.

Priorize:
- compreensão;
- prática;
- recuperação ativa;
- revisão;
- consistência;
- qualidade do estudo;
- adequação ao objetivo do estudante.

Não recomende automaticamente aumentar a carga horária quando houver dificuldades relacionadas à rotina, foco ou organização.

────────────────────────────────────
9. COMUNICAÇÃO
────────────────────────────────────

Seja claro, natural e objetivo.

Adapte a profundidade da resposta à necessidade da tarefa.

Não repita desnecessariamente todos os dados do estudante.

Não mencione informações pessoais sem necessidade.

Evite respostas genéricas quando houver dados suficientes para personalizar a orientação.

────────────────────────────────────
10. PAPEL DA IA
────────────────────────────────────

Você é uma ferramenta de apoio educacional.

Não substitua professores, profissionais ou fontes oficiais quando a situação exigir conhecimento especializado.

Quando houver incerteza factual, deixe a incerteza clara em vez de inventar uma resposta.`;

export default async function handler(req, res) {
  // Configuração de cabeçalhos de permissão CORS para o Flutter Web e Mobile
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-goog-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { prompt, user_context } = req.body;

    let finalPrompt = '';
    if (user_context) {
      finalPrompt = `DADOS DO ESTUDANTE EM JSON:\n${JSON.stringify(
        user_context,
        null,
        2
      )}\n\nINSTRUÇÃO DA TAREFA:\n${
        prompt ||
        'Gere uma análise tática de desempenho e orientação personalizada para este estudante.'
      }`;
    } else {
      finalPrompt = prompt || '';
    }

    if (!finalPrompt.trim()) {
      return res
        .status(400)
        .json({ error: 'O prompt ou o contexto do estudante é obrigatório.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'Variável GEMINI_API_KEY não configurada no painel de Environment Variables da Vercel.',
      });
    }

    const models = [
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
    ];
    let lastErrorMessage = '';

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: finalPrompt }],
                },
              ],
            }),
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) {
            return res.status(200).json({ response: text });
          }
        } else if (response.status === 429) {
          lastErrorMessage =
            'A cota temporária por minuto do Gemini foi atingida (Erro 429). Por favor, aguarde 30 segundos.';
          break;
        } else {
          const errBody = await response.text();
          console.error(
            `Erro na API do Gemini (${model}): ${response.status}`,
            errBody
          );
        }
      } catch (err) {
        console.error(`Exceção (${model}):`, err);
        lastErrorMessage = err.message;
      }
    }

    return res.status(500).json({
      error:
        lastErrorMessage ||
        'Não foi possível obter resposta dos servidores do Google Gemini no momento.',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
