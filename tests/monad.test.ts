import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { pure, wrap, flat, flatMap } from "../src/monad";
import { extr } from "../src/comonad";

describe("Monad", () => {
  describe("pure (η)", () => {
    it("wraps a value in Ref", () => {
      expect(extr(pure(42))).toBe(42);
    });
  });

  describe("flat (μ)", () => {
    it("flattens Ref(Ref(A)) to Ref(A)", () => {
      expect(extr(flat(wrap(ref(1))))).toBe(1);
    });

    it("tracks inner changes", () => {
      const inner = ref(1);
      const flattened = flat(wrap(inner));

      inner.value = 2;
      expect(extr(flattened)).toBe(2);
    });

    it("tracks outer changes", () => {
      const outer = wrap(ref(1));
      const flattened = flat(outer);

      outer.value = ref(100);
      expect(extr(flattened)).toBe(100);
    });
  });

  describe("flatMap (>>=)", () => {
    it("chains reactive computations", () => {
      const count = ref(3);
      const items = ref([10, 20, 30, 40, 50]);
      const result = flatMap(count)((n) => flatMap(items)((list) => ref(list.slice(0, n))));

      expect(extr(result)).toEqual([10, 20, 30]);
    });

    it("reacts to source changes", () => {
      const count = ref(3);
      const items = ref([10, 20, 30, 40, 50]);
      const result = flatMap(count)((n) => flatMap(items)((list) => ref(list.slice(0, n))));

      count.value = 2;
      expect(extr(result)).toEqual([10, 20]);
    });
  });

  describe("Monad Laws", () => {
    const f = (n: number) => ref(`f(${n})`);
    const g = (s: string) => ref(s.length);

    it("left identity: flatMap(pure(a))(f) ≅ f(a)", () => {
      expect(extr(flatMap(pure(42))(f))).toBe(extr(f(42)));
    });

    it("right identity: flatMap(m)(pure) ≅ m", () => {
      const m = ref(42);
      expect(extr(flatMap(m)(pure))).toBe(extr(m));
    });

    it("associativity: flatMap(flatMap(m)(f))(g) ≅ flatMap(m)(x => flatMap(f(x))(g))", () => {
      const m = ref(42);
      const lhs = extr(flatMap(flatMap(m)(f))(g));
      const rhs = extr(flatMap(m)((x) => flatMap(f(x))(g)));
      expect(lhs).toBe(rhs);
    });
  });
});
