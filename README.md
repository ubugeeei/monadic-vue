# monadic-vue

> **This is a hobby project.** Not intended for production use.

Vue Reactivity (`Ref`) as **Monad**, **Comonad**, and **Bimonad**.

Based on the observation that Vue's `Ref` satisfies both Monad laws and Comonad laws (under extensional equality).

## API

All multi-argument functions are curried (data-first for TypeScript inference).

### Functor

- `map(refA)((a) => b)` — Ref(A) → (A → B) → Ref(B)

### Monad

- `pure(value)` — η: A → Ref(A)
- `flat(refRefA)` — μ: Ref(Ref(A)) → Ref(A)
- `flatMap(refA)((a) => refB)` — >>=: Ref(A) → (A → Ref(B)) → Ref(B)
- `wrap(innerRef)` — creates Ref(Ref(A)) without Vue auto-unwrapping

### Comonad

- `extr(refA)` — ε: Ref(A) → A
- `extd(refA)((w) => b)` — Ref(A) → (Ref(A) → B) → Ref(B)
- `dup(refA)` — δ: Ref(A) → Ref(Ref(A))

### Composition

- `comp(f)(g)` — Kleisli: (A → Ref(B)) → (B → Ref(C)) → (A → Ref(C))
- `pipe(refA, f, g, ...)` — do-notation-like chaining

## Example

```ts
import { ref } from "vue";
import { flatMap, pure, extr, extd, map } from "monadic-vue";

const count = ref(3);
const items = ref([10, 20, 30, 40, 50]);

// Monadic flatMap (data-first — types inferred)
const sliced = flatMap(count)((n) =>
  flatMap(items)((list) => ref(list.slice(0, n))),
);

// Comonadic extd
const doubled = extd(count)((w) => extr(w) * 2);

// Functor map
const label = map(count)((n) => `count: ${n}`);

// Bimonad compatibility: ε ∘ η = id
extr(pure(42)); // 42
```

## License

MIT
