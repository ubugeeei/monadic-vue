import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { pure } from "../src/monad";
import { extr } from "../src/comonad";
import { map } from "../src/functor";
import { comp, pipe } from "../src/pipe";

describe("Bimonad compatibility", () => {
  it("ε ∘ η = id: extr(pure(x)) === x", () => {
    expect(extr(pure(42))).toBe(42);
  });

  it("η ∘ ε ≠ id: pure(extr(r)) creates a disconnected Ref", () => {
    const r = ref(42);
    const rewrapped = pure(extr(r));

    r.value = 100;
    expect(extr(rewrapped)).toBe(42);
    expect(extr(r)).toBe(100);
  });
});

describe("Functor", () => {
  it("map lifts a pure function", () => {
    expect(extr(map(ref(5))((n) => n * 2))).toBe(10);
  });

  it("map tracks changes", () => {
    const r = ref(5);
    const doubled = map(r)((n) => n * 2);

    r.value = 10;
    expect(extr(doubled)).toBe(20);
  });

  describe("Functor Laws", () => {
    it("identity: map(r)(id) ≅ r", () => {
      const r = ref(42);
      expect(extr(map(r)((x) => x))).toBe(extr(r));
    });

    it("composition: map(r)(g ∘ f) ≅ map(map(r)(f))(g)", () => {
      const r = ref(5);
      const f = (n: number) => n * 2;
      const g = (n: number) => `${n}`;

      expect(extr(map(r)((x) => g(f(x))))).toBe(extr(map(map(r)(f))(g)));
    });
  });
});

describe("Kleisli composition (comp)", () => {
  const double = (n: number) => ref(n * 2);
  const toString = (n: number) => ref(`${n}`);

  it("composes two Kleisli arrows", () => {
    expect(extr(comp(double)(toString)(5))).toBe("10");
  });
});

describe("pipe", () => {
  it("chains multiple Kleisli arrows", () => {
    const result = pipe(
      ref(5),
      (n) => ref(n * 2),
      (n) => ref(`result: ${n}`),
    );
    expect(extr(result)).toBe("result: 10");
  });

  it("reacts to source changes", () => {
    const r = ref(5);
    const result = pipe(
      r,
      (n) => ref(n * 2),
      (n) => ref(`result: ${n}`),
    );

    r.value = 10;
    expect(extr(result)).toBe("result: 20");
  });
});
