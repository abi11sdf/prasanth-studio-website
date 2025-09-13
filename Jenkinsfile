pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID = "869823016797"
    AWS_REGION = "us-east-1"
    ECR_REPO = "prasanth-frontend"
    IMAGE_TAG = "latest"
    EKS_CLUSTER_NAME = "TRY-eks"
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/abi11sdf/prasanth-studio-website.git', branch: 'main'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $ECR_REPO:$IMAGE_TAG .'
      }
    }

    stage('Push to ECR') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

            docker tag $ECR_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
            docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
          '''
        }
      }
    }

    stage('Configure kubectl') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME

            echo "Verifying cluster access..."
            kubectl get nodes --request-timeout=60s

            echo "Testing basic connectivity..."
            kubectl version --output=yaml --request-timeout=30s
          '''
        }
      }
    }

    stage('Deploy to EKS') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            echo "Deploying to EKS..."

            # Apply deployment & service
            kubectl apply -f deployment-frontend.yaml
            kubectl apply -f service-frontend.yaml

            # Update deployment image
            kubectl set image deployment/frontend-deployment frontend-container=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG -n default

            # Wait for rollout to complete
            kubectl rollout status deployment/frontend-deployment -n default --timeout=300s

            # Show status
            kubectl get pods -n default
            kubectl get services -n default
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f'
    }
    success {
      echo '✅ Deployment to EKS successful!'
    }
    failure {
      echo '❌ Deployment failed! Check the logs above.'
    }
  }
}

