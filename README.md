# openclaw-livestock-assistant

🐄 **AI-powered livestock assistant for OpenClaw** — Herd management, genetics, reproduction monitoring and animal health tracking.

---

## Features

- 🤖 **AI Chat Assistant** — Conversational assistant powered by OpenAI GPT-4o, specialized in livestock management (responds in Spanish)
- 🐄 **Herd Management** — Register, update and track animals with full CRUD
- 🩺 **Health Monitoring** — Vaccination records, treatments, checkups and upcoming reminders
- 🧬 **Reproduction Tracking** — Heat detection, services, pregnancy confirmations and births
- 📚 **Domain Knowledge** — Built-in database of breeds, common diseases and nutritional requirements
- 🌿 **Forage Suggestions** — Tropical forage recommendations by climate
- 📊 **Herd Statistics** — Summary stats by species, sex, health status and reproductive status

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript 5 |
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| AI | OpenAI API (GPT-4o) |
| Testing | Jest + ts-jest |
| Validation | Zod |

---

## Project Structure

```
src/
├── assistant/
│   ├── LivestockAssistant.ts   # Core AI assistant (session management + OpenAI calls)
│   ├── systemPrompt.ts         # Domain-specific system prompt and welcome message
│   └── types.ts                # Shared TypeScript interfaces and types
├── knowledge/
│   ├── breeds.ts               # Livestock breed database with filtering helpers
│   ├── diseases.ts             # Common disease database with urgency levels
│   └── nutrition.ts            # Nutritional requirements and forage suggestions
├── modules/
│   ├── AnimalManager.ts        # Animal CRUD + herd stats
│   ├── HealthMonitor.ts        # Health record management
│   └── ReproductionTracker.ts  # Reproduction event tracking
├── server/
│   ├── app.ts                  # Express application factory
│   └── routes/
│       ├── assistant.ts        # Chat session endpoints
│       └── animals.ts          # Animal management endpoints
└── index.ts                    # Entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY
```

### 3. Start the server

```bash
# Development (ts-node)
npm run dev

# Production (compiled)
npm run build
npm start
```

The server starts on `http://localhost:3000` by default.

---

## API Reference

### Health Check

```
GET /health
```

### AI Assistant

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assistant/sessions` | Create a new chat session |
| `POST` | `/api/assistant/sessions/:sessionId/messages` | Send a message |
| `GET` | `/api/assistant/sessions/:sessionId/history` | Get message history |
| `DELETE` | `/api/assistant/sessions/:sessionId` | Delete a session |

**Example — create session:**
```bash
curl -X POST http://localhost:3000/api/assistant/sessions
# { "sessionId": "...", "welcome": "¡Hola! Soy el Asistente de Ganadería..." }
```

**Example — chat:**
```bash
curl -X POST http://localhost:3000/api/assistant/sessions/<sessionId>/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cómo prevenir la mastitis en vacas lecheras?"}'
```

### Animal Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/animals` | Register a new animal |
| `GET` | `/api/animals` | List animals (filter by `?species=bovine&status=active`) |
| `GET` | `/api/animals/stats` | Herd statistics |
| `GET` | `/api/animals/:id` | Get a single animal |
| `PATCH` | `/api/animals/:id` | Update an animal |
| `DELETE` | `/api/animals/:id` | Remove an animal |

**Example — register animal:**
```bash
curl -X POST http://localhost:3000/api/animals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lola",
    "species": "bovine",
    "breed": "Holstein Friesian",
    "sex": "female",
    "birthDate": "2022-03-15",
    "weight": 420
  }'
```

---

## Domain Types

### Animal species
`bovine` · `ovine` · `caprine` · `porcine` · `equine` · `poultry`

### Animal status
`active` · `sold` · `dead` · `quarantine`

### Health status
`healthy` · `sick` · `in_treatment` · `recovered`

### Reproductive status
`open` · `pregnant` · `lactating` · `in_heat` · `served` · `not_applicable`

---

## Running Tests

```bash
npm test              # run all tests with coverage
npm run test:watch    # watch mode
```

---

## License

MIT

