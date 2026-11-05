FROM caddy:2.8.4-alpine
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
COPY index.html gate.js /srv/
COPY az/ /srv/az/
COPY ge/ /srv/ge/
COPY kz/ /srv/kz/
