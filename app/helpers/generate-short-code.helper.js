/**
 * Генерирует случайный короткий код.
 *
 * @returns {string} - Случайная строка из 5 символов.
 */
export function generateShortCode() {
    return Math.random().toString(36).substring(2, 7);
}