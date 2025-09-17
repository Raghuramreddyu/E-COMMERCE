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
        stage('Build & Push Docker Images') {
            parallel {
                stage('Frontend Image') {
                    agent any
                    steps {
                        dir('frontend') {
                            script {
                                echo '--- Building and Pushing Frontend Docker Image ---'
                                env.GIT_COMMIT = bat(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                                // Use your Docker Hub username
                                def imageName = "saiaryansoma/e-commerce-frontend:${env.GIT_COMMIT}"
                                
                                bat "docker build -t \"${imageName}\" -f Dockerfile ."
                                withCredentials([usernamePassword(credentialsId: '4bd3531a-cd7e-4df2-bbb6-18d9c051b60c', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    bat "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                                    bat "docker push \"${imageName}\""
                                }
                            }
                        }
                    }
                }
                stage('Backend Image') {
                    agent any
                    steps {
                        dir('backend') {
                            script {
                                echo '--- Building and Pushing Backend Docker Image ---'
                                env.GIT_COMMIT = bat(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                                // Use your Docker Hub username
                                def imageName = "saiaryansoma/e-commerce-backend:${env.GIT_COMMIT}"

                                bat "docker build -t \"${imageName}\" -f Dockerfile ."
                                withCredentials([usernamePassword(credentialsId: '4bd3531a-cd7e-4df2-bbb6-18d9c051b60c', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    bat "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                                    bat "docker push \"${imageName}\""
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy to Minikube') {
            agent any
            steps {
                script {
                    withEnv(['KUBECONFIG=C:\\Users\\aryan\\.kube\\config']) {
                        echo '--- Deploying Application to Minikube ---'
                        
                        // Apply the Kubernetes manifests
                        bat 'kubectl apply -f mysql-deployment.yaml'
                        bat 'kubectl apply -f backend-deployment.yaml'
                        bat 'kubectl apply -f frontend-deployment.yaml'

                        // Update the image for the deployments to the one just built
                        bat "kubectl set image deployment/backend-deployment backend=saiaryansoma/e-commerce-backend:${env.GIT_COMMIT}"
                        bat "kubectl set image deployment/frontend-deployment frontend=saiaryansoma/e-commerce-frontend:${env.GIT_COMMIT}"
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
