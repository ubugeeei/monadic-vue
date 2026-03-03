import type { ComputedRef, Ref } from "vue";

import { flatMap } from "./monad";

/**
 * comp: (A → Ref(B)) → (B → Ref(C)) → (A → Ref(C))
 *
 * Kleisli composition of two monadic functions.
 */
export const comp =
  <A, B>(f: (a: A) => Ref<B>) =>
  <C>(g: (b: B) => Ref<C>) =>
  (a: A): ComputedRef<C> =>
    flatMap(f(a))(g);

/**
 * pipe: Ref(A) → (A → Ref(B)) → ... → Ref(Z)
 *
 * Chains multiple Kleisli arrows via flatMap.
 */
export const pipe: {
  <A, B>(refA: Ref<A>, f: (a: A) => Ref<B>): ComputedRef<B>;
  <A, B, C>(refA: Ref<A>, f: (a: A) => Ref<B>, g: (b: B) => Ref<C>): ComputedRef<C>;
  <A, B, C, D>(
    refA: Ref<A>,
    f: (a: A) => Ref<B>,
    g: (b: B) => Ref<C>,
    h: (c: C) => Ref<D>,
  ): ComputedRef<D>;
} = (refA: Ref<unknown>, ...fns: Array<(a: unknown) => Ref<unknown>>): ComputedRef<unknown> => {
  let current: Ref<unknown> = refA;
  for (const fn of fns) {
    current = flatMap(current)(fn);
  }
  return current as ComputedRef<unknown>;
};
