export const RangeError = globalThis.RangeError;
export type RangeError = globalThis.RangeError;

export const SyntaxError = globalThis.SyntaxError;
export type SyntaxError = globalThis.SyntaxError;

export class NumError extends Error {
    func: string;
    num: string;
    err: Error | null;
    constructor(data: { func?: string; num?: string; err?: Error | null } = {}) {}
}

/**
 * @throws
 */
export function parseUint(s: string, base: number, bitSize: number): number {

}