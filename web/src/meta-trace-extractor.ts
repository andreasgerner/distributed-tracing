import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { Context, trace, TextMapGetter } from '@opentelemetry/api';
import { parseTraceParent } from "@opentelemetry/core/build/src/trace/W3CTraceContextPropagator";

export class MetaTagTraceContextPropagator extends W3CTraceContextPropagator {

  override extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    const meta = document.querySelector('meta[name="traceparent"]');
    const traceParent = meta ? meta.getAttribute('content') : null;

    if (!traceParent) {
      return super.extract(context, carrier, getter);
    }

    const spanContext = parseTraceParent(traceParent);
    if (!spanContext) return context;

    spanContext.isRemote = true;
    return trace.setSpanContext(context, spanContext);
  }

}
