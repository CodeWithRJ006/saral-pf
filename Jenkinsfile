pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/CodeWithRJ006/saral-pf.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }
        
        stage('Build Next.js Application') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Build Successful! The Saral PF application compiled cleanly.'
        }
        failure {
            echo '❌ Build Failed. Please check the logs for errors.'
        }
    }
}
