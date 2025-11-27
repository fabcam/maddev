import ts from "typescript";
import { rewriteKeywordsToTS } from "./preprocess.js";

export interface CompileOptions {
  module?: ts.ModuleKind;
  target?: ts.ScriptTarget;
  sourceMap?: boolean;
}

export interface CompileResult {
  code: string;
  map?: string;
  transformedSource: string;
  diagnostics: readonly ts.Diagnostic[];
}

/**
 * Transpile extended syntax code (with renamed keywords) into JavaScript.
 * Internally rewrites the keywords into TypeScript spellings and then delegates
 * to the normal TypeScript transpiler.
 */
export function compileExtended(
  sourceText: string,
  options: CompileOptions = {}
): CompileResult {
  const { text: transformedSource } = rewriteKeywordsToTS(sourceText);

  const transpileResult = ts.transpileModule(transformedSource, {
    compilerOptions: {
      module: options.module ?? ts.ModuleKind.ES2020,
      target: options.target ?? ts.ScriptTarget.ES2020,
      sourceMap: options.sourceMap ?? true
    },
    reportDiagnostics: true
  });

  return {
    code: transpileResult.outputText,
    map: transpileResult.sourceMapText ?? undefined,
    transformedSource,
    diagnostics: transpileResult.diagnostics ?? []
  };
}

/**
 * Convenience helper to compile a file's contents.
 */
export function compileFile(
  path: string,
  host: Pick<typeof ts.sys, "readFile" | "resolvePath"> = ts.sys,
  options?: CompileOptions
): CompileResult {
  const resolved = host.resolvePath(path);
  const content = host.readFile(resolved);
  if (!content) {
    throw new Error(`No se pudo leer el archivo: ${resolved}`);
  }
  return compileExtended(content, options);
}
