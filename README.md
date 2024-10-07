# 🔍 Distributed Tracing verteilter Anwendungen im OpenShift-Umfeld

Dieses Repository enthält alle Informationen über meine Bachelorarbeit zu Distributed Tracing, die zusammen mit der
NÜRNBERGER Versicherung entsteht.

**🚧 Work in Progress:** Die Arbeit ist noch nicht abgeschlossen! 

## 🧪 Proof of Concept in einem lokalen k8s-Cluster

### Voraussetzungen:

- lokales kubernetes-Cluster (ich verwende Docker Desktop)
- kubectl und helm installiert
- clusterweite Berechtigungen zur Installation von CRDs und Operator, etwa *cluster-admin*-Rolle

### Implementierung:

#### 1. Certmanager

Certmanager erstellt und verwaltet TLS-Zertifikate für Workloads im Cluster.

```shell
helm install cert-manager cert-manager --repo https://charts.jetstack.io -n cert-manager --create-namespace --set "crds.enabled=true"
```

#### 2. Traefik

Traefik erstellt Tracing-Daten zu angelegten Ingress-Routen und exportiert diese an OpenTelemetry.

```shell
helm install traefik traefik --repo https://traefik.github.io/charts  -n traefik --create-namespace -f values-traefik.yml
```

#### 3. OpenTelemetry

Der Operator von OpenTelemetry erstellt und verwaltet Ressourcen bezüglich OpenTelemetry, die über CRDs angelegt werden
können.

```shell
helm install opentelemetry-operator opentelemetry-operator --repo https://open-telemetry.github.io/opentelemetry-helm-charts  -n otel --create-namespace --set "manager.collectorImage.repository=otel/opentelemetry-collector-k8s"
```

#### 4. Collector für OpenTelemetry-Daten

Der Collector sammelt OpenTelemetry-Informationen aller Services ein, verarbeitet und exportiert diese.

```shell
kubectl apply -f 01-opentelemetry-collector.yml -n otel
```

#### 5. ElasticSearch

Eine ElasticSearch-Instanz speichert die Daten, die vom Collector exportiert und von Jaeger visualisiert werden.

```shell
helm install elasticsearch elasticsearch --repo https://charts.bitnami.com/bitnami -n elastic --create-namespace -f values-elasticsearch.yml
```

#### 6. Jaeger

Mithilfe von Jaeger können Traces aus den OpenTelemetry-Daten visualisiert und nachverfolgt werden.

```shell
helm install jaeger jaeger --repo https://jaegertracing.github.io/helm-charts  -n jaeger --create-namespace -f values-jaeger.yml
```

#### 7. Instrumentation

Der Operator von OpenTelemetry stellt über Instrumentalisierungen Möglichkeiten bereit, bestimmte Deployments
automatisch hinsichtlich OpenTelemetry-Metriken und -Traces zu instrumentalisieren.

```shell
kubectl apply -f 02-instrumentation.yml
```

### 8. Test-Anwendung

Eine Testanwendung mit Angular-Weboberfläche und zwei Java-Microservices als Backend repräsentiert, wie Tracing-Daten in
der Praxis aussehen und verwendet werden können.

```shell
kubectl apply -f 03-sample.yml
```
