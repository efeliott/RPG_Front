// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Place for additional setup if needed
    },
    baseUrl: 'http://localhost:5173', // Assurez-vous que cette URL est correcte pour votre application locale
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
