# Contributing to modelscan registry

Thanks for helping improve the registry! A few things up front:

## `models.json` is generated, not hand-edited

`models.json` is produced by an automated pipeline that fetches, normalizes, and merges several
upstream sources. **Editing `models.json` directly won't stick** — the next rebuild overwrites it.
So corrections are applied as **maintainer overrides** that the pipeline respects on every rebuild.

## How to contribute

### 1. Report a problem (easiest)

Open an issue with:

- the model `id` (or the upstream id / source you saw),
- what's wrong (wrong author, missing modality, stale price, duplicate listing, wrong canonical id…),
- a source link or evidence if you have one.

Good targets: a model split into duplicates that are actually the same; a missing or wrong `author`;
a model that should be an alias of another; an incorrect limit or capability flag.

### 2. Propose an override (faster to merge)

Add or edit an entry in [`overrides.json`](overrides.json) — a list of per-model corrections keyed
by canonical `id`. Each override may set or correct facts (author, modalities, limits, knowledge
cutoff, aliases). Include the **evidence** (source URL / upstream string) in the PR description so a
maintainer can confirm it.

Overrides take the highest precedence in the merge, so a confirmed correction always wins over the
upstream sources.

## What we don't accept

- **Prices invented or guessed** — only list-prices from an authoritative source, with evidence.
  When pricing can't be modeled cleanly, we leave it out rather than fabricate a number.
- **Aliases / wrappers / gateways / typos promoted to first-class models.** Router/product/`-free`/
  `-latest` shaped ids are not canonical models.
- **Ambiguous identities** — if it's unclear whether two ids are the same model, we keep them out
  until the evidence is sufficient.

## License

By contributing, you agree your contribution is licensed under
[CC BY 4.0](LICENSE), the same as the registry.
