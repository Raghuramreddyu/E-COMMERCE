describe('Authentication Flow', () => {
  it('should allow a user to register and then log in successfully', () => {
    // Use a unique email for each test run to avoid state conflicts
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userPassword = 'password123';

    // --- Registration Step ---
    cy.visit('/register');

    cy.get('input[formcontrolname="name"]').type('Test User');
    cy.get('input[formcontrolname="email"]').type(userEmail);
    cy.get('input[formcontrolname="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    // Assert registration success and redirection to the login page
    cy.url().should('include', '/login');
    cy.contains('Login to your account').should('be.visible');

    // --- Login Step ---
    // The page is already on /login, so we can proceed directly
    cy.get('input[formcontrolname="email"]').type(userEmail);
    cy.get('input[formcontrolname="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    // Assert login success by checking the URL and for the presence of a token
    cy.url().should('not.include', '/login');
    cy.window().its('localStorage.token').should('be.a', 'string');
  });
});