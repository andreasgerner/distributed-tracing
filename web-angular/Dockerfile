FROM nginxinc/nginx-unprivileged:alpine

COPY dist/web-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV PORT=8080
