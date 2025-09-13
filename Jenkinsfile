pipeline {
  agent any
  environment {
    AWS_ACCOUNT_ID   = "869823016797"
    AWS_REGION       = "us-east-1"
    ECR_REPO         = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/prasanth-frontend"
    IMAGE_TAG        = "latest"
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
        sh 'docker build -t prasanth-frontend:latest .'
      }
    }

    stage('Login to ECR & Push') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh """
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
            docker tag prasanth-frontend:latest $ECR_REPO:$IMAGE_TAG
            docker push $ECR_REPO:$IMAGE_TAG
          """
        }
      }
    }

    stage('Deploy to EKS') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh """
            aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME

            # Apply Deployment & Service
            kubectl apply -f deployment-frontend.yaml
            kubectl apply -f service-frontend.yaml

            # Update image
            kubectl set image deployment/frontend-deployment frontend=$ECR_REPO:$IMAGE_TAG

            # Restart Deployment
            kubectl rollout restart deployment/frontend-deployment

            # Verify resources
            kubectl get pods -l app=frontend
            kubectl get svc frontend-service
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
    always {
      sh 'docker image prune -f'
    }
    success {
      echo '✅ Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed! Check logs.'
    }
  }
}


