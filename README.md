# maddev-lang (skeleton)

Minimal prototype that accepts renamed keywords and compiles to JavaScript using TypeScript under the hood.

## Flow

1. `rewriteKeywordsToTS` uses the TypeScript scanner to detect identifiers that match our map (`src/customKeywords.ts`) and replaces them with the original keywords without touching strings/comments.
2. `compileExtended` transpiles the resulting text with `ts.transpileModule`, producing JS and an optional sourcemap.
3. `maddevc` (CLI) lets you compile `.mts` files.

## Usage

```bash
# install deps
npm install

# build and run the example
npm run build
node dist/cli.js examples/test.mts --print
node dist/cli.js examples/test.mts --out dist/test.js
```

You can also run directly with ts-node while iterating:

```bash
npm run dev -- examples/test.mts --print
```

## Extend

- Add or change keywords in `src/customKeywords.ts`.
- If you want more syntactic sugar beyond simple keyword replacement, add an extra transformation step in `compileExtended` before handing off to TypeScript.
- For richer diagnostics/AST work, you could replace `ts.transpileModule` with a normal `Program` (`ts.createProgram`) and walk the AST.

### Modify keyword mappings

1. Update both maps: `src/customKeywords.ts` (compiler) and `ts-plugin/index.js` (IntelliSense).
2. Refresh the plugin install (it is local): `npm install` (or `npm install --force` if VSCode cached it).
3. Rebuild the CLI if needed: `npm run build`.
4. Restart the TS server in VSCode (Cmd/Ctrl + Shift + P → “TypeScript: Restart TS server”) so the plugin picks up the new map.

## VSCode IntelliSense

Use the bundled TS Language Service plugin so VSCode understands the renamed keywords:

1) Install the local plugin dependency (if you haven’t): `npm install`
2) In your `tsconfig.json`, add:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "plugins": [{ "name": "maddev-ts-plugin" }]
  }
}
```
3) Restart the TypeScript server in VSCode (Cmd/Ctrl + Shift + P → “TypeScript: Restart TS server”).
4) Open your `.mts` files; IntelliSense should stop flagging the custom keywords as unknown.

If VSCode can’t resolve the plugin, ensure you’re using the workspace TypeScript version (Cmd/Ctrl + Shift + P → “TypeScript: Select TypeScript Version” → “Use Workspace Version”) and that `node_modules/maddev-ts-plugin` exists (run `npm install` again if not).

## Note

This is intentionally minimal: it does not modify the TypeScript parser, it only rewrites keyword tokens. It’s a good first step to validate the dialect and keep extending.
