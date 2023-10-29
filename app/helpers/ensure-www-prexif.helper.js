/**
 * Проверяет, что URL начинается с "www." и возвращает ошибку, если это не так.
 *
 * @param {string} value
 * @param {Object} helpers
 * @returns {string}
 */
export function ensureWwwPrefix(url) {
    const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    const match = domainRegex.exec(url);

    if (match && match[1]) {
        return `https://www.${match[1]}`;
    }

    return url;
}