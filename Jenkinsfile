pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID = "869823016797"
    AWS_REGION = "us-east-1"
    ECR_REPO = "prasanth-frontend"
    IMAGE_TAG = "latest"
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
        sh '''
          aws ecr get-login-password --region $AWS_REGION | \
          docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
          
          docker tag $ECR_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
          docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
        '''
      }
    }

    stage('Deploy to EKS') {
      steps {
        sh '''
          # Update image in Kubernetes deployment
          kubectl set image deployment/frontend-deployment frontend-container=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG -n default

          # Apply service & deployment (in case of first deploy)
          kubectl apply -f deployment-frontend.yaml
          kubectl apply -f service-frontend.yaml
        '''
      }
    }
  }
}
