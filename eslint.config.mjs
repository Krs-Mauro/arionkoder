import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "jest.config.ts",
    "jest.setup.ts",
    "scripts/**"
  ]),
  {
    rules: {
      // Forbid the use of 'any' type
      "@typescript-eslint/no-explicit-any": "error",

      // Note: Type-aware rules like no-unsafe-* require languageOptions.parserOptions.project
      // which conflicts with Next.js's flat config. TypeScript's strict mode catches most issues.
      // The build process with strict TypeScript settings provides equivalent safety.

      "no-console": ["error", { allow: ["warn", "error"] }],

      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"]
    }
  }
]);

export default eslintConfig;
