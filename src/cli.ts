#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { compileFile } from "./compiler.js";

function printHelp() {
  console.log(`uso: maddevc <archivo.mts> [--out <salida.js>] [--print]

Opciones:
  --out     Ruta del archivo JS de salida (si se omite, escribe a stdout).
  --print   Muestra el código intermedio (TypeScript tras el mapeo de keywords).
  --help    Muestra esta ayuda.
`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const inputPath = args[0];
  const outIndex = args.indexOf("--out");
  const outPath = outIndex >= 0 ? args[outIndex + 1] : undefined;
  const shouldPrint = args.includes("--print");

  const result = compileFile(inputPath);

  if (shouldPrint) {
    console.log("=== Fuente transformada a TS ===");
    console.log(result.transformedSource);
    console.log("=== JS emitido ===");
  }

  if (outPath) {
    const resolvedOut = path.resolve(outPath);
    fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
    fs.writeFileSync(resolvedOut, result.code, "utf8");
  } else {
    process.stdout.write(result.code);
  }

  if (result.diagnostics.length) {
    console.error("\nDiagnósticos:");
    for (const diag of result.diagnostics) {
      const message = diag.messageText;
      const msg = typeof message === "string" ? message : message.messageText;
      console.error(`- ${msg}`);
    }
    process.exitCode = 1;
  }
}

main();
