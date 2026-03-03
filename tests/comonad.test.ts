import { describe, it, expect } from "vitest";
import { ref, type Ref } from "vue";
import { extr, extd, dup } from "../src/comonad";
import { map } from "../src/functor";

describe("Comonad", () => {
  describe("extr (ε)", () => {
    it("extracts the value from Ref", () => {
      expect(extr(ref(42))).toBe(42);
    });
  });

  describe("extd", () => {
    it("creates a derived computation via map", () => {
      const count = ref(5);
      const doubled = map(count)((n) => n * 2);
      expect(extr(doubled)).toBe(10);
    });

    it("tracks changes via extd with extr", () => {
      const count = ref(5);
      const doubled = extd(count)((w) => extr(w) * 2);

      count.value = 10;
      expect(extr(doubled)).toBe(20);
    });
  });

  describe("dup (δ)", () => {
    it("wraps Ref in another Ref layer", () => {
      expect(extr(extr(dup(ref(42))))).toBe(42);
    });
  });

  describe("Comonad Laws", () => {
    const f = (w: Ref<number>) => `f(${extr(w)})`;
    const g = (w: Ref<string>) => extr(w).length;

    it("left identity: extr(extd(r)(f)) = f(r)", () => {
      const r = ref(42);
      expect(extr(extd(r)(f))).toBe(f(r));
    });

    it("right identity: extd(r)(extr) ≅ r", () => {
      const r = ref(42);
      expect(extr(extd(r)(extr))).toBe(extr(r));
    });

    it("associativity: extd(extd(r)(f))(g) ≅ extd(r)(w => g(extd(w)(f)))", () => {
      const r = ref(42);
      const lhs = extr(extd(extd(r)(f))(g));
      const rhs = extr(extd(r)((w) => g(extd(w)(f))));
      expect(lhs).toBe(rhs);
    });
  });
});
