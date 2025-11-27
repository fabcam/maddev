# MadDev Lang / Angry dev

Have you ever been so angry that you want to type f*ck everywhere? Say no more. Now you can. IntelliSense won’t complain, and when you’re done it all builds into clean JavaScript.

To be able to curse in code you just need to run:
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

Here’s a f*cking example:
```mts
fuckingClass TestClass {
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

Potential cursing expressions can be found in `src/customKeywords.ts`.
