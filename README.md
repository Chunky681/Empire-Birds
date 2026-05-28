# Empire Birds

A small static website for checking Goodgame Empire alliance protection status using the public GGE Tracker API.

Run locally from this folder:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/site/index.html
```

The page stores your last selected server and alliance in browser local storage. You can also link directly to a server/alliance:

```text
http://localhost:8080/site/index.html?server=US1&alliance=Swifties
```

The alliance picker loads the first five ranking pages for the selected server, then filters them locally while still allowing exact-name lookups through the API.

The roster is one combined table. Birded players are shown first, then the rest of the alliance, with loot visible for everyone.

Use the building filter control above the roster to add zero or more building families, then click the scan icon beside a non-birded player. With filters selected, the scan checks those buildings across that player's castles. With no filters selected, it reports every building family found. Each scan uses the heavier castle analysis endpoint on demand and adds or refreshes that player's building details in the results below the roster.
