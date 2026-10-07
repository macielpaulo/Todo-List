const fs = require("fs");
const os = require("os");
const path = require("path");

// O binding nativo do SWC materializa o addon em um cache. Em ambientes
// restritos (containers/CI) o cache padrao (~/.cache) pode falhar por
// permissao. Usamos um diretorio temporario com modo 0700, evitando depender
// de configuracao externa. Pode ser sobrescrito por SWC_NATIVE_BINDING_CACHE.
if (!process.env.SWC_NATIVE_BINDING_CACHE) {
  const cacheDir = path.join(
    os.tmpdir(),
    `swc-native-cache-${
      typeof process.getuid === "function" ? process.getuid() : "default"
    }`
  );
  fs.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
  try {
    fs.chmodSync(cacheDir, 0o700);
  } catch {
    // Sistemas sem suporte a chmod (ex.: Windows) carregam o addon direto.
  }
  process.env.SWC_NATIVE_BINDING_CACHE = cacheDir;
}

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  transform: {
    // O projeto usa TypeScript 7 (compilador nativo), que ainda nao expoe a API
    // JavaScript consumida pelo ts-jest. O SWC transpila TS (inclusive
    // decorators e metadados do tsyringe) sem depender dessa API.
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true,
          },
          transform: { legacyDecorator: true, decoratorMetadata: true },
          target: "es2020",
        },
        module: { type: "commonjs" },
      },
    ],
  },
};
