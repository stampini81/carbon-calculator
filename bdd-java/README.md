# BDD (Cucumber + Java)

Este diretório contém testes BDD em **Java + Cucumber** para o projeto **carbon-calculator**.

## Requisitos

- Java 17+
- Maven 3.9+ (comando `mvn` disponível no PATH)
- Google Chrome (recomendado) **ou** Microsoft Edge

## Como executar

Dentro da pasta `bdd-java/`:

```powershell
mvn test
```

### Opções úteis

- Rodar com Edge:

```powershell
mvn test -Dbrowser=edge
```

- Rodar sem headless (abrindo o navegador):

```powershell
mvn test -Dheadless=false
```

- Apontar para uma URL específica (se você estiver servindo o app via `http://localhost:...`):

```powershell
mvn test -Dapp.url=http://localhost:5500/
```

## Onde ficam os cenários

- Features: `src/test/resources/features`
- Steps: `src/test/java/bdd/steps`
