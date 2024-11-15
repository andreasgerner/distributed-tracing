import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { MetaTagTraceContextPropagator } from "./meta-trace-extractor";
import { environment } from "./environments/environment";

const provider = new WebTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: environment.serviceName
  })
});

provider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter({
  url: environment.otelTraceUrl,
})));

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new MetaTagTraceContextPropagator()
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      "@opentelemetry/instrumentation-xml-http-request": {
        propagateTraceHeaderCorsUrls: environment.propagateUrls
      }
    })],
});



