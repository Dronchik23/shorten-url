import {param} from 'express-validator';

/**
 * Валидация параметра `shortCode` из URL.
 * Проверяет следующее:
 * - shortCode не пустой
 * - shortCode является строкой
 * - длина shortCode равна 5 символам
 *
 * @returns {ValidationChain}
 */
export const paramsShortCodeValidation =
    param('shortCode')
        .trim()
        .notEmpty().withMessage('Поле shortCode не должно быть пустым')
        .isString().withMessage('Поле shortCode должно быть строкой')
        .isLength({min: 5, max: 5}).withMessage('Поле shortCode должно иметь длину в 5 символов');