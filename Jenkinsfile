pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        EKS_CLUSTER = 'TRY-eks'
        ECR_REPO = '869823016797.dkr.ecr.us-east-1.amazonaws.com/prasanth-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/abi11sdf/prasanth-studio-website.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t prasanth-frontend:latest .'
            }
        }

        stage('Login to ECR & Push') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh """
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
                        docker tag prasanth-frontend:latest $ECR_REPO:latest
                        docker push $ECR_REPO:latest
                    """
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh """
                        aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER

                        # Update Deployment image
                        kubectl set image deployment/frontend-deployment frontend=$ECR_REPO:latest

                        # Apply Service, Deployment, and Ingress YAMLs
                        kubectl apply -f service-frontend.yaml
                        kubectl apply -f deployment-frontend.yaml
                        kubectl apply -f frontend-ingress.yaml

                        # Restart Deployment to pick up new image
                        kubectl rollout restart deployment/frontend-deployment

                        # Optional: verify pods
                        kubectl get pods -l app=frontend
                        kubectl get svc frontend-service
                        kubectl get ingress frontend-ingress
                    """
                }
            }
        }

        stage('Clean Docker') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check logs!'
        }
    }
}
