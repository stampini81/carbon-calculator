package bdd.steps;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import bdd.support.WebDriverSupport;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Entao;
import io.cucumber.java.pt.Quando;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.opentest4j.TestAbortedException;

public class CarbonCalculatorSteps {
  private static final String ORIGIN_ID = "origin";
  private static final String DESTINATION_ID = "destination";
  private static final String DISTANCE_ID = "distance";
  private static final String RESULTS_ID = "results";
  private static final String RESULTS_CONTENT_ID = "results-content";

  private WebDriver driver;
  private WebDriverWait wait;

  @Before
  public void beforeScenario() {
    try {
      driver = WebDriverSupport.createDriver();
      WebDriverSupport.configureTimeouts(driver);
      wait = new WebDriverWait(driver, Duration.ofSeconds(8));
    } catch (Exception e) {
      throw new TestAbortedException(
          "Não foi possível iniciar o WebDriver (instale Chrome/Edge). Detalhe: " + e.getMessage(), e);
    }
  }

  @After
  public void afterScenario() {
    if (driver != null) {
      driver.quit();
    }
  }

  @Dado("que eu abro a calculadora de CO2")
  public void abrirCalculadora() {
    String url = WebDriverSupport.resolveAppUrl();
    driver.get(url);
    wait.until(ExpectedConditions.presenceOfElementLocated(By.id("calculator-form")));
  }

  @Quando("eu informo a origem {string}")
  public void informoOrigem(String origem) {
    WebElement origin = driver.findElement(By.id(ORIGIN_ID));
    origin.click();
    origin.sendKeys(Keys.chord(Keys.CONTROL, "a"));
    origin.sendKeys(origem);
    origin.sendKeys(Keys.TAB); // dispara change via blur
  }

  @Quando("eu informo o destino {string}")
  public void informoDestino(String destino) {
    WebElement destination = driver.findElement(By.id(DESTINATION_ID));
    destination.click();
    destination.sendKeys(Keys.chord(Keys.CONTROL, "a"));
    destination.sendKeys(destino);
    destination.sendKeys(Keys.TAB);
  }

  @Quando("eu seleciono o transporte {string}")
  public void selecionoTransporte(String mode) {
    driver.findElement(By.cssSelector("input[name='transport'][value='" + mode + "']")).click();
  }

  @Quando("eu habilito distância manual")
  public void habilitoDistanciaManual() {
    WebElement checkbox = driver.findElement(By.id("manual-distance"));
    if (!checkbox.isSelected()) {
      checkbox.click();
    }
    wait.until(ExpectedConditions.elementToBeClickable(By.id(DISTANCE_ID)));
  }

  @Quando("eu informo a distância manual {string}")
  public void informoDistanciaManual(String km) {
    WebElement distance = driver.findElement(By.id(DISTANCE_ID));
    distance.click();
    distance.sendKeys(Keys.chord(Keys.CONTROL, "a"));
    distance.sendKeys(km);
    distance.sendKeys(Keys.TAB);
  }

  @Quando("eu clico em {string}")
  public void clicoEm(String buttonText) {
    // The app has only one submit button; validate by text then click
    WebElement button = driver.findElement(By.cssSelector("button.form__button"));
    assertTrue(button.getText().contains(buttonText), "Botão não confere: " + button.getText());
    button.click();
  }

  @Entao("a distância deve ser preenchida com {string}")
  public void distanciaAutofill(String expected) {
    By distance = By.id(DISTANCE_ID);
    wait.until(d -> expected.equals(d.findElement(distance).getAttribute("value")));
    assertEquals(expected, driver.findElement(distance).getAttribute("value"));
  }

  @Entao("devo ver a seção de resultado")
  public void devoVerSecaoResultado() {
    By results = By.id(RESULTS_ID);
    wait.until(ExpectedConditions.not(ExpectedConditions.attributeContains(results, "class", "hidden")));
    String klass = driver.findElement(results).getAttribute("class");
    assertTrue(klass == null || !klass.contains("hidden"));
  }

  @Entao("devo ver a rota {string} para {string}")
  public void devoVerRota(String origem, String destino) {
    By content = By.id(RESULTS_CONTENT_ID);
    wait.until(ExpectedConditions.presenceOfElementLocated(content));
    String text = driver.findElement(content).getText();
    assertTrue(text.contains(origem), "Resultado não contém origem.");
    assertTrue(text.contains(destino), "Resultado não contém destino.");
  }

  @Entao("devo ver a mensagem de erro {string}")
  public void devoVerMensagemDeErro(String msg) {
    By error = By.cssSelector("#results-content .error");
    wait.until(ExpectedConditions.visibilityOfElementLocated(error));
    String text = driver.findElement(error).getText();
    assertEquals(msg, text);
  }
}
