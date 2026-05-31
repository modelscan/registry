# modelscan registry

**An open registry of large-language-model metadata.** One machine-consumable JSON file —
`models.json` — describing model identity, authorship, modalities, context/output limits,
capabilities, lifecycle, and per-source commercial offers (prices, endpoints, rate limits) with
the originating source kept as provenance.

Public site: <https://modelscan.io/>

## Consume it

The canonical, always-current file:

```text
https://raw.githubusercontent.com/modelscan/registry/main/models.json
```

```bash
curl -s https://raw.githubusercontent.com/modelscan/registry/main/models.json | jq '.models | length'
```

```js
const { models } = await fetch(
  'https://raw.githubusercontent.com/modelscan/registry/main/models.json',
).then((r) => r.json())
```

The file is a single object: `{ schema_version, generated_at, count, models[] }`. It is validated
in CI against [`schema/models.schema.json`](schema/models.schema.json) (JSON Schema, draft 2020-12).

## What a model looks like

```jsonc
{
  "id": "claude-opus-4-7",                  // canonical id (URL slug / program reference)
  "model": "Claude Opus 4.7",               // display name
  "author": "anthropic",                    // developer (a provider id)
  "alias_id": ["anthropic/claude-opus-4-7", "us.anthropic.claude-opus-4-7"],
  "input_modalities": ["text", "image"],
  "output_modalities": ["text"],
  "context_length": 200000,
  "max_output_tokens": 64000,
  "reasoning": true,
  "tool_calling": true,
  "release_timestamp": 1730000000,
  "endpoints": ["chat"],                    // API operations any source exposes
  "other_parameters": { "knowledge_cutoff": "2025-03" },
  "offers": [                               // one per source — prices, route, limits + provenance
    {
      "source": "openrouter",
      "currency": "USD",
      "prices": [{ "input": { "amount": 15, "unit": "per_1m_tokens" },
                   "output": { "amount": 75, "unit": "per_1m_tokens" } }]
    }
  ]
}
```

### Key ideas

- **Facts vs offers.** Top-level fields are source-agnostic *facts* merged per field across sources.
  Commercial data (prices, endpoint paths, rate limits) lives in `offers[]`, one per source, each
  carrying its `source` as provenance — so you can see where every number came from.
- **Two currencies.** USD offers come from OpenRouter / LiteLLM; CNY offers from Alibaba Bailian /
  Volcengine Ark. A model can carry both.
- **Tiered & conditional pricing.** `prices[]` is a list of tiers; a tier may carry `conditions`
  (input-length thresholds, or a `variant` label for axes like video resolution / audio).
- **Stable identity.** Dated snapshots fold to a base id; the dated/vendor-prefixed forms are kept
  in `alias_id`. `author` is always a provider id, so a developer never gets two spellings.
- **Lifecycle.** A model that disappears from every source is marked
  `deprecation: { status: "delisted", since }` and kept, never deleted.

See [`schema/models.schema.json`](schema/models.schema.json) for the full contract.

## Contributing

Corrections and additions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md). `models.json` is
machine-generated, so fixes are applied as maintainer overrides rather than direct edits to the
generated file.

## License

`models.json`, the schema, and the docs are licensed under
[**Creative Commons Attribution 4.0 International (CC BY 4.0)**](LICENSE). Use it anywhere, including
commercially — just attribute *modelscan registry* (<https://modelscan.io/>).
