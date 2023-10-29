import {body} from "express-validator";

const MAX_URL_LENGTH = 2000;

/**
 * Валидация поля `url` из тела запроса.
 * Проверяет следующее:
 * - url не превышает максимальную длину
 * - url является строкой
 * - url имеет правильный формат URL
 * - url начинается с 'www.'
 *
 * @returns {ValidationChain}
 */
export const urlValidation = body('url')
    .trim()
    .isLength({min: 0, max: MAX_URL_LENGTH}).withMessage(`URL должен быть не более ${MAX_URL_LENGTH} символов`)
    .isString().withMessage('URL должен быть строкой')
    .isURL().withMessage('URL имеет недопустимый формат')
    .custom((value) => {
        if (!value.startsWith('www.')) {
            throw new Error('URL должен начинаться с "www."');
        }
        return true;
    });