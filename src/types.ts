import type { ComputedRef, Ref } from "vue";

/** η: A → Ref(A) */
export type Eta = <A>(value: A) => Ref<A>;

/** μ: Ref(Ref(A)) → Ref(A) */
export type Mu = <A>(refRefA: Ref<Ref<A>>) => ComputedRef<A>;

/** >>=: Ref(A) → (A → Ref(B)) → Ref(B) */
export type Bind = <A>(refA: Ref<A>) => <B>(f: (a: A) => Ref<B>) => ComputedRef<B>;

/** ε: Ref(A) → A */
export type Epsilon = <A>(refA: Ref<A>) => A;

/** extend: Ref(A) → (Ref(A) → B) → Ref(B) */
export type Extend = <A>(refA: Ref<A>) => <B>(f: (w: Ref<A>) => B) => ComputedRef<B>;

/** δ: Ref(A) → Ref(Ref(A)) */
export type Delta = <A>(refA: Ref<A>) => ComputedRef<Ref<A>>;

/** fmap: Ref(A) → (A → B) → Ref(B) */
export type Fmap = <A>(refA: Ref<A>) => <B>(f: (a: A) => B) => ComputedRef<B>;

/** Kleisli: (A → Ref(B)) → (B → Ref(C)) → (A → Ref(C)) */
export type Kleisli = <A, B, C>(
  f: (a: A) => Ref<B>,
) => (g: (b: B) => Ref<C>) => (a: A) => ComputedRef<C>;
