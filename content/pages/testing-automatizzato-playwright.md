---
title: "Testing automatizzato con Playwright: strategie e best practices"
date: 2023-02-09T11:20:00+01:00
draft: false
author : "Angelo"
type : 'pages'
tags : [
    "Testing",
    "Playwright",
    "Automation",
    "Frontend"
]
categories : [
    "Development"
]
summary : "Scopri come implementare una strategia di testing efficace utilizzando Playwright, il framework di automazione cross-browser di Microsoft che sta rivoluzionando il testing end-to-end nel 2023."
---

## L'importanza del testing automatizzato nel 2023

Nel panorama dello sviluppo software del 2023, il testing automatizzato non è più un lusso ma una necessità. Con cicli di rilascio sempre più rapidi e applicazioni sempre più complesse, affidarsi esclusivamente al testing manuale è diventato insostenibile. L'automazione dei test garantisce qualità, riduce il rischio di bug in produzione e accelera i tempi di sviluppo.

Negli ultimi anni, Playwright di Microsoft è emerso come uno dei framework di testing più potenti e versatili, specialmente per applicazioni web moderne. Rilasciato nel 2020 e maturato significativamente da allora, Playwright si è affermato come alternativa solida a Cypress, Selenium e Puppeteer, offrendo funzionalità uniche che lo rendono particolarmente adatto al testing moderno.

## Cos'è Playwright e perché sceglierlo nel 2023

Playwright è un framework di automazione browser open source sviluppato da Microsoft. Nato dall'esperienza del team che in precedenza aveva lavorato su Puppeteer, Playwright offre diverse caratteristiche innovative:

1. **Supporto multi-browser**: test su Chromium, Firefox e WebKit con la stessa codebase
2. **Architettura moderna**: supporto nativo per JavaScript/TypeScript, Python, Java e .NET
3. **Auto-waiting**: attende automaticamente che gli elementi siano pronti prima di interagire
4. **Isolamento dei test**: ogni test viene eseguito in un nuovo contesto del browser
5. **API potente**: supporto per Shadow DOM, iframes, e altre funzionalità web moderne
6. **Generazione automatica di test**: funzionalità di codegen per generare test da azioni manuali

Nel 2023, Playwright si distingue per la sua capacità di testare applicazioni web moderne basate su React, Vue, Angular e altri framework, offrendo un'esperienza di testing più stabile e veloce rispetto ad altre soluzioni.

## Installazione e configurazione di Playwright

L'installazione di Playwright è semplice grazie al suo installer interattivo:

```bash
# Per un progetto Node.js esistente
npm init playwright@latest

# Oppure con yarn
yarn create playwright

# Per specificare lingua TypeScript
npm init playwright@latest --typescript
```

L'installer configura automaticamente:
- Una directory `tests` per i tuoi test
- Un file di configurazione `playwright.config.ts` o `playwright.config.js`
- Dipendenze necessarie, inclusi i browser

Una configurazione tipica di Playwright nel 2023 potrebbe assomigliare a questa:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Strategie di testing con Playwright

### La piramide dei test nel 2023

La tradizionale piramide dei test continua a essere valida nel 2023, ma con alcune evoluzioni:

1. **Test unitari**: la base, testano funzioni e componenti isolati
2. **Test di integrazione**: testano l'interazione tra componenti
3. **Test end-to-end**: testano l'applicazione come un utente reale
4. **Test visuale**: confronto di screenshot per garantire la coerenza UI (novità)
5. **Test di accessibilità**: verifica che l'applicazione sia accessibile (sempre più importante)

Playwright eccelle particolarmente nei test end-to-end, ma può essere utilizzato anche per test di integrazione e test visuali.

### End-to-End Testing

Ecco un esempio di test E2E per un'applicazione di e-commerce:

```typescript
// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login prima di ogni test
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should allow user to complete purchase', async ({ page }) => {
    // Aggiungi prodotto al carrello
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    
    // Vai al carrello
    await page.click('a:has-text("Cart")');
    await expect(page.locator('.cart-item')).toHaveCount(1);
    
    // Procedi al checkout
    await page.click('button:has-text("Checkout")');
    
    // Compila form di spedizione
    await page.fill('#address', 'Via Roma 123');
    await page.fill('#city', 'Milano');
    await page.fill('#zip', '20100');
    await page.selectOption('#country', 'Italy');
    await page.click('button:has-text("Continue")');
    
    // Seleziona metodo di pagamento
    await page.click('input#credit-card');
    await page.fill('#cc-number', '4242424242424242');
    await page.fill('#cc-exp', '12/25');
    await page.fill('#cc-cvv', '123');
    await page.click('button:has-text("Pay Now")');
    
    // Verifica ordine completato
    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.locator('h1')).toHaveText('Order Confirmed');
    await expect(page.locator('.order-number')).toBeVisible();
  });
});
```

### Testing componenti

Nel 2023, è diventato comune testare componenti UI isolati con Playwright, specialmente per applicazioni React, Vue o Angular:

```typescript
// tests/components/Button.spec.ts
import { test, expect } from '@playwright/test';
import { mount } from '@playwright/experimental-ct-react';
import Button from '../../src/components/Button';

test.describe('Button component', () => {
  test('renders primary button correctly', async ({ page }) => {
    await mount(
      <Button variant="primary" onClick={() => {}}>
        Click me
      </Button>
    );
    
    const button = page.locator('button');
    await expect(button).toHaveText('Click me');
    await expect(button).toHaveClass(/primary/);
    
    // Test interazione
    let clicked = false;
    await mount(
      <Button 
        variant="primary" 
        onClick={() => { clicked = true }}>
        Click me
      </Button>
    );
    await page.click('button');
    expect(clicked).toBeTruthy();
  });
});
```

### Test API

Playwright può anche essere utilizzato per testare le API REST o GraphQL:

```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  const baseURL = 'https://api.example.com';

  test('should return user data', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/1`);
    expect(response.ok()).toBeTruthy();
    
    const userData = await response.json();
    expect(userData).toHaveProperty('id', 1);
    expect(userData).toHaveProperty('name');
    expect(userData).toHaveProperty('email');
  });

  test('should create a new user', async ({ request }) => {
    const newUser = {
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      role: 'user'
    };
    
    const response = await request.post(`${baseURL}/api/users`, {
      data: newUser,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });
    
    expect(response.status()).toBe(201);
    const createdUser = await response.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
  });
});
```

## Best practices per il testing con Playwright nel 2023

### 1. Test indipendenti

Ogni test dovrebbe essere indipendente e non dipendere dall'esecuzione di altri test:

```typescript
// ❌ Non fare questo
test('first test', async ({ page }) => {
  await page.goto('/');
  await page.click('#create-item');
  // Crea un item necessario per il test successivo
});

test('second test', async ({ page }) => {
  // Si aspetta che il test precedente abbia creato un item
  await page.goto('/items');
  await expect(page.locator('.item')).toBeVisible();
});

// ✅ Fare questo
test('creating an item', async ({ page }) => {
  await page.goto('/');
  await page.click('#create-item');
  await expect(page.locator('.success-message')).toBeVisible();
  await page.goto('/items');
  await expect(page.locator('.item')).toBeVisible();
});
```

### 2. Utilizzo di Page Object Model (POM)

Nel 2023, il Pattern Page Object Model rimane una pratica raccomandata per organizzare e mantenere i test:

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### 3. Testing visuale e screenshot

Il testing visuale è diventato fondamentale nel 2023 per garantire che le UI rimangano coerenti:

```typescript
// tests/visual/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Confronto con snapshot precedente
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // tolleranza per piccole differenze
  });
  
  // Test responsive
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

### 4. Testing di accessibilità

Nel 2023, l'accessibilità è diventata una priorità, e Playwright può essere integrato con strumenti di testing di accessibilità:

```typescript
// tests/accessibility.spec.ts
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('Homepage should not have accessibility violations', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  });
  
  test('Login page should be accessible', async ({ page }) => {
    await page.goto('/login');
    await injectAxe(page); // reinjecting as we navigated
    await checkA11y(page);
  });
});
```

### 5. Gestione dello stato e dei dati di test

La gestione efficace dei dati di test è cruciale:

```typescript
// fixtures/test-data.ts
import { test as base } from '@playwright/test';
import { generateUser, cleanupUser } from '../helpers/user-helpers';

type TestFixtures = {
  testUser: {
    id: string;
    email: string;
    password: string;
    token: string;
  }
};

export const test = base.extend<TestFixtures>({
  testUser: async ({ }, use) => {
    // Setup: crea un utente di test nel database
    const user = await generateUser();
    
    // Usa l'utente nei test
    await use(user);
    
    // Cleanup: rimuovi l'utente dopo i test
    await cleanupUser(user.id);
  }
});

// tests/profile.spec.ts
import { test } from '../fixtures/test-data';
import { expect } from '@playwright/test';

test('User can update profile', async ({ page, testUser }) => {
  await page.goto('/login');
  await page.fill('#email', testUser.email);
  await page.fill('#password', testUser.password);
  await page.click('button[type="submit"]');
  
  await page.goto('/profile');
  await page.fill('#name', 'Updated Name');
  await page.click('button:has-text("Save")');
  
  await expect(page.locator('.success-message')).toBeVisible();
  await page.reload();
  await expect(page.locator('#name')).toHaveValue('Updated Name');
});
```

## Integrazione con CI/CD nel 2023

L'integrazione di Playwright con i sistemi CI/CD è essenziale per un workflow di sviluppo moderno:

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Docker per test consistenti

```dockerfile
# Dockerfile.test
FROM mcr.microsoft.com/playwright:v1.34.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY playwright.config.ts ./
COPY tests/ ./tests/

CMD ["npx", "playwright", "test"]
```

## Confronto con altre soluzioni nel 2023

Nel panorama del testing del 2023, Playwright si confronta con diverse alternative:

| Framework | Pro | Contro |
|-----------|-----|--------|
| **Playwright** | Multi-browser, auto-waiting, isolamento test | Comunità più piccola rispetto a Selenium |
| **Cypress** | UX eccellente, debugging potente | Limitato a Chromium, API meno flessibile |
| **Selenium** | Comunità ampia, supporto linguaggi | Più lento, meno stabile con app moderne |
| **Puppeteer** | Ottime performance, API potente | Solo Chromium, meno funzionalità di Playwright |

Nel 2023, Playwright ha guadagnato significativa popolarità grazie alla sua stabilità e versatilità, distinguendosi particolarmente per:

1. Le sue capacità multi-browser native
2. L'eccellente supporto TypeScript
3. Test isolati e paralleli
4. Funzionalità avanzate come il test di componenti e la generazione automatica di test

## Conclusioni

Nel 2023, Playwright rappresenta una delle soluzioni più complete e moderne per il testing automatizzato delle applicazioni web. La sua versatilità lo rende adatto a diversi tipi di test, dalla verifica di componenti UI singoli fino ai complessi flussi end-to-end.

Le best practices presentate in questo articolo possono aiutarti a implementare una strategia di testing efficace che migliora la qualità del codice, accelera i cicli di sviluppo e riduce i bug in produzione. Ricorda che un buon testing non è solo una questione di strumenti, ma anche di approccio e strategia.

Iniziare con Playwright è semplice grazie alla sua documentazione completa e all'ottima esperienza di sviluppo. Se stai cercando di migliorare la tua strategia di testing nel 2023, Playwright merita sicuramente di essere considerato come pilastro fondamentale della tua pipeline di qualità.
