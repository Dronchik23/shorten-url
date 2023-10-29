import {urlValidation} from "./url.validation.js";

/**
 * Массив функций валидации для различных параметров запроса.
 *
 * - `urlValidation`: Проверка корректности URL.
 * - `customCodeValidation`: Проверка кастомного кода (если предоставлен).
 * - `shortCodeValidation`: Проверка корректности короткого кода.
 *
 * Эти валидации можно использовать вместе, чтобы убедиться, что все параметры запроса корректны перед их обработкой.
 *
 * @type {Array<Function>}
 */
export const inputValidations = [
    urlValidation,
    customCodeValidation,
];
