// TypeScript Language Service plugin that rewrites custom keywords to their
// TypeScript counterparts before IntelliSense/diagnostics run.
const keywordMap = {
  fucking: "class",
  fuckingFunction: "function",
  fuckingReturn: "return",
  fuckingExtends: "extends",
  fuckingImplements: "implements",
  fuckingPublic: "public",
  fuckingPrivate: "private",
  fuckingProtected: "protected",
  fuckingStatic: "static",
  fuckingAbstract: "abstract",
  fuckingNew: "new",
  fuckingInterface: "interface",
  fuckingType: "type",
  fuckingVar: "var",
  fuckingConst: "const",
  fuckingLet: "let",
  fuckingConstructor: "constructor",
  fuckingThis: "this",
  fuckingSuper: "super",
  fuckingIf: "if",
  fuckingElse: "else",
  fuckingSwitch: "switch",
  fuckingCase: "case",
  fuckingDefault: "default",
  fuckingFor: "for",
  fuckingWhile: "while",
  fuckingDo: "do",
  fuckingBreak: "break",
  fuckingContinue: "continue",
  fuckingTry: "try",
  fuckingCatch: "catch",
  fuckingFinally: "finally",
  fuckingThrow: "throw",
  fuckingImport: "import",
  fuckingExport: "export",
  fuckingFrom: "from",
  fuckingAs: "as",
  fuckingNamespace: "namespace",
  fuckingModule: "module",
  fuckingDeclare: "declare",
  fuckingReadonly: "readonly",
  fuckingGet: "get",
  fuckingSet: "set"
};

function rewriteKeywordsToTS(ts, sourceText) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /*skipTrivia*/ false,
    ts.LanguageVariant.Standard,
    sourceText
  );

  let result = "";
  let expectingClassBody = false;
  const templateStack = [];
  const braceStack = [];

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
        if (mapped === "function" && insideClass()) {
          continue;
        }
        result += mapped;
        continue;
      }
    }

    result += text;
  }

  return result;
}

function init(modules) {
  const ts = modules.typescript;

  function create(info) {
    const host = info.languageServiceHost;
    const getScriptSnapshot = host.getScriptSnapshot?.bind(host);
    if (!getScriptSnapshot) return info.languageService;

    const cache = new Map();

    host.getScriptSnapshot = (fileName) => {
      if (!fileName.endsWith(".mts")) {
        return getScriptSnapshot(fileName);
      }

      const version = host.getScriptVersion ? host.getScriptVersion(fileName) : undefined;
      const cached = cache.get(fileName);
      if (cached && cached.version === version) {
        return cached.snapshot;
      }

      const original = getScriptSnapshot(fileName);
      if (!original) return original;
      const text = original.getText(0, original.getLength());
      const rewritten = rewriteKeywordsToTS(ts, text);
      const snapshot = ts.ScriptSnapshot.fromString(rewritten);
      cache.set(fileName, { version, snapshot });
      return snapshot;
    };

    return info.languageService;
  }

  return { create };
}

module.exports = init;
