# 🔍 Distributed Tracing verteilter Anwendungen im OpenShift-Umfeld

Dieses Repository enthält alle Informationen über meine Bachelorarbeit zu Distributed Tracing, die zusammen mit der
NÜRNBERGER Versicherung entsteht.

**🚧 Work in Progress:** Die Arbeit ist noch nicht abgeschlossen!

## 📚 Kapitel

* [🧪 Proof of Concept in einem lokalen k8s-Cluster](#-proof-of-concept-in-einem-lokalen-k8s-cluster)
* [🎪 Aufbau der Beispielanwendung](#-aufbau-der-beispielanwendung)
* [🐧 Änderungen zur Verwendung in einem OpenShift-Cluster](#-änderungen-zur-verwendung-in-einem-openshift-cluster)

## 🧪 Proof of Concept in einem lokalen k8s-Cluster

### Voraussetzungen:

- lokales kubernetes-Cluster (ich verwende Docker Desktop)
- kubectl und helm installiert
- clusterweite Berechtigungen zur Installation von CRDs und Operator, etwa *cluster-admin*-Rolle

### Implementierung:

#### 1. Traefik

Traefik erstellt Tracing-Daten zu angelegten Ingress-Routen und exportiert diese an OpenTelemetry.

```shell
helm install traefik traefik --repo https://traefik.github.io/charts  -n traefik --create-namespace -f values-traefik.yml
```

#### 2. Certmanager

Certmanager erstellt und verwaltet TLS-Zertifikate für Workloads im Cluster. Wird vom Opentelemetry Operator benötigt.

```shell
helm install cert-manager cert-manager --repo https://charts.jetstack.io -n cert-manager --create-namespace --set "crds.enabled=true"
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

> ❗ **Achtung**
>
> Die Beispiel-Anwendung kommuniziert mit einer Microsoft SQL Server Datenbank, die im Voraus bereitgestellt werden
> muss.
> Folgender Befehl startet einen Container, der mit der im Deployment hinterlegten Connection URL übereinstimmt.
> ```shell
> docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrongPassword1!" -p 1433:1433 --name sample-app-mssql -d mcr.microsoft.com/mssql/server:latest
> ```

```shell
kubectl apply -f 03-sample.yml
```

### Darauf resultierende Architektur:

![Diagramm der lokalen Architektur](docs/local-architecture.drawio.svg)

## 🎪 Aufbau der Beispielanwendung

Die Beispielanwendung besteht aus drei einzelnen Deployments:

- Web-Oberfläche (Nginx + Angular CSR)
- Microservice 1 (Spring)
- Microservice 2 (Spring)

Jaeger kann nach einigen erzeugten Traces automatisch einen Graph über die Systemarchitektur erstellen.
Dafür muss folgender Container ausgeführt werden (einmalig, beendet sich nach Berechnung selbst):

```shell
kubectl port-forward service/elasticsearch 9200:9200 & \
docker run --name jaeger-deps --env STORAGE="elasticsearch" --env ES_NODES="http://host.docker.internal:9200" ghcr.io/jaegertracing/spark-dependencies/spark-dependencies
```

> ❗ **Achtung**
>
> kubectl läuft im Hintergrund weiter, wobei die Prozess-ID in der Konsole ausgegeben wird. Der Prozess kann
> `kill -9 [PID]` terminiert werden.

### Schaubild über Zusammenspiel der Komponenten

![Diagramm der Anwendung](docs/sample-app.drawio.svg)

### Instrumentalisierung der einzelnen Komponenten

#### Web-Anwendung

Keine automatische Instrumentalisierung von Nginx oder Angular, stattdessen wurde OpenTelemetry vor dem Build der
Anwendung händisch eingebunden.

Um die Traceparent-Informationen, die von Traefik bereitgestellt werden, zu verwenden und anzubinden, wird dieser Header
von Nginx in die Meta-Tags der Anwendung gespeichert.

Die Anwendung nutzt alle Instrumentalisierungen, die von `@opentelemetry/auto-instrumentations-web` bereitgestellt
werden.

#### Microservice 1

Verwendung von automatischer Instrumentalisierung und zusätzlich eigene Spans per Annotation.

Die Anwendung wird bei Deployment automatisch instrumentalisiert, allerdings wurde zusätzlich noch ein Span über einige
Methoden gelegt.

#### Microservice 2

Reine Verwendung der automatischen Instrumentalisierung.

Hier wurden keine OpenTelemetry-Dependencies eingebunden. Die Instrumentalisierung erfolgt vollständig beim Deployment.

## 🐧 Änderungen zur Verwendung in einem OpenShift-Cluster

OpenShift stellt einen eigenen, angepassten Build des OpenTelemetry Operators bereit. Dieser kann
anhand [dieser Anleitung](https://docs.openshift.com/container-platform/4.12/observability/otel/otel-installing.html)
verfügbar gemacht werden.

Dadurch entfällt außerdem die Installation von Cert-Manager, da dieser Build die Zertifikate selbst bereitstellt.
