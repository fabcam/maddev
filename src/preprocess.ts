import ts from "typescript";
import { keywordMap } from "./customKeywords.js";

/**
 * Rewrites identifiers that match custom keywords into their TypeScript spellings.
 * Uses the TypeScript scanner to avoid touching strings/comments/trivia.
 */
export function rewriteKeywordsToTS(sourceText: string): { text: string } {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /*skipTrivia*/ false,
    ts.LanguageVariant.Standard,
    sourceText
  );

  let result = "";
  let expectingClassBody = false;
  const templateStack: boolean[] = [];
  const braceStack: Array<"class" | "other"> = [];

  const insideClass = () => braceStack[braceStack.length - 1] === "class";
  const inTemplate = () => templateStack.length > 0;

  const nextToken = () => {
    let token = scanner.scan();
    if (token === ts.SyntaxKind.CloseBraceToken && inTemplate()) {
      token = scanner.reScanTemplateToken(false);
    }
    if (token === ts.SyntaxKind.TemplateHead || token === ts.SyntaxKind.TemplateMiddle) {
      templateStack.push(true);
    } else if (token === ts.SyntaxKind.TemplateTail) {
      templateStack.pop();
    }
    return token;
  };

  for (let token = nextToken(); token !== ts.SyntaxKind.EndOfFileToken; token = nextToken()) {
    const text = scanner.getTokenText();

    // Track entering/leaving class bodies based on braces after the class keyword.
    if (token === ts.SyntaxKind.ClassKeyword) {
      expectingClassBody = true;
    } else if (token === ts.SyntaxKind.OpenBraceToken) {
      braceStack.push(expectingClassBody ? "class" : "other");
      expectingClassBody = false;
    } else if (token === ts.SyntaxKind.CloseBraceToken) {
      braceStack.pop();
    }

    if (token === ts.SyntaxKind.Identifier) {
      const mapped = keywordMap[text];
      if (mapped) {
        if (mapped === "class") {
          expectingClassBody = true;
        }
        // Inside a class body, drop the "function" keyword so methods stay valid.
        if (mapped === "function" && insideClass()) {
          continue;
        }
        result += mapped;
        continue;
      }
    }

    result += text;
  }

  return { text: result };
}
