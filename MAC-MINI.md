# Trips na Macu mini

Web běží v kontejneru trips-mini-web-1 na 127.0.0.1:8083.
Cloudflare tunel kvido-mini směruje trips.humlfamily.cz na
http://host.docker.internal:8083.

Spuštění nebo ruční aktualizace z této složky

```sh
docker compose -f docker-compose.mini.yml up -d --build
```

LaunchAgent cz.humlfamily.trips kontroluje main každých pět minut přes
scripts/mini-deploy.sh. Používá vyhrazený klon v
~/Library/Application Support/Trips/repo a místní přihlášení GitHub CLI.
Úspěšně nasazený commit ukládá do deployed-sha, chybný build zkusí příště.
Docker obnovuje běh kontejneru po restartu. Web nemá databázi ani AI rutiny.

Před přepnutím byly všechny stránky a soubory deníků porovnány pomocí
SHA-256 s původním main. Git metadata se do obrazu nekopírují.
