import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Use Cloudflare + Google DNS to avoid system DNS issues with SRV lookups
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function connectDatabase(): Promise<void> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      console.log(`[database] Connected to MongoDB`);
      return;
    } catch (error) {
      retries++;
      console.error(
        `[database] Connection attempt ${retries}/${MAX_RETRIES} failed:`,
        error instanceof Error ? error.message : error
      );
      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  console.error("[database] Failed to connect after max retries. Exiting.");
  process.exit(1);
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("[database] Disconnected from MongoDB");
  } catch (error) {
    console.error("[database] Error disconnecting:", error);
  }
}

// Graceful shutdown
const shutdown = async () => {
  await disconnectDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
