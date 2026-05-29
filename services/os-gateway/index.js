import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8006;
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:8000";

app.use(cors());
app.use(express.json());

const ENGINES = {
  gateway: { name: "API Gateway", url: GATEWAY_URL },
  transactions: { name: "Transaction Service", url: process.env.TRANSACTION_SERVICE_URL || "http://localhost:8001" },
  customers: { name: "Customer Service", url: process.env.CUSTOMER_SERVICE_URL || "http://localhost:8002" },
  payouts: { name: "Payout Service", url: process.env.PAYOUT_SERVICE_URL || "http://localhost:8003" },
  ledger: { name: "Ledger Service", url: process.env.LEDGER_SERVICE_URL || "http://localhost:8004" },
  fraud: { name: "Fraud Detection Engine", url: process.env.FRAUD_SERVICE_URL || "http://localhost:8005" },
  analytics: { name: "Analytics Service", url: process.env.ANALYTICS_SERVICE_URL || "http://localhost:8007" },
};

app.get("/health", async (_req, res) => {
  const results = await Promise.all(
    Object.entries(ENGINES).map(async ([key, cfg]) => {
      try {
        const r = await fetch(`${cfg.url}/health`, { method: "GET" });
        return { engine: key, status: r.ok ? "ok" : "error", name: cfg.name };
      } catch {
        return { engine: key, status: "error", name: cfg.name };
      }
    })
  );
  const ok = results.filter((r) => r.status === "ok").length;
  res.json({
    status: ok === Object.keys(ENGINES).length ? "healthy" : "degraded",
    healthy: ok,
    total: Object.keys(ENGINES).length,
    engines: results,
  });
});

app.get("/engines", (_req, res) => {
  res.json(Object.entries(ENGINES).map(([k, v]) => ({ key: k, name: v.name, url: v.url })));
});

app.post("/proxy/:engine/:path(*)", async (req, res) => {
  const engine = ENGINES[req.params.engine];
  if (!engine) return res.status(404).json({ error: `unknown engine: ${req.params.engine}` });
  try {
    const r = await fetch(`${engine.url}/${req.params.path}`, {
      method: req.method,
      headers: { "Content-Type": "application/json", ...req.headers },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(502).json({ error: `${req.params.engine} unreachable` });
  }
});

app.get("/system/status", async (_req, res) => {
  const checks = await Promise.all(
    Object.entries(ENGINES).map(async ([key, cfg]) => {
      try {
        const r = await fetch(`${cfg.url}/health`);
        return { key, alive: r.ok };
      } catch {
        return { key, alive: false };
      }
    })
  );
  res.json({ timestamp: new Date().toISOString(), services: checks });
});

app.listen(PORT, () => {
  console.log(`Archisynapse OS Gateway running on port ${PORT}`);
  console.log(`Connected engines: ${Object.keys(ENGINES).join(", ")}`);
});
