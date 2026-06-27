import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/lib/inngest/functions/functions";

console.log("Inngest client ID:", inngest.id);
console.log("Number of functions:", functions.length);
console.log("Environment variables check:");
console.log(
  "- INNGEST_SIGNING_KEY:",
  process.env.INNGEST_SIGNING_KEY ? "✓ Present" : "✗ Missing"
);
console.log(
  "- INNGEST_EVENT_KEY:",
  process.env.INNGEST_EVENT_KEY ? "✓ Present" : "✗ Missing"
);
console.log(
  "- RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "✓ Present" : "✗ Missing"
);
console.log(
  "Function details:",
  functions.map((f) => ({
    id: f.id,
    name: f.name,
  }))
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
