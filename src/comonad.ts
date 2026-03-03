import { computed } from "vue";

import type { ComputedRef, Ref } from "vue";

/**
 * extr (ε): Ref(A) → A
 *
 * Extracts the current value from a reactive reference.
 */
export const extr = <A>(refA: Ref<A>): A => refA.value;

/**
 * extd: Ref(A) → (Ref(A) → B) → Ref(B)
 *
 * Creates a derived reactive computation from a coKleisli arrow.
 * Dual of flatMap. Data-first for TypeScript inference.
 */
export const extd =
  <A>(refA: Ref<A>) =>
  <B>(f: (w: Ref<A>) => B): ComputedRef<B> =>
    computed(() => f(refA));

/**
 * dup (δ): Ref(A) → Ref(Ref(A))
 *
 * Wraps a Ref in another layer of Ref context.
 * dup = extd(id)
 */
export const dup = <A>(refA: Ref<A>): ComputedRef<Ref<A>> => computed(() => refA);
