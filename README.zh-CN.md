# modelscan registry

[English](README.md) | 简体中文

**一个开放的大模型元数据登记库。** 用一个可被程序直接消费的 JSON 文件 —— `models.json` —— 描述模型的身份、研发方、模态、上下文 / 输出上限、能力、生命周期,以及各来源的商业报价(价格、endpoint、限流),并保留每条数据的来源出处。

公开站点:<https://modelscan.io/>

## 收录范围

**1200+ 模型**,覆盖各大厂牌、全部模态 —— 文本、图像、视频、音频、embedding 与 rerank —— 每个都带身份、模态、上下文 / 输出上限、能力,以及美元和人民币双币种价格。部分样例:

- **对话与推理** —— OpenAI **GPT-5**、GPT-5 Codex、GPT-4o、o 系列;Anthropic **Claude Opus**、Claude Sonnet、Claude Haiku;Google **Gemini**;xAI **Grok**;**DeepSeek** V3 / R1;**Qwen3**(通义千问);Meta **Llama**;Mistral / Codestral;月之暗面 **Kimi K2**;智谱 **GLM-4.5**;**MiniMax**(海螺)M1 / M2。
- **图像生成** —— Google **Nano Banana**(Gemini 2.5 Flash Image)与 Nano Banana Pro、Imagen;OpenAI **GPT Image**;Black Forest Labs **FLUX**;字节跳动 **Seedream**(即梦);**Recraft**;可灵 Kling Image。
- **视频生成** —— OpenAI **Sora 2**;Google **Veo 3**;字节跳动 **Seedance 2**(即梦视频);快手 **可灵 Kling**;MiniMax **Hailuo**(海螺);阿里 **Wan**(通义万相)。
- **Embedding 与 Rerank** —— OpenAI text-embedding-3;BAAI **BGE**;**E5**;Gemini Embedding;**Cohere Rerank**;**Voyage**。
- **语音与音频** —— **Whisper**、Kokoro,以及其他 TTS / 转写模型。

事实与价格来自 OpenRouter、LiteLLM、阿里云百炼、火山方舟,所以同一个模型可以并列携带美元和人民币两种价格。

## 如何消费

规范的、始终最新的文件:

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

该文件是单个对象:`{ schema_version, generated_at, count, models[] }`。CI 会用 [`schema/models.schema.json`](schema/models.schema.json)(JSON Schema,draft 2020-12)对它做校验。

## 一条模型记录长什么样

```jsonc
{
  "id": "claude-opus-4-7",                  // 规范 id(用作 URL slug / 程序引用)
  "model": "Claude Opus 4.7",               // 展示名
  "author": "anthropic",                    // 研发方(一个 provider id)
  "alias_id": ["anthropic/claude-opus-4-7", "us.anthropic.claude-opus-4-7"],
  "input_modalities": ["text", "image"],
  "output_modalities": ["text"],
  "context_length": 200000,
  "max_output_tokens": 64000,
  "reasoning": true,
  "tool_calling": true,
  "release_timestamp": 1730000000,
  "endpoints": ["chat"],                    // 任一来源暴露的 API 操作
  "other_parameters": { "knowledge_cutoff": "2025-03" },
  "offers": [                               // 每个来源一条 —— 价格、路由、限流 + 出处
    {
      "source": "openrouter",
      "currency": "USD",
      "prices": [{ "input": { "amount": 15, "unit": "per_1m_tokens" },
                   "output": { "amount": 75, "unit": "per_1m_tokens" } }]
    }
  ]
}
```

### 核心理念

- **稳定的身份(Stable identity)。** 每个模型只有一个规范 `id`。带日期的快照会折叠回基名,
  带厂商前缀 / 带日期的写法保留在 `alias_id` 里 —— 同一个模型不会因来源不同而被拆成两条。
  `author` 永远是一个 provider id,同一研发方绝不会出现两种拼写。
- **双币种计价(Two currencies)。** 价格以其原生货币记录、绝不做有损换算:USD 来自 OpenRouter /
  LiteLLM,CNY 来自阿里云百炼 / 火山方舟。同一个模型可以同时携带两种货币的 offer,并列呈现。
- **事实与报价分离(Facts vs offers)。** 顶层字段是与来源无关的*事实*,按字段跨源合并;商业数据
  (价格、endpoint 路径、限流)放在 `offers[]` 里,每个来源一条,各自带 `source` 作为出处 ——
  每个数字的来路都可追溯。
- **阶梯与条件计价(Tiered & conditional pricing)。** `prices[]` 是一组阶梯;每个阶梯可带
  `conditions`(输入长度阈值,或用于视频分辨率 / 音频等维度的 `variant` 标签)。
- **生命周期(Lifecycle)。** 当一个模型从所有来源消失时,标记为
  `deprecation: { status: "delisted", since }` 并保留,绝不删除。

完整契约见 [`schema/models.schema.json`](schema/models.schema.json)。

## 参与贡献

欢迎提交修正与补充 —— 见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。`models.json` 由程序生成,因此修正以维护者 override 的形式应用,而不是直接编辑这份生成文件。

## 许可

`models.json`、schema 与文档均采用 [**Creative Commons Attribution 4.0 International(CC BY 4.0)**](LICENSE) 许可。可任意使用,包括商用 —— 只需署名 *modelscan registry*(<https://modelscan.io/>)。
