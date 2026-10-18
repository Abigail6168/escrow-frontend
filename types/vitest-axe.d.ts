/**
 * Type augmentation for vitest-axe's `toHaveNoViolations` matcher.
 *
 * vitest-axe 0.1.0's `extend-expect.d.ts` augments `namespace Vi` which was
 * the convention in older vitest versions. Vitest 4.x uses module augmentation
 * on `@vitest/expect` instead. Re-declaring here under the correct module makes
 * `expect(results).toHaveNoViolations()` type-check cleanly.
 *
 * @see https://github.com/chaance/vitest-axe
 */
import type AxeCore from "axe-core";

declare module "@vitest/expect" {
  interface Assertion<T = any> {
    /**
     * A custom matcher that checks axe-core results for violations.
     */
    toHaveNoViolations(): {
      message(): string;
      pass: boolean;
      actual: AxeCore.Result[];
    };
  }

  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): {
      message(): string;
      pass: boolean;
      actual: AxeCore.Result[];
    };
  }
}

export {};
