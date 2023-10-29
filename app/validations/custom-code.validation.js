import {body} from "express-validator";

/**
 * Валидация поля `customCode` из тела запроса.
 * Проверяет следующее:
 * - customCode является необязательным полем
 * - customCode является строкой
 * - длина customCode находится в диапазоне от 2 до 10 символов
 *
 * @returns {ValidationChain}
 */
export const customCodeValidation = body('customCode')
    .optional()
    .trim()
    .isString().withMessage('Кастомный код должен быть строкой')
    .isLength({min: 2, max: 10}).withMessage('Кастомный код должен содержать от 2 до 10 символов')