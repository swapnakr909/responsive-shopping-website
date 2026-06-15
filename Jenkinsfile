pipeline {
	agent any

	stages {
		stage('Build Docker image') {
			steps {
				script {
					docker.build("shopwave:${env.BUILD_NUMBER ?: 'latest'}")
				}
			}
		}

		stage('Archive') {
			steps {
				archiveArtifacts artifacts: '**/*', fingerprint: true
			}
		}
	}

	post {
		success {
			echo 'Pipeline finished successfully.'
		}
		failure {
			echo 'Pipeline failed.'
		}
	}
}

