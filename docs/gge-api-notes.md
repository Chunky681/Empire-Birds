# GGE Tracker API Notes

These are the project-specific API details used by the Empire Birds static site.

Base URL:

```text
https://api.gge-tracker.com/api/v1/
```

Every request needs the selected game server in the `gge-server` header, for example:

```text
gge-server: US1
```

Useful endpoints:

```text
GET /alliances?page=1&orderBy=might_current&orderType=DESC
```

Returns a paginated list of alliance summaries. The frontend uses this to seed the alliance picker with the strongest alliances on the selected server. Each summary includes `active_player_count`, which GGE Tracker defines as alliance members whose `loot_current` is greater than `0`; Empire Birds shows that same active count in the roster summary after an alliance is selected.

Empire Birds currently requests the first five pages and filters that loaded set locally for a faster, richer dropdown.

```text
GET /alliances/name/{allianceName}
```

Returns an exact alliance match by name, including `alliance_id`, `alliance_name`, and aggregate stats. This is used when the typed alliance is not already in the picker list.

```text
GET /alliances/id/{allianceId}?playerNameForDistance=
```

Returns the selected alliance roster. Each player includes `player_name`, `player_id`, `level`, `legendary_level`, `alliance_rank`, `might_current`, `loot_current`, `updated_at`, and `peace_disabled_at`.

Bird/protection logic:

```text
player.peace_disabled_at !== null && new Date(player.peace_disabled_at) > new Date()
```

If `peace_disabled_at` is in the future, the player is currently under the bird. The remaining bird time is the difference between `peace_disabled_at` and the browser's current time.

The roster view displays one combined list: protected players first, sorted by soonest bird end time, followed by the remaining alliance roster in API order.

Asset and building endpoints:

```text
GET /assets/items
```

Returns current item metadata, including `buildings`. Empire Birds groups building items by `name + group` to create the building filter catalog. Each grouped filter stores every matching `wodID`, the known levels, and an asset URL derived from `name + group + type`.

```text
GET /assets/images/{asset}.png
```

Returns a rendered asset image. For normal buildings, the asset name follows the GGE Tracker castle viewer pattern:

```text
{lowercase name}{lowercase group}{lowercase type}.png
```

For example, `Watchtower` + `Building` + `Level1` becomes:

```text
GET /assets/images/watchtowerbuildinglevel1.png
```

Castle endpoints:

```text
GET /castle/search/{playerName}
```

Returns the player's castles. Each castle includes `id`, `kingdomId`, `name`, `isAvailable`, and `towerLevel`. This `towerLevel` is the castle wall tower level, not the separate Watchtower building.

```text
GET /castle/analysis/{castleId}?kingdomId={kingdomId}
```

Returns full castle structure data under `data.buildings`, `data.gates`, `data.defenses`, and `data.towers`. Empire Birds uses this heavier endpoint only when the user clicks the building scan icon beside a roster name. The scan runs for that one player, including birded players, requires at least one selected building filter, matches structures by their `wodID` against those filters, and appends or refreshes that player's building rows in the results panel.

The same response also includes `constructionItems`, keyed by building `objectID`. Empire Birds maps those construction item IDs against the already-loaded `assets/items` catalog, so showing build items on scanned building cards does not require an additional request per building. Attack evaluation flags defense-assisting build items with a conservative keyword pass: it accepts defense/defence/defensive/defending, wall, gate, moat, courtyard, castellan, and unit-wall terms, then rejects obvious non-defensive terms such as offensive/offense, attack, flank, research, production, resource, loot, and quarry. Broad words like tower, melee, ranged, soldier, and troop are not enough by themselves because they caused false positives.

Placed public-order pieces are discovered the same way: `castle/analysis` provides the placed `wodID`s, and `assets/items` provides the matching building metadata. Defensive public order is identified from DECO items whose `areaSpecificEffects` include recognized defensive perks such as courtyard defense strength or wall troop capacity.

The watchtower chart uses the same `castle/search` and `castle/analysis` flow, but it is a separate roster workflow from building filters. Users select up to 5 players, scan them with the eye button, and the frontend records each available castle's max watchtower/faction watchtower level in a separate chart. Additional batches of 5 append or refresh rows in the chart. Loading a different alliance clears the chart.

Roster activity endpoint:

```text
GET /statistics/alliance/{allianceId}
```

Empire Birds uses this bulk alliance statistics endpoint to color the loot-bag icon in the main roster. The response includes `points.player_loot_history` for the alliance's players, so the frontend can avoid sending one loot-history request per roster player. The frontend looks for the latest positive loot gain per player: green within 3 hours, yellow within 6 hours, red within 24 hours, and translucent when no positive gain is found in the last 24 hours.

The same bulk history powers the bot-like activity indicator. If a player has 15 or more continuous hours of hourly positive loot increases, the bot icon is highlighted as a possible automation signal. Missing hourly samples or non-positive loot deltas break the streak.
