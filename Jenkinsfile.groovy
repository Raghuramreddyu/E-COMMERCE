pipeline {
    agent any

    environment {
        // --- AWS Configuration ---
        // Replace with your 12-digit AWS account ID
        AWS_ACCOUNT_ID = "YOUR_AWS_ACCOUNT_ID"
        AWS_REGION = "us-east-1"
        
        // --- ECR Image Paths ---
        // These are constructed using your AWS details
        ECR_PATH = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        BACKEND_IMAGE_NAME = "${ECR_PATH}/e-commerce-backend"
        FRONTEND_IMAGE_NAME = "${ECR_PATH}/e-commerce-frontend"
        
        // --- Git Commit Tag ---
        // A unique tag for the Docker images based on the Git commit
        IMAGE_TAG = env.GIT_COMMIT.substring(0, 8)
    }

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
                            echo '--- Running Frontend Tests ---'
                            bat 'npm test -- --no-watch --browsers=ChromeHeadless'
                            echo '--- Auditing Frontend Dependencies for Security ---'
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
                            echo '--- Auditing Backend Dependencies for Security ---'
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
                                bat "docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile ."
                                // Use the AWS credentials stored in Jenkins
                                withCredentials([aws(credentialsId: 'aws-credentials')]) {
                                    // Log in to Amazon ECR
                                    bat "aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %ECR_PATH%"
                                    bat "docker push ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
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
                                bat "docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile ."
                                // Use the AWS credentials stored in Jenkins
                                withCredentials([aws(credentialsId: 'aws-credentials')]) {
                                    // Log in to Amazon ECR
                                    bat "aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %ECR_PATH%"
                                    bat "docker push ${BACKEND_IMAGE_NAME}:${IMAGE_TAG}"
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            agent any
            steps {
                script {
                    // Use the AWS credentials stored in Jenkins
                    withCredentials([aws(credentialsId: 'aws-credentials')]) {
                        echo '--- Configuring kubectl for EKS ---'
                        // Connect kubectl to your EKS cluster
                        bat "aws eks update-kubeconfig --name e-commerce-cluster --region %AWS_REGION%"
                        
                        echo '--- Deploying Application Manifests ---'
                        // Apply the updated YAML files
                        bat 'kubectl apply -f mysql-deployment.yaml'
                        bat 'kubectl apply -f backend-deployment.yaml'
                        bat 'kubectl apply -f frontend-deployment.yaml'
                        
                        echo '--- Updating Deployments with new image version ---'
                        // Update the running deployments with the new image tag
                        bat "kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE_NAME}:${IMAGE_TAG}"
                        bat "kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}