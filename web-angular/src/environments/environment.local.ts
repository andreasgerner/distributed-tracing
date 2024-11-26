export const environment = {
  serviceName: "sample-app-angular",
  otelTraceUrl: "http://collector.localhost/v1/traces",
  propagateUrls: [new RegExp("company.localhost"), new RegExp("payment.localhost")],
  companyUrl: "http://company.localhost",
  paymentUrl: "http://payment.localhost"
};
