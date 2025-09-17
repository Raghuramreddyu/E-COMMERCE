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
                        script { // Added script block to use Groovy features
                            try {
                                dir('frontend') {
                                    echo '--- Installing Frontend Dependencies ---'
                                    bat 'npm install'
                                    echo '--- Linting Frontend ---'
                                    // To enable, configure a linter (e.g., ng add @angular-eslint/schematics) and uncomment the line below.
                                    // The 'lint' script is missing in frontend/package.json.
                                    // bat 'npm run lint' // This line was causing the error. Ensure it is commented out.
                                    echo '--- Running Frontend Tests ---'
                                    bat 'npm test -- --no-watch --browsers=ChromeHeadless'

                                    echo '--- Starting Frontend Server for E2E Tests ---'
                                    // Start the Angular server in the background
                                    bat 'start /B npm start'

                                    // Wait for the server to be ready
                                    bat 'ping -n 30 127.0.0.1 > nul' // Wait for 30 seconds

                                    echo '--- Running E2E Tests ---'
                                    bat 'npx cypress run --headless --browser chrome'

                                    echo '--- Auditing Frontend Dependencies for Security ---'
                                    // Fails the build if high or critical severity vulnerabilities are found
                                    bat 'npm audit --audit-level=high'
                                }
                            } finally {
                                // Ensure the server process is killed even if tests fail
                                // This will kill all node.exe processes, which might be undesirable if other node processes are running.
                                // A more precise method would involve capturing the PID, but that's complex in Windows batch.
                                echo '--- Stopping Frontend Server ---'
                                bat 'taskkill /IM node.exe /F || true' // `|| true` to prevent pipeline failure if process not found
                            }
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
