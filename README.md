# Carbon Calculator (Calculadora de Carbono)

Aplicação web simples (HTML/CSS/JS puro) para estimar emissões de CO₂ por uma viagem entre cidades brasileiras, com preenchimento automático de distância (quando a rota existe), comparação entre modais e estimativa de créditos de carbono.

## Documentação do desafio (PDF)

Os materiais solicitados no desafio (fluxo/ciclo do bug, user stories, mind-map, casos de teste step-by-step e BDD) estão em:

- [docs](docs)

## O que foi feito

### UI / Layout (HTML + CSS)
- Layout com tema “eco” (fundo em gradiente verde, cards e tipografia limpa).
- Cabeçalho centralizado (título + subtítulo).
- Formulário centralizado em um card.
- Seleção de transporte em formato de cards (ícone acima do texto) com estado selecionado.
- Seções de saída (Resultado, Comparação e Créditos de Carbono) em cards.
- Spinner de carregamento no botão “Calcular”.
- Estilização adicional para as classes mais recentes:
  - `results__*` (cards de resultado)
  - `comparison__*` (cards + barra de comparação)

### Base de rotas (RoutesDB)
Arquivo: `js/routes-data.js`
- `window.RoutesDB.routes`: base em memória com dezenas de rotas brasileiras (origem/destino/distância em km).
- `RoutesDB.getAllCities()`: lista única e ordenada de cidades para preencher os `datalist`.
- `RoutesDB.findDistance(origin, destination)`: busca de distância bidirecional e case-insensitive; retorna `km` ou `null`.

### Configurações (CONFIG) + autofill de distância
Arquivo: `js/config.js`
- `window.CONFIG.EMISSION_FACTORS`: fatores de emissão (kg CO₂ por km) por modal.
- `window.CONFIG.TRANSPORT_MODES`: labels (PT-BR) por modal.
- Constantes de créditos de carbono e faixa de preço (mín/máx em BRL).
- `CONFIG.setupDistanceAutofill()`: 
  - escuta mudanças de origem/destino;
  - preenche automaticamente a distância quando a rota existe;
  - permite alternar para preenchimento manual (checkbox) e controla `readonly`.

### Motor de cálculo (Calculator)
Arquivo: `js/calculator.js`
- `Calculator.calculateEmission(distanceKm, transportMode)`: emissão em kg (com arredondamento).
- `Calculator.calculateAllModes(distanceKm)`: lista de modais com emissão e `% vs carro`, ordenada por menor emissão.
- `Calculator.calculateSavings(emission, baselineEmission)`: economia em kg e %.
- `Calculator.calculateCarbonCredits(emissionKg)`: créditos necessários com base na constante configurada.
- `Calculator.estimateCreditPrice(credits)`: estimativa de preço (mín/máx/média) em BRL.
- Mantido um “shim” de compatibilidade: `window.CarbonCalculator.calculateEmissionKg`.

### Camada de UI (UI)
Arquivo: `js/ui.js`
- Helpers de formatação (`formatNumber`, `formatCurrency`).
- Helpers de UX (`showElement`, `hideElement`, `scrollToElement`).
- Loading state do botão (`showLoading`, `hideLoading`).
- Renderização por seção:
  - `UI.renderResults()`
  - `UI.renderComparison()` (inclui barra visual)
  - `UI.renderCarbonCredits()`
  - `UI.renderError()`

### Orquestração / App
Arquivo: `js/app.js`
- Inicializa lista de cidades via `RoutesDB.getAllCities()`.
- Ativa autofill de distância via `CONFIG.setupDistanceAutofill()`.
- No submit:
  - valida campos;
  - calcula emissão e derivados (comparação, economia, créditos e estimativa de preço);
  - renderiza as seções com `UI`;
  - aplica estado de loading e faz scroll para o resultado.

## Estrutura do projeto

```text
carbon-calculator/
  index.html
  style.css
  js/
    routes-data.js
    config.js
    calculator.js
    ui.js
    app.js
```

## Como executar

Como é um projeto estático, você pode abrir o `index.html` direto no navegador.

Recomendado (para evitar limitações do navegador com alguns recursos e ter recarregamento mais fácil): subir um servidor local.

### Opção 1: VS Code (Live Server)
- Instale a extensão “Live Server”
- Clique com o botão direito em `index.html` → “Open with Live Server”

### Opção 2: Python (se tiver instalado)
```powershell
Set-Location "C:\Users\Leandro\Desktop\carbon-calculator"
python -m http.server 5500
```
Acesse: `http://localhost:5500`

## Como usar
1. Selecione **Origem** e **Destino** (a lista sugere cidades).
2. Se existir rota cadastrada, a **Distância** será preenchida automaticamente.
3. (Opcional) Marque a opção de **distância manual** para digitar o valor.
4. Escolha o **modal de transporte**.
5. Clique em **Calcular** para ver:
   - Resultado (rota, distância, emissão, transporte e economia)
   - Comparação entre modais (com barra)
   - Créditos de carbono e preço estimado

## BDD (Cucumber em Java)

Este repositório inclui um subprojeto com testes BDD usando **Cucumber + Java** (com Selenium) em `bdd-java/`.

Para executar os cenários:

```powershell
Set-Location "C:\Users\Leandro\Desktop\carbon-calculator\bdd-java"
mvn test
```

Observação: é necessário ter o **Maven** instalado e o comando `mvn` disponível no PATH.

Veja detalhes e opções (Edge/headless/URL) em `bdd-java/README.md`.

## Observações
- As distâncias são aproximadas e dependem das rotas cadastradas em `RoutesDB`.
- Fatores de emissão podem ser ajustados em `js/config.js`.

---

Autor: Leandro da Silva Stampini
