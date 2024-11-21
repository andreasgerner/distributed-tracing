export const environment = {
  serviceName: "web-angular-deployment",
  otelTraceUrl: "http://otel.localhost/v1/traces",
  propagateUrls: [new RegExp("company.localhost"), new RegExp("payment.localhost")],
  companyUrl: "http://company.localhost",
  paymentUrl: "http://payment.localhost"
};
