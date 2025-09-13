

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
    
    stage('Build & Push') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            # Build image
            docker build -t $ECR_REPO:$IMAGE_TAG .
            
            # Login to ECR and push
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
            
            docker tag $ECR_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
            docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
          '''
        }
      }
    }
    
    stage('Deploy to EKS') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            # Configure kubectl
            aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME
            
            # Deploy application
            kubectl apply -f deployment-frontend.yaml
            kubectl apply -f service-frontend.yaml
            kubectl apply -f frontend-ingress.yaml
            
            # Update image and restart deployment
            kubectl set image deployment/frontend-deployment frontend=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
            kubectl rollout restart deployment/frontend-deployment
            
            # Show immediate status
            echo "=== Deployment Applied ==="
            kubectl get deployment frontend-deployment
            kubectl get pods -l app=frontend
            kubectl get svc frontend-service
            kubectl get ingress frontend-ingress
            
            # Debug pod issues
            echo "=== Pod Logs (if any pods are running) ==="
            kubectl logs -l app=frontend --tail=50 || echo "No logs available"
            
            echo "=== Pod Describe (for troubleshooting) ==="
            kubectl describe pods -l app=frontend
            
            echo "=== Application deployed to Kubernetes! ==="
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
      echo '✅ Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed!'
    }
  }
}



