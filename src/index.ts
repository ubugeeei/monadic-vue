// Types
export type { Eta, Mu, Bind, Epsilon, Extend, Delta, Fmap, Kleisli } from "./types";

// Functor
export { map } from "./functor";

// Monad
export { pure, wrap, flat, flatMap } from "./monad";

// Comonad
export { extr, extd, dup } from "./comonad";

// Composition
export { comp, pipe } from "./pipe";
