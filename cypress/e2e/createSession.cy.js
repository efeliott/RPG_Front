// Fonction utilitaire pour simuler une connexion
function login() {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { access_token: 'fake-jwt-token' },
    }).as('login');
  
    cy.visit('/signin');
    cy.get('input[name="email"]').type('user1@gmail.com');
    cy.get('input[name="password"]').type('123456789');
    cy.get('button[type="submit"]').click();
  
    // Attendre la redirection vers le tableau de bord
    cy.url().should('include', '/dashboard');
  }
  
  // Suite de tests pour la création de session
  describe('Session Creation', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      login();
    });
  
    it('should open the session creation modal', () => {
      // Ouvrir la modal de création de session
      cy.get('button').contains('Créer une session').click();
  
      // Vérifier que la modal s'ouvre avec les champs de titre et de description
      cy.get('h2').contains('Créer une nouvelle session').should('be.visible');
      cy.get('[data-testid="session-title-input"]').should('be.visible');
      cy.get('[data-testid="session-description-input"]').should('be.visible');
    });
  
    it('should show an error if the session title is empty', () => {
      // Ouvrir la modal de création de session
      cy.get('button').contains('Créer une session').click();
  
      // Laisser le champ titre vide et essayer de créer la session
      cy.get('[data-testid="create-session-button"]').click();
  
      // Vérifier que le message d'erreur s'affiche
      cy.get('.MuiAlert-message').contains('Le titre de la session est obligatoire.').should('be.visible');
    });
  
    it('should create a new session successfully', () => {
      // Intercepter l'appel API pour la création de session
      cy.intercept('POST', '/api/sessions', {
        statusCode: 200,
        body: {
          session: {
            id: 1,
            title: 'Nouvelle Session',
            description: 'Description de test',
          },
        },
      }).as('createSession');
  
      // Ouvrir la modal de création de session
      cy.get('button').contains('Créer une session').click();
  
      // Remplir le formulaire de création de session
      cy.get('[data-testid="session-title-input"]').type('Nouvelle Session');
      cy.get('[data-testid="session-description-input"]').type('Description de test');
      cy.get('[data-testid="create-session-button"]').click();
  
      // Vérifier que l'API de création de session a été appelée
      cy.wait('@createSession');
  
      // Vérifier que le message de succès s'affiche
      cy.get('.MuiAlert-message').contains('Session créée avec succès!').should('be.visible');
  
      // Vérifier que la modal se ferme et que la session apparaît dans la liste
      cy.get('h2').should('not.exist'); // La modal devrait être fermée
      cy.contains('Nouvelle Session').should('be.visible'); // La session nouvellement créée devrait apparaître dans la liste
    });
  });  