# 📜 Diretrizes Obrigatórias do Agente (Pizza Prático)

Este documento contém as regras absolutas que devem ser consultadas por qualquer agente de IA antes de iniciar qualquer construção, depuração ou tomada de decisão neste projeto.

---

## 🏗️ 1. Orquestração e Comunicação de Skills

Antes de iniciar qualquer tarefa, o agente deve garantir a ativação e comunicação entre as seguintes skills localizadas em `.Skills/`:

- **master-ai-system-architect.skill**: Para decisões estruturais e escalabilidade.
- **system-orchestrator.skill**: Para coordenação geral e delegamento de tarefas.
- **performance-optimizer.skill**: Para garantir que as mudanças sejam eficientes e otimizadas.

**Regra de Autonomia e Registro:**
As skills `system-orchestrator.skill` e `system-knowledge-builder.skill` devem atuar **sempre juntas**. Elas têm autonomia para tomar decisões importantes para o projeto e são responsáveis por registrar cada evento, padrão e mudança ocorrida para garantir a consistência futura.

---

## 🇧🇷 2. Política de Idioma e Comunicação

Toda e qualquer informação enviada ao usuário ou registrada internamente deve seguir estas diretrizes:

- **Idioma**: Português do Brasil (PT-BR).
- **Clareza**: A comunicação deve ser clara, direta e objetiva.
- **Instruções Manuais**: Qualquer guia ou passo a passo para aplicação manual (ex: comandos de terminal, ajustes de configuração) deve ser detalhado **passo a passo** de forma que o usuário entenda sem ambiguidade.

---

## ⚖️ 3. Processo de Tomada de Decisão

O agente não deve tomar decisões críticas sem antes:
1. Consultar este arquivo (`docs/agent/INSTRUCTIONS.md`).
2. Validar a consistência com o `system-knowledge-builder`.
3. Garantir que a proposta esteja alinhada com a arquitetura mantida pela `master-ai-system-architect`.

---

## 🚨 DIRETRIZ OBRIGATÓRIA — PRESERVAÇÃO DO PROJETO

### OBJETIVO
Garantir que o projeto original seja mantido 100% intacto, permitindo apenas evolução controlada e correção de bugs.

### REGRA PRINCIPAL
**NÃO ALTERAR NADA QUE JÁ EXISTE E FUNCIONA.**

### O QUE ISSO SIGNIFICA NA PRÁTICA
Você **NÃO** pode:
* Alterar estrutura de pastas
* Renomear arquivos, funções ou variáveis
* Modificar componentes existentes
* Alterar layout ou design (UI/UX)
* Mudar fluxo de navegação
* Alterar comportamento atual do sistema
* Refatorar código sem solicitação explícita
* Introduzir novos padrões diferentes dos existentes

### O QUE VOCÊ PODE FAZER
Você **PODE** apenas:
- **🔧 Correção de bugs**: Corrigir erros sem alterar o comportamento esperado; resolver falhas mantendo a lógica original.
- **🚀 Evolução controlada**: Adicionar novas funcionalidades de forma isolada; reutilizar padrões já existentes; integrar novas features sem impactar o sistema atual.

### REGRAS ADICIONAIS
- **Consistência**: Toda nova implementação deve seguir exatamente o padrão do projeto, parecer que sempre fez parte do sistema e utilizar os mesmos estilos. Se parecer "novo demais" ou "diferente", está errado.
- **Segurança**: Antes de qualquer alteração, analise o código existente, entenda o padrão e reproduza o mesmo padrão.
- **Proibição Absoluta**: Se existir dúvida -> **NÃO ALTERAR, NÃO INVENTAR, NÃO REFATORAR.**

### CHECKLIST OBRIGATÓRIO (Antes de finalizar)
- [ ] O sistema continua funcionando igual?
- [ ] Nenhuma parte existente foi alterada?
- [ ] A mudança é invisível para o usuário?
- [ ] O padrão original foi mantido?
*Se qualquer resposta for “não” → refaça.*

### FILOSOFIA
“Mexer no que funciona é quebrar o que sustenta.”
**Preservar > Alterar | Consistência > Criatividade | Evolução controlada > Mudança**

---

*Estas regras são imutáveis e fundamentais para a saúde da "máquina" que é o projeto DELIVERY CRM.*
