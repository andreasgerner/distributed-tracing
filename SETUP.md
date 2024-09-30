Add Certmanager:
`helm install cert-manager cert-manager --repo https://charts.jetstack.io -n cert-manager --create-namespace --set "crds.enabled=true"`

Add Traefik:
`helm install traefik traefik --repo https://traefik.github.io/charts  -n traefik --create-namespace -f values-traefik.yml`

Add Opentelemetry Operator:
`helm install opentelemetry-operator opentelemetry-operator --repo https://open-telemetry.github.io/opentelemetry-helm-charts  -n otel --create-namespace --set "manager.collectorImage.repository=otel/opentelemetry-collector-k8s"`

Add Opentelemetry Collector:
`kubectl apply -f 00-opentelemetry-collector.yml -n otel`

Add Jaeger Operator:
`helm install jaeger-operator jaeger-operator --repo https://jaegertracing.github.io/helm-charts  -n jaeger --create-namespace --set "rbac.clusterRole=true"`

Add Jaeger:
`kubectl apply -f 01-jaeger.yml -n jaeger`

Add Instrumentation:
`kubectl apply -f 02-instrumentation.yml`

Add Test Application:
`kubectl apply -f 03-sample.yml`
