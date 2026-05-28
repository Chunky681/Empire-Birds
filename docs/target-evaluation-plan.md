# Target Evaluation And Loot Activity Plan

## Summary

Empire Birds has two separate player-row scans:

- Building-detail scan: requires at least one selected building filter and renders filtered building cards grouped by castle.
- Attack-evaluation scan: evaluates each available castle for defensive strength only and renders score transparency for attack planning.

The attack score answers: "How strong does this castle look defensively?" Lower is weaker and therefore a better target. Higher is stronger and therefore a worse target.

Activity is no longer part of the attack-evaluation score. Instead, roster rows show a loot-bag indicator based on the latest positive loot gain found in the player's loot history.

## Endpoint Research

Use existing GGE Tracker API endpoints only:

- `GET /assets/items`
  - Provides building metadata, construction item metadata, effects, effect types, equipment metadata, and asset metadata.
  - Use building metadata to map `wodID` values from castle analysis to names, groups, levels, images, construction items, and defensive public order effects.
  - Do not use equipment metadata for active castellan gear because it does not indicate what a player has equipped.

- `GET /alliances/id/{allianceId}?playerNameForDistance=`
  - Already used for the roster.
  - Provides player ID, level, legendary level, alliance rank, might, loot, protection date, and update time.

- `GET /castle/search/{playerName}`
  - Discovers castles and lightweight defense levels.
  - Useful fields include castle ID, realm, type, name, position, keep, wall, gate, tower, moat, availability, and skin equipment ID.

- `GET /castle/analysis/{castleId}?kingdomId={kingdomId}`
  - Heavy endpoint used per available castle.
  - Provides buildings, towers, defenses, gates, grounds, construction items, object IDs, positions, health, damage, state, and construction completion fields.
  - Construction item IDs are mapped through the already-loaded `assets/items` payload, so building-detail cards do not need extra requests per building.
  - Defensive public order is identified from placed DECO items whose metadata includes recognized defensive `areaSpecificEffects`.
  - Damage and incomplete-construction fields are intentionally ignored for strength scoring.

- `GET /statistics/alliance/{allianceId}`
  - Used for the roster loot-bag indicator only.
  - Provides `points.player_loot_history` for all alliance players in one request, avoiding one request per roster player.
  - Find the latest positive loot gain per player. Green means within 3 hours, yellow means within 6 hours, red means within 24 hours, and translucent means no positive gain in the last 24 hours.

Active castellan gear is excluded from v1. The current API exposes equipment metadata and castle skin equipment IDs, but no current endpoint exposes a castle's active castellan gear set.

## Buildings And Signals

Primary defensive signals:

- `Watchtower, Building` and `FactionWatchtower, Building`
- `Guard, Tower`
- `Castlewall, Defence`
- Gate families: `Basic, Gate`, `Palisadegate, Gate`, `FactionGate, Gate`
- Moat families: `Basic, Moat`, `Premium, Moat`, `FactionMoat, Moat`, `FactionPMoat, Moat`
- `Keep, Building`
- Defensive support: `Guardpost`, `FactionGuardpost`, `Stronghold`, `ReinforcedVault`

Per castle, calculate:

- Defense strength from watchtower, wall, towers, gate, moat, keep, support buildings, reinforced vault, and detected defensive construction items.
- Tower score uses total upgraded tower levels across detected wall towers; only all detected towers at max level produce a 100 tower score.
- Guardhouse score uses total levels across all `Guardpost` and `FactionGuardpost` buildings; 70 total guardhouse levels produces a 100 guardhouse score.
- Hospitals are excluded because they do not directly increase defensive strength.
- Defensive construction items are detected with a conservative keyword pass over the item name, display name, comments, and generated effect text. Accepted terms include defense/defence/defensive/defending, wall, gate, moat, courtyard, castellan, and unit-wall terms. Obvious non-defensive terms such as offensive/offense, attack, flank, research, production, resource, loot, and quarry are rejected before scoring. Broad words like tower, melee, ranged, soldier, and troop are not enough by themselves because they can describe non-defensive items.
- Public order bonus as a single Defense strength stat from placed DECO items with recognized defensive `areaSpecificEffects`, including wall troop capacity and courtyard defense strength perks.
- Target value, activity strength, protection/low-risk scoring, damage, and incomplete construction are excluded from the score.

The public order bonus is folded into the final Defense strength score. It is not its own filter, scoring category, or user-adjustable weight. The current scoring blend is:

```text
final defense score = defense-building score * 80% + defensive-public-order score * 20%
```

## UI Plan

The scoring-weight panel is removed from the main page. Defense strength is the only attack-evaluation input, so it is always treated as 100% of the score.

Each player row has separate controls:

- Building-detail scan icon: fetches and renders building cards using the current building filters. It is disabled until at least one building filter is selected.
- Attack-evaluation scan icon: fetches scoring endpoints and renders target verdicts only. It ignores building filters and does not render filtered building cards.
- Loot-bag status icon: shows recent loot activity using the loot-history endpoint. Hovering shows the latest detected loot time.

Loot-bag colors:

- Green: latest positive loot gain is within 3 hours.
- Yellow: latest positive loot gain is within 6 hours.
- Red: latest positive loot gain is within 24 hours.
- Translucent: no positive loot gain found in the last 24 hours, no loot gain found in the 30-day payload, or the endpoint failed.

The player row remains expandable. The expanded attack-evaluation panel shows:

- Verdict badge: `Good target`, `Possible target`, `Hard target`, `Poor target`, or `Insufficient data`.
- Final strength score from `0-100`; lower means weaker and more attackable.
- Confidence: `High`, `Medium`, or `Low`.
- Best castle recommendation.
- Defense score breakdown and evidence rows showing the observed value, assumed score, and how the signal affected the category.
- A clickable `Construction items` row inside the Defense strength stats that opens defensive buildings with equipped build items using the same building cards as the building-detail scan.
- Closed-by-default castle tabs containing score transparency cards.
- Warnings and missing-data notes.

Building-detail castle sections remain open by default and can be closed independently. Attack-evaluation castle sections are closed by default and can be opened independently. Each attack-evaluation castle section shows:

- Castle strength score and verdict.
- Realm, type, and name.
- Defense and defensive public order notes.
- A single clickable `Public order bonus` row inside the Defense strength stats that opens the placed defense-enhancing public order pieces for that castle.
- Strength scoring evidence only; filtered building cards remain exclusive to the building-detail scan.

## Test Plan

- Verify the scoring-weight panel is not rendered.
- Verify loot bags render on the roster after alliance load.
- Verify loot bag color thresholds: green within 3 hours, yellow within 6 hours, red within 24 hours, translucent after 24 hours.
- Verify hovering the loot bag shows the latest detected loot time or a useful missing-data message.
- Scan a one-castle player and verify verdict, score, confidence, and castle details.
- Scan a multi-castle player and verify every available castle is scored independently.
- Verify building-detail scan and attack-evaluation scan can be run separately from their own player-row icons.
- Verify the score transparency cards show defense score, observed values, and assumption notes.
- Verify the `Public order bonus` Defense strength row can expand placed defense-enhancing public order pieces.
- Verify the `Construction items` Defense strength row can expand defensive buildings with equipped build items.
- Scan a birded player and verify scanning still works.
- Simulate optional endpoint failure and verify partial scoring with reduced confidence.
- Run `node --check site/app.js`.
- Verify the served page still returns HTTP `200` at `http://localhost:8080/site/index.html`.
