package bdd.support;

import io.github.bonigarcia.wdm.WebDriverManager;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

public final class WebDriverSupport {
  private WebDriverSupport() {}

  public static WebDriver createDriver() {
    String browser = System.getProperty("browser", "chrome").trim().toLowerCase();
    boolean headless = Boolean.parseBoolean(System.getProperty("headless", "true"));

    switch (browser) {
      case "edge" -> {
        WebDriverManager.edgedriver().setup();
        EdgeOptions options = new EdgeOptions();
        if (headless) {
          options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1280,900");
        return new EdgeDriver(options);
      }
      case "chrome" -> {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        if (headless) {
          options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1280,900");
        return new ChromeDriver(options);
      }
      default -> throw new IllegalArgumentException("Browser não suportado: " + browser + " (use chrome ou edge)");
    }
  }

  public static String resolveAppUrl() {
    String explicit = System.getProperty("app.url");
    if (explicit != null && !explicit.isBlank()) {
      return explicit.trim();
    }

    // When running inside bdd-java/, the app is at ../index.html
    Path indexHtml = Paths.get("..", "index.html").toAbsolutePath().normalize();
    return indexHtml.toUri().toString();
  }

  public static void configureTimeouts(WebDriver driver) {
    driver.manage().timeouts().implicitlyWait(Duration.ofMillis(250));
    driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20));
    driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(20));
  }
}
