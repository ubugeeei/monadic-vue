import { computed } from "vue";

import type { ComputedRef, Ref } from "vue";

/**
 * map: Ref(A) → (A → B) → Ref(B)
 *
 * Lifts a pure function into the Ref functor.
 * Data-first for TypeScript inference.
 */
export const map =
  <A>(refA: Ref<A>) =>
  <B>(f: (a: A) => B): ComputedRef<B> =>
    computed(() => f(refA.value));
