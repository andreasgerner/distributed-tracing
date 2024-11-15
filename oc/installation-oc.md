#### 0. Networkpolicy anpassen

Die Nürnberger Networkpolicy erlaubt nur bestimmte Ports. Diese müssen aber für meine Anwendung erweitert werden.

```shell
kubectl apply -f 00-networkpolicy.yml
```

#### 1. Collector für OpenTelemetry-Daten

Der Collector sammelt OpenTelemetry-Informationen aller Services ein, verarbeitet und exportiert diese.

```shell
kubectl apply -f 01-opentelemetry-collector.yml
```

#### 2. ElasticSearch

Eine ElasticSearch-Instanz speichert die Daten, die vom Collector exportiert und von Jaeger visualisiert werden.

```shell
helm install elasticsearch elasticsearch --repo https://charts.bitnami.com/bitnami -f values-elasticsearch.yml
```

#### 3. Jaeger

Mithilfe von Jaeger können Traces aus den OpenTelemetry-Daten visualisiert und nachverfolgt werden.

```shell
helm install jaeger jaeger --repo https://jaegertracing.github.io/helm-charts -f values-jaeger.yml
```

#### 4. Instrumentation

Der Operator von OpenTelemetry stellt über Instrumentalisierungen Möglichkeiten bereit, bestimmte Deployments
automatisch hinsichtlich OpenTelemetry-Metriken und -Traces zu instrumentalisieren.

```shell
kubectl apply -f 02-instrumentation.yml
```

### 5. Test-Anwendung

Eine Testanwendung mit Angular-Weboberfläche und zwei Java-Microservices als Backend repräsentiert, wie Tracing-Daten in
der Praxis aussehen und verwendet werden können.

```shell
kubectl apply -f 03-sample.yml
```
