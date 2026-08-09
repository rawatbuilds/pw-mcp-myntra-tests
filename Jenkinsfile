pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.62.1-jammy'
    }
  }
  stages {
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Run Tests') {
      steps { sh 'CI=true npx playwright test' }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
    }
  }
}
