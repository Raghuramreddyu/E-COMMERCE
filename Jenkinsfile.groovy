pipeline {
    agent any

    environment {
        // --- AWS Configuration ---
        // Your specific AWS Account ID
        AWS_ACCOUNT_ID = "194722439530" 
        AWS_REGION = "us-east-1"
        
        // --- ECR Image Paths ---
        // These are constructed using your AWS details
        ECR_PATH = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        BACKEND_IMAGE_NAME = "${ECR_PATH}/e-commerce-backend"
        FRONTEND_IMAGE_NAME = "${ECR_PATH}/e-commerce-frontend"
        
        // --- Git Commit Tag ---
        // A unique tag for the Docker images based on the first 8 characters of the Git commit hash
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
                            echo '--- Installing Frontend Dependencies & Running Tests ---'
                            bat 'npm install'
                            bat 'npm test -- --no-watch --browsers=ChromeHeadless'
                        }
                    }
                }
                stage('Backend') {
                    agent any
                    steps {
                        dir('backend') {
                            echo '--- Installing Backend Dependencies ---'
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images to ECR') {
            parallel {
                stage('Frontend Image') {
                    agent any
                    steps {
                        dir('frontend') {
                            script {
                                echo "--- Building Frontend Image: ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} ---"
                                bat "docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile ."
                                withCredentials([aws(credentialsId: 'aws-credentials')]) {
                                    echo "--- Pushing Frontend Image to ECR ---"
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
                                echo "--- Building Backend Image: ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} ---"
                                bat "docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile ."
                                withCredentials([aws(credentialsId: 'aws-credentials')]) {
                                    echo "--- Pushing Backend Image to ECR ---"
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
                    withCredentials([aws(credentialsId: 'aws-credentials')]) {
                        echo '--- Configuring kubectl for EKS ---'
                        bat "aws eks update-kubeconfig --name e-commerce-cluster --region %AWS_REGION%"
                        
                        echo '--- Deploying Application Manifests ---'
                        bat 'kubectl apply -f mysql-deployment.yaml'
                        bat 'kubectl apply -f backend-deployment.yaml'
                        bat 'kubectl apply -f frontend-deployment.yaml'
                        
                        echo '--- Updating Deployments with new image version ---'
                        bat "kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE_NAME}:${IMAGE_TAG}"
                        bat "kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo '--- Cleaning up workspace and stopping lingering processes ---'
                try {
                    // This will attempt to kill the node process
                    bat 'taskkill /f /im node.exe'
                } catch (any) {
                    // If it fails (e.g., process not found), it will print this message and continue
                    echo 'No lingering node.exe processes to kill.'
                }
                cleanWs()
            }
        }
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}