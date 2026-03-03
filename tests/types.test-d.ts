import { describe, it, expectTypeOf } from "vitest";
import { ref } from "vue";
import { pure, wrap, flat, flatMap } from "../src/monad";
import { extr, extd, dup } from "../src/comonad";
import { map } from "../src/functor";
import { comp, pipe } from "../src/pipe";

import type { ComputedRef, Ref, ShallowRef } from "vue";

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe("pure (η): A → Ref(A)", () => {
  it("infers the wrapped type", () => {
    expectTypeOf(pure(42)).toEqualTypeOf<Ref<number>>();
    expectTypeOf(pure("hello")).toEqualTypeOf<Ref<string>>();
    expectTypeOf(pure(true)).toEqualTypeOf<Ref<boolean>>();
  });
});

describe("wrap: Ref(A) → ShallowRef(Ref(A))", () => {
  it("returns ShallowRef<Ref<A>>", () => {
    expectTypeOf(wrap(ref(1))).toEqualTypeOf<ShallowRef<Ref<number>>>();
  });
});

describe("flat (μ): Ref(Ref(A)) → Ref(A)", () => {
  it("unwraps one layer", () => {
    const nested = wrap(ref(1));
    expectTypeOf(flat(nested)).toEqualTypeOf<ComputedRef<number>>();
  });
});

describe("flatMap (>>=): Ref(A) → (A → Ref(B)) → Ref(B)", () => {
  it("infers A from data-first argument", () => {
    const count = ref(3);
    // n should be inferred as number
    const result = flatMap(count)((n) => ref(`${n}`));
    expectTypeOf(result).toEqualTypeOf<ComputedRef<string>>();
  });

  it("chains with correct types", () => {
    const count = ref(3);
    const items = ref([10, 20, 30]);
    const result = flatMap(count)((n) => flatMap(items)((list) => ref(list.slice(0, n))));
    expectTypeOf(result).toEqualTypeOf<ComputedRef<number[]>>();
  });
});

// ---------------------------------------------------------------------------
// Comonad
// ---------------------------------------------------------------------------

describe("extr (ε): Ref(A) → A", () => {
  it("unwraps the Ref type", () => {
    expectTypeOf(extr(ref(42))).toBeNumber();
    expectTypeOf(extr(ref("hello"))).toBeString();
  });
});

describe("extd: Ref(A) → (Ref(A) → B) → Ref(B)", () => {
  it("infers A from data-first, B from callback return", () => {
    const count = ref(5);
    // w should be inferred as Ref<number>
    const result = extd(count)((w) => `value: ${extr(w)}`);
    expectTypeOf(result).toEqualTypeOf<ComputedRef<string>>();
  });
});

describe("dup (δ): Ref(A) → Ref(Ref(A))", () => {
  it("adds one Ref layer", () => {
    expectTypeOf(dup(ref(42))).toEqualTypeOf<ComputedRef<Ref<number>>>();
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe("map: Ref(A) → (A → B) → Ref(B)", () => {
  it("infers A from data-first, B from return", () => {
    const r = ref(5);
    // n should be inferred as number
    const result = map(r)((n) => `${n}`);
    expectTypeOf(result).toEqualTypeOf<ComputedRef<string>>();
  });

  it("preserves type through identity", () => {
    const r = ref(42);
    expectTypeOf(map(r)((x) => x)).toEqualTypeOf<ComputedRef<number>>();
  });
});

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

describe("comp: (A → Ref(B)) → (B → Ref(C)) → (A → Ref(C))", () => {
  it("infers composed return type", () => {
    const f = (n: number) => ref(n * 2);
    const g = (n: number) => ref(`${n}`);
    const composed = comp(f)(g);

    expectTypeOf(composed).toEqualTypeOf<(a: number) => ComputedRef<string>>();
    expectTypeOf(composed(5)).toEqualTypeOf<ComputedRef<string>>();
  });
});

describe("pipe: Ref(A) → ... → Ref(Z)", () => {
  it("infers final type through the chain", () => {
    const r = ref(5);

    const r1 = pipe(r, (n) => ref(n * 2));
    expectTypeOf(r1).toEqualTypeOf<ComputedRef<number>>();

    const r2 = pipe(
      r,
      (n) => ref(n * 2),
      (n) => ref(`${n}`),
    );
    expectTypeOf(r2).toEqualTypeOf<ComputedRef<string>>();

    const r3 = pipe(
      r,
      (n) => ref(n * 2),
      (n) => ref(`${n}`),
      (s) => ref(s.length),
    );
    expectTypeOf(r3).toEqualTypeOf<ComputedRef<number>>();
  });
});

// ---------------------------------------------------------------------------
// Bimonad: ε ∘ η = id (type level)
// ---------------------------------------------------------------------------

describe("Bimonad type compatibility", () => {
  it("extr(pure(x)) has the same type as x", () => {
    expectTypeOf(extr(pure(42))).toBeNumber();
    expectTypeOf(extr(pure("hello"))).toBeString();
  });

  it("pure(extr(r)) returns Ref of the same inner type", () => {
    const r = ref(42);
    expectTypeOf(pure(extr(r))).toEqualTypeOf<Ref<number>>();
  });
});
