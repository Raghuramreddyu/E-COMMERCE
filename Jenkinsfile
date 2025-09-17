pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Quality Gates') {
            parallel {
                stage('Frontend') {
                    agent any
                    steps {
                        dir('frontend') {
                            echo '--- Installing Frontend Dependencies ---'
                            bat 'npm install'
                            echo '--- Linting Frontend ---'
                            // To enable, configure a linter (e.g., ng add @angular-eslint/schematics) and uncomment the line below.
                            // The 'lint' script is missing in frontend/package.json.
                            // bat 'npm run lint' // This line was causing the error. Ensure it is commented out.
                            echo '--- Running Frontend Tests ---'
                            bat 'npm test -- --no-watch --browsers=ChromeHeadless'
                            echo '--- Auditing Frontend Dependencies for Security ---'
                            // Fails the build if high or critical severity vulnerabilities are found
                            bat 'npm audit --audit-level=high'
                        }
                    }
                }
                stage('Backend') {
                    agent any
                    steps {
                        dir('backend') {
                            echo '--- Installing Backend Dependencies ---'
                            bat 'npm install'
                            echo '--- Linting Backend ---'
                            echo 'Skipping backend linting. To enable, add a "lint" script to backend/package.json and uncomment the line below.'
                            // bat 'npm run lint'
                            
                            echo '--- Running Backend Tests ---'
                            echo 'Skipping backend tests. To enable, configure your tests and use the command below.'
                            // bat 'npm test'

                            echo '--- Auditing Backend Dependencies for Security ---'
                            // Fails the build if high or critical severity vulnerabilities are found
                            bat 'npm audit --audit-level=high'
                        }
                    }
                }
            }
        }
       
    }
    post {
        always {
            cleanWs() // Clean up workspace after build
        }
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
