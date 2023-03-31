// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Traceroute from "nodejs-traceroute";
import { join } from "path";

export default async function handler(req, res) {
  const traceStartTime = Date.now();
  try {
    const tracer = new Traceroute();
    // Override the default command as this command is not available on the Edgio serverless environment
    tracer.command = join(process.cwd(), "bin", "traceroute");
    tracer
      .on("pid", (pid) => {
        console.log(`pid: ${pid}`, { traceStartTime });
      })
      .on("destination", (destination) => {
        console.log(`destination: ${destination}`, { traceStartTime });
      })
      .on("hop", (hop) => {
        console.log(`hop: ${JSON.stringify(hop)}`, { traceStartTime });
      })
      .on("close", (code) => {
        console.log(`close: code ${code}`, { traceStartTime });
      });

    tracer.trace("google.com");
  } catch (ex) {
    console.log(ex);
  }

  // Wait 10s as lambda may exit before there's any output. We could also wrap the trace with promise, but it
  // may take longer than our lambda timeout.
  await new Promise((resolve) => setTimeout(resolve, 10000));

  res.status(200).json({ message: "ok" });
}
