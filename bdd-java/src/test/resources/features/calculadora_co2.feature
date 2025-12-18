# language: pt
Funcionalidade: Calculadora de Emissão de CO2
  Como usuário
  Quero calcular a emissão de CO2 de uma viagem
  Para entender o impacto ambiental e comparar modais

  Cenário: Preencher distância automaticamente quando a rota existe
    Dado que eu abro a calculadora de CO2
    Quando eu informo a origem "São Paulo, SP"
    E eu informo o destino "Rio de Janeiro, RJ"
    Então a distância deve ser preenchida com "430"

  Cenário: Calcular emissão usando o modal Carro
    Dado que eu abro a calculadora de CO2
    E eu informo a origem "São Paulo, SP"
    E eu informo o destino "Rio de Janeiro, RJ"
    E eu seleciono o transporte "car"
    Quando eu clico em "Calcular Emissão"
    Então devo ver a seção de resultado
    E devo ver a rota "São Paulo, SP" para "Rio de Janeiro, RJ"

  Cenário: Exibir erro ao informar distância inválida
    Dado que eu abro a calculadora de CO2
    E eu habilito distância manual
    E eu informo a origem "São Paulo, SP"
    E eu informo o destino "Rio de Janeiro, RJ"
    Quando eu informo a distância manual "0"
    E eu clico em "Calcular Emissão"
    Então devo ver a mensagem de erro "Informe uma distância válida."
