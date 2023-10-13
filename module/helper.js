/** @returns {any} */
export const any = (value) => value;

/**
 * @param {Event} e
 * @returns {HTMLInputElement}
 */
export const target = (e) => e.target;

/** @returns {HTMLInputElement | null} */
export const tagInput = (el) => el;

/** @returns {HTMLCanvasElement | null} */
export const tagCanvas = (el) => el;

/**
 * @template T
 * @param {T} value
 * @returns {Exclude<T, null | undefined>}
 */
export const force = (value) => value;
