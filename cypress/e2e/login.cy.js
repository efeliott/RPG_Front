describe('Login Page', () => {
  beforeEach(() => {
    // Charger la page de connexion avant chaque test
    cy.visit('/signin'); // Assurez-vous que ce chemin est correct pour votre application
  });

  it('should display the login form', () => {
    // Vérifie que les éléments du formulaire de connexion sont bien présents
    cy.get('h1').contains('Se connecter');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Se connecter');
  });

  it('should show an error message for invalid credentials', () => {
    // Entrer des identifiants incorrects
    cy.get('input[name="email"]').type('wronguser@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Vérifie que le message d'erreur s'affiche
    cy.get('p').contains('Erreur: Connexion échouée. Veuillez vérifier vos identifiants.').should('be.visible');
  });

  it('should redirect to dashboard on successful login', () => {
    // Stub pour simuler une connexion réussie en interceptant l'appel API
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { access_token: 'fake-jwt-token' },
    });

    // Entrer des identifiants valides
    cy.get('input[name="email"]').type('user1@gmail.com');
    cy.get('input[name="password"]').type('123456789');
    cy.get('button[type="submit"]').click();

    // Vérifie que l’utilisateur est redirigé vers le dashboard
    cy.url().should('include', '/dashboard');
  });
});