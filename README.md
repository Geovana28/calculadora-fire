# 🔥 Calculadora F.I.R.E. — Independência Financeira

Calculadora interativa de independência financeira (Financial Independence, Retire Early) com projeções de crescimento patrimonial e renda passiva.

## 🚀 Funcionalidades

- **Simulação de Monte Carlo Estocástica (500 Caminhos)** — Modelação de Movimento Browniano Geométrico (GBM) com volatilidade anual histórica ($\sigma = 16.5\%$).
- **Risco de Sequência de Retornos (SRR)** — Cálculo em tempo real da **Taxa de Sobrevivência do Capital** e **Probabilidade de Ruína**.
- **Bandas Quantílicas de Incerteza** — Curvas de 95º percentil (Bull market), Mediana e 5º percentil (Bear market).
- **3 Cenários Tradicionais de Projeção** — Otimista, Realista e Pessimista.
- **Renda Passiva vs. Despesas** — Gráfico de cruzamento dinâmico com inflação acumulada.
- **Composição Patrimonial** — Proporção entre capital injetado e efeito bola de neve dos juros compostos.

## 🧮 Modelagem Matemática & Engenharia Financeira

### 1. Movimento Browniano Geométrico (Simulação Estocástica de Retornos)

$$W_{t+\Delta t} = W_t \cdot \exp\left( \left(\mu - \frac{1}{2}\sigma^2\right)\Delta t + \sigma \sqrt{\Delta t} \, Z \right) + \text{Aporte}$$

Onde $Z \sim \mathcal{N}(0, 1)$ gerado via transformada de Box-Muller e $\sigma = 16.5\%$ reflete a volatilidade real de índices acionários (S&P 500 / IBOVESPA).

### 2. Probabilidade de Ruína (Sequence of Returns Risk - SRR)

$$\mathbb{P}(\text{Ruína}) = \frac{1}{N_{\text{sim}}} \sum_{s=1}^{N_{\text{sim}}} \mathbb{I}\left( \min_{t} W_t^{(s)} \le 0 \right)$$

## 🛠️ Tecnologias

- JavaScript Vanilla (ES6+)
- Chart.js 4.4 (Line, Doughnut)
- CSS3 com Glassmorphism
- Google Fonts (Inter, JetBrains Mono)

## 📦 Como Executar

Abra `index.html` no navegador — Chart.js carregado via CDN.

## 📁 Estrutura

```
calculadora-fire/
├── index.html    # Layout e controles
├── script.js     # Motor financeiro e gráficos
└── style.css     # Design premium dark theme
```

## ⚠️ Hipóteses Financeiras e Limitações

1. **Retornos Log-Normais Independentes (GBM)**: O Movimento Browniano Geométrico assume choques normais independentes e identicamente distribuídos ($Z_t \sim \mathcal{N}(0,1)$), podendo subestimar eventos extremos de cauda gorda (*fat tails* / cisnes negros) e agrupamento de volatilidade (*volatility clustering*).
2. **Parâmetros Reais vs. Nominais**: As projeções consideram taxas reais descontadas da inflação média informada, abstraindo mudanças tributárias ou custos médicos extraordinários na fase de usufruto.
3. **Finalidade Educacional**: Ferramenta quantitativa de simulação estocástica; não constitui recomendação de investimento.

---

Desenvolvido por **Geovana** | Distribuído sob Licença MIT (`LICENSE`) | [Portfólio](../portfolio/index.html)
