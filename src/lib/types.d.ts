// [PromiseData, error]
export type PromiseResult<T> = [T | null, string | null];

// [PromiseData, error | {error, reserve}]
// export type PromiseResult<T, K extends string | object> = [
//     T | null,
//     (K extends string ? string : { error: string; reserve: string }) | null
// ];
