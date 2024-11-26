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

### Implementierung:

🛑 Traefik wurde nach einer ersten Testphase wieder aus der Anwendung entfernt (siehe ältere Commits), da kein Mehrwert
von dessen Nutzung festgestellt werden konnte.

#### 1. Operatoren

Im Gegensatz zum zukünftigen OpenShift-Cluster müssen der OpenTelemetry-Operator und ein Ingress-Router (ingress-nginx)
im lokalen Cluster selbst installiert werden.
Dafür werden Berechtigungen zur Installation von CRDs und Operator, etwa die *cluster-admin*-Rolle, benötigt!

```shell
helm install operators charts/operators
```

#### 2. Tracing-Anwendungen

Der folgende Helm-Chart stellt alle Management-Anwendungen bereit. Dazu gehört:

- eine Network-Policy, die erforderlichen Traffic im Cluster erlaubt
- ein OpenTelemetry Collector
- ein CORS-kompatibles Proxy für den Collector
- eine OpenTelemetry Auto-Instrumentation
- eine Jaeger-Instanz

```shell
helm install tracing charts/tracing -f charts/tracing/values-local.yaml
```

#### 3. Test-Anwendung

Zu Demonstrationszwecken wurde eine Testanwendung mit Angular-/NextJS-Weboberfläche und zwei Java-Microservices als
Backend entwickelt.
Der folgende Helm-Chart stellt diese bereit.

> ❗ **Achtung**
>
> Die Beispiel-Anwendung kommuniziert mit zwei Microsoft SQL Server Datenbanken, die im Voraus bereitgestellt werden
> müssen.
> Folgender Befehl startet zwei Container, die mit der im Deployment hinterlegten Connection URL übereinstimmt.
> ```shell
> docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrongPassword1!" -p 10001:1433 --name sample-company-mssql -d mcr.microsoft.com/mssql/server:latest && \
> docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrongPassword1!" -p 10002:1433 --name sample-payment-mssql -d mcr.microsoft.com/mssql/server:latest
> ```

```shell
helm install sample-app charts/sample-app -f charts/sample-app/values-local.yaml
```

### Darauf resultierende Architektur:

![Diagramm der lokalen Architektur](assets/local-architecture.drawio.svg)

## 🎪 Aufbau der Beispielanwendung

Die Beispielanwendung besteht aus drei einzelnen Deployments:

- Web-Oberfläche (Nginx + Angular CSR)
- Web-Oberfläche (Nginx + NextJS ISR/SSR)
- Microservice company (Spring)
- Microservice payment (Spring)

Jaeger kann nach einigen erzeugten Traces automatisch einem Graph über die Systemarchitektur erstellen.
Dafür muss folgender Container ausgeführt werden (einmalig, beendet sich nach Berechnung selbst):

```shell
kubectl port-forward -n elastic service/elasticsearch 9200:9200 & \
docker run --name jaeger-deps --env STORAGE="elasticsearch" --env ES_NODES="http://host.docker.internal:9200" ghcr.io/jaegertracing/spark-dependencies/spark-dependencies
```

> ❗ **Achtung**
>
> kubectl läuft im Hintergrund weiter, wobei die Prozess-ID in der Konsole ausgegeben wird. Der Prozess kann
> `kill -9 [PID]` terminiert werden.

### Schaubild über Zusammenspiel der Komponenten

![Diagramm der Anwendung](assets/sample-app.drawio.svg)

### Instrumentalisierung der einzelnen Komponenten

#### Web-Anwendung mit Angular

Keine automatische Instrumentalisierung von Nginx oder Angular, stattdessen wurde OpenTelemetry vor dem Build der
Anwendung händisch eingebunden.

Um die Traceparent-Informationen, die von Traefik bereitgestellt werden, zu verwenden und anzubinden, wird dieser Header
von Nginx in die Meta-Tags der Anwendung gespeichert.

Die Anwendung nutzt alle Instrumentalisierungen, die von `@opentelemetry/auto-instrumentations-web` bereitgestellt
werden.

#### Web-Anwendung mit NextJS

Vollständige, automatische Instrumentalisierung der
Anwendung. [Manuelle Einbindung der Dependencies](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
entfällt komplett, wird von Instrumentation übernommen.

#### Microservice company

Verwendung von automatischer Instrumentalisierung und zusätzlich eigene Spans per Annotation.

Die Anwendung wird bei Deployment automatisch instrumentalisiert, allerdings wurde zusätzlich noch ein Span über eine
Methode gelegt und ein zusätzliches Attribut hinzugefügt.

#### Microservice payment

Reine Verwendung der automatischen Instrumentalisierung.

Hier wurden keine OpenTelemetry-Dependencies eingebunden. Die Instrumentalisierung erfolgt vollständig beim Deployment.

### Ergebnisse des Proof of Concept

- Instrumentalisierung von Angular bzw. CSR-Apps im Allgemeinen gestaltet sich als kompliziert. Zum einen keine
  automatische Instrumentalisierung möglich, zum anderen müssen die Traces vom Client aus an eine öffentliche
  OpenTelemetry-Schnittstelle gesendet werden.
- Wenig Mehrwert bei der Nutzung von Traefik. Liefert zwar Traces zu den einzelnen Ingress-Routen, kann diese aber nicht
  verbinden, falls Anwendung selbst Trace-Header nicht weiterreicht. Ist die Anwendung so weit instrumentalisiert, dass
  sie Header annimmt und weitergibt, ist der zusätzliche Ingress-Trace redundant.

## 🐧 Änderungen zur Verwendung in einem OpenShift-Cluster

OpenShift stellt einen eigenen, angepassten Build des OpenTelemetry Operators bereit. Dieser kann
anhand [dieser Anleitung](https://docs.openshift.com/container-platform/4.12/observability/otel/otel-installing.html)
verfügbar gemacht werden.
Dadurch entfällt außerdem die Installation von Cert-Manager, da dieser Build die Zertifikate selbst bereitstellt.

Nachdem Traefik keinen Mehrwert bietet, wird auf die Installation davon ebenfalls verzichtet.

### Installation

```shell
helm install tracing charts/tracing -f charts/tracing/values-openshift.yaml
```

Zur Verwendung einer richtigen Datenbank kann unter [values-openshift](charts/sample-app/values-openshift.yaml) für den
Company- und Payment-Service eine richtige, JDBC-kompatible Connection-URL angegeben werden.
Die Verwaltung von Credentials mittels Secrets wurde nicht weiter implementiert, da dies außerhalb des Scopes dieser
Arbeit liegt.

Wird keine Datenbank-URL angegeben, verwendet der entsprechende Service eine In-Memory-Datenbank (H2).

```shell
helm install sample-app charts/sample-app -f charts/sample-app/values-openshift.yaml
```

### Darauf resultierende Architektur:

![Diagramm der OpenShift-Architektur](assets/openshift-architecture.drawio.svg)

## 💾 Images

| Komponente  | Lokales Cluster                                                  | OpenShift Cluster                                                            |
|-------------|------------------------------------------------------------------|------------------------------------------------------------------------------|
| Company     | ghcr.io/andreasgerner/distributed-tracing/sample-company:latest  | artifactory:5000/andreasgerner/distributed-tracing/sample-company:latest     |
| Payment     | ghcr.io/andreasgerner/distributed-tracing/sample-payment:latest  | artifactory:5000/andreasgerner/distributed-tracing/sample-payment:latest     |
| Web Next    | ghcr.io/andreasgerner/distributed-tracing/sample-web-next:latest | artifactory:5000/andreasgerner/distributed-tracing/sample-web-next:latest    |
| Web Angular | ghcr.io/andreasgerner/distributed-tracing/sample-web-angular:k8s | artifactory:5000/andreasgerner/distributed-tracing/sample-web-next:openshift |

**Artifactory fungiert als Mirror von ghcr, Images sind die selben!**

