pipeline {
  agent any
  
  environment {
    AWS_DEFAULT_REGION = "us-east-1"
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
        withCredentials([aws(credentialsId: 'aws-credentials', region: 'us-east-1')]) {
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
        withCredentials([aws(credentialsId: 'aws-credentials', region: 'us-east-1')]) {
          sh '''
            # Update kubeconfig for EKS cluster
            aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME
            
            # Verify connection
            echo "Verifying cluster access..."
            kubectl get nodes
            kubectl get namespaces
          '''
        }
      }
    }
    
    stage('Deploy to EKS') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials', region: 'us-east-1')]) {
          sh '''
            # Apply service & deployment files first
            kubectl apply -f deployment-frontend.yaml
            kubectl apply -f service-frontend.yaml
            
            # Update image in Kubernetes deployment
            kubectl set image deployment/frontend-deployment frontend-container=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG -n default
            
            # Wait for rollout to complete
            kubectl rollout status deployment/frontend-deployment -n default --timeout=300s
            
            # Verify deployment
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
      echo 'Deployment to TRY-eks cluster successful!'
    }
    failure {
      echo 'Deployment failed! Check the logs above.'
    }
  }
}
