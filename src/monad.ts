import { ref, computed, shallowRef } from "vue";

import type { ComputedRef, Ref, ShallowRef } from "vue";

/**
 * pure (η): A → Ref(A)
 *
 * Wraps a plain value in a reactive reference.
 */
export const pure = <A>(value: A): Ref<A> => ref(value) as Ref<A>;

/**
 * wrap: Ref(A) → ShallowRef(Ref(A))
 *
 * Creates a Ref(Ref(A)) without Vue's auto-unwrapping.
 * Necessary because ref(ref(x)) auto-flattens in Vue.
 */
export const wrap = <A>(inner: Ref<A>): ShallowRef<Ref<A>> => {
  const outer: ShallowRef<Ref<A>> = shallowRef(undefined) as never;
  (outer as { value: Ref<A> }).value = inner;
  return outer;
};

/**
 * flat (μ): Ref(Ref(A)) → Ref(A)
 *
 * Flattens a nested Ref by reactively tracking both layers.
 * Use wrap to create the Ref(Ref(A)) input.
 */
export const flat = <A>(refRefA: Ref<Ref<A>>): ComputedRef<A> =>
  computed(() => refRefA.value.value);

/**
 * flatMap (>>=): Ref(A) → (A → Ref(B)) → Ref(B)
 *
 * Chains a reactive computation. Equivalent to μ ∘ Ref(f).
 * Data-first for TypeScript inference.
 */
export const flatMap =
  <A>(refA: Ref<A>) =>
  <B>(f: (a: A) => Ref<B>): ComputedRef<B> =>
    computed(() => f(refA.value).value);
