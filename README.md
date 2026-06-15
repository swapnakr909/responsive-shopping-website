Shopwave — local dev with Jenkins + Prometheus + Grafana

Run the app and monitoring stack locally via Docker Compose:

```bash
docker-compose up -d --build
```

 Web UI: http://localhost:8080
 Prometheus: http://localhost:9090
 Grafana: http://localhost:3000
 Jenkins: http://localhost:8081

To commit and push these changes to your GitHub repository:

```bash
git add .
git commit -m "Add Jenkins, Prometheus, Grafana and docker-compose configs"
git push origin main
```

Notes:
- Grafana provisioning uses the Prometheus datasource in `grafana/provisioning/datasources/datasource.yml`.
- Prometheus config is at `prometheus/prometheus.yml`.
- The `Jenkinsfile` contains a basic Docker build pipeline; update credentials or push steps as needed.