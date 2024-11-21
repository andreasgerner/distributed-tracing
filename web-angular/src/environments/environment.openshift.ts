export const environment = {
  serviceName: "web-angular-deployment",
  otelTraceUrl: "https://tracing-collector.apps.ocp-test.cloud.nuernberger.net/v1/traces",
  propagateUrls: [new RegExp("tracing-company.apps.ocp-test.cloud.nuernberger.net"), new RegExp("tracing-payment.apps.ocp-test.cloud.nuernberger.net")],
  companyUrl: "https://tracing-company.apps.ocp-test.cloud.nuernberger.net",
  paymentUrl: "https://tracing-payment.apps.ocp-test.cloud.nuernberger.net"
};
