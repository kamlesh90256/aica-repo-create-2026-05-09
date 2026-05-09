# Kubernetes Deployment Guide

## Prerequisites
- Kubernetes cluster (1.19+)
- kubectl configured
- Docker registry access
- cert-manager (for SSL/TLS)
- nginx-ingress-controller

## Installation Steps

### 1. Update Configuration Files
Before deploying, update the following in `secrets.yaml`:
```yaml
DATABASE_URL: "postgresql://user:password@postgres:5432/aica"
JWT_SECRET: "your-unique-jwt-secret-key"
NEXT_PUBLIC_API_URL: "https://api.yourdomain.com"
```

And in `ingress.yaml`, replace:
- `yourdomain.com` - your main domain
- `api.yourdomain.com` - your API domain

### 2. Update Database Secrets
Edit `db-secrets.yaml`:
```yaml
username: "postgres"
password: "strong-password-here"
```

### 3. Push Docker Images
```bash
# Backend
docker build -t yourrepo/aica-backend:latest ./backend
docker push yourrepo/aica-backend:latest

# Frontend
docker build -t yourrepo/aica-frontend:latest ./frontend
docker push yourrepo/aica-frontend:latest
```

### 4. Deploy with Kustomize
```bash
kubectl apply -k ./k8s
```

Or deploy individual files:
```bash
# Deploy secrets first
kubectl apply -f k8s/db-secrets.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy database
kubectl apply -f k8s/postgres-deployment.yaml

# Deploy backend and frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

### 5. Verify Deployment
```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check deployments
kubectl get deployments

# View logs
kubectl logs -f deployment/aica-backend
kubectl logs -f deployment/aica-frontend

# Check ingress
kubectl get ingress
```

## Monitoring & Management

### Scale Replicas
```bash
kubectl scale deployment aica-backend --replicas=3
kubectl scale deployment aica-frontend --replicas=3
```

### Update Image
```bash
kubectl set image deployment/aica-backend \
  backend=yourrepo/aica-backend:v2.0
```

### View Resource Usage
```bash
kubectl top nodes
kubectl top pods
```

### Port Forward (for local testing)
```bash
kubectl port-forward svc/aica-backend 4000:80
kubectl port-forward svc/aica-frontend 3000:80
```

## Cleanup
```bash
kubectl delete -k ./k8s
```

## SSL/TLS with Let's Encrypt

Install cert-manager:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Create ClusterIssuer (cert-issuer.yaml):
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply it:
```bash
kubectl apply -f cert-issuer.yaml
```

## Security Best Practices

1. **Never commit secrets** - Use external secret managers (Vault, AWS Secrets Manager)
2. **Image scanning** - Scan images for vulnerabilities
3. **Network policies** - Restrict pod-to-pod communication
4. **RBAC** - Implement role-based access control
5. **Pod security** - Use security policies/standards
6. **Resource limits** - Already configured in deployments
7. **Health checks** - Already configured (liveness & readiness probes)

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Database connection issues
```bash
# Check postgres pod
kubectl get pod -l app=postgres
kubectl logs -l app=postgres
```

### Ingress not working
```bash
# Check ingress controller
kubectl get pods -n ingress-nginx
kubectl describe ingress aica-ingress
```
