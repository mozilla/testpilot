/**
 * Validate an email address.
 * @param  - The email address to validate.
 * @returns  undefined
 */
declare export function validate(email: string): boolean

/**
 * Async email validation.
 * @param  - The email address to validate.
 * @param  - The callback to execute.
 */
declare export function validate_async(email: string, callback: AsyncCallback): void
export interface AsyncCallback {
    (err: any, isValideEmail: boolean): any
}
