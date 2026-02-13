# 🚀 Crypto AI Dashboard

Um dashboard de análise de criptomoedas  
com recomendações inteligentes, alertas automáticos e simulações de investimento.

🔗 Demo: (adicione o link do seu deploy aqui)

---

## 🧠 Visão Geral

Esse projeto consome dados da API pública do CoinGecko para:

- 📊 Identificar oportunidades de investimento
- 🛡️ Classificar criptomoedas por score de risco
- 🔔 Gerar alertas automáticos de mercado
- 💰 Simular compras com um orçamento definido
- 📈 Mapear oportunidades com gráficos
- 🔍 Buscar qualquer cripto existente
- 🧾 Registrar histórico de análises da IA

> ❗ **Aviso**: Este projeto **não constitui recomendação financeira.**

---

## 🧪 Tecnologias Usadas

- React + Vite
- TailwindCSS
- Recharts
- CoinGecko API (gratuita)
- LocalStorage para persistência de alertas e histórico

---

## 🚀 Funcionalidades

### 📍 Dashboard

- Exibe lista de criptomoedas com:
  - Preço atualizado
  - Alteração (%)
  - Score calculado pela IA
  - Recomendações (Comprar / Manter / Evitar)

### 🚨 Alertas

- Sistema automático que registra alertas no navegador e no painel
- Alertas persistentes via LocalStorage

### 🔍 Busca

- Campo para buscar qualquer cripto existente na CoinGecko
- Adiciona ao dashboard para análise rápida

### 💡 Histórico da IA

- Armazena as análises feitas pela IA
- Exibe em um painel com histórico visual

### 🛡️ Criptos Seguras

- Seção especial com criptos de perfil mais “seguro” segundo regras IA
- Baseado em volatilidade, volume e score

---

## 📦 Como Rodar o Projeto

Clone o repositório:

```bash
git clone https://github.com/LeonardoPastore/crypto-ai-dashboard.git
