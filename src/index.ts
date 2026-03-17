import 'dotenv/config';
import { createApp } from './server/app';

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🐄 OpenClaw Livestock Assistant running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API docs:     http://localhost:${PORT}/api`);
});
