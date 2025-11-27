# MadDev Lang / Angry dev

Have you ever been so angry that you want to type f\*ck everywhere? Say no more. Now you can. IntelliSense won’t complain, and when you’re done it all builds into clean JavaScript.

### To be able to curse in code you just need to run:

```bash
npm install -D maddev-lang maddev-ts-plugin
```

Then in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "plugins": [{ "name": "maddev-ts-plugin" }]
  }
}
```

### Here’s a f\*cking example (keep in mind mts format needs to be used for files you want to use this f\*cking library):

```mts
fucking TestClass {
  testMessage: string = "";

  fuckingConstructor() {
    fuckingThis.testMessage = "Fucking hello world!";
  }

  fuckingFunction test(): void {
    console.log(`Test, ${fuckingThis.testMessage}!`);
    fuckingConst a = 1;
    fuckingIf(a === 1) {
      console.log("Fucking condition met.");
    }
  }
}

fuckingConst testClass = fuckingNew TestClass();
testClass.test();
```

### Below the list of the potential swearing you could use in your code (it's never too much!)

```mts
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
```
