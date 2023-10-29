import {validationResult} from "express-validator";

/**
 * Миддлвэр для обработки ошибок валидации.
 * В случае ошибок валидации отправляет ответ со статусом 400.
 *
 * @module handleValidationErrorMiddleware
 *
 * @param {express.Request} req.
 * @param {express.Response} res.
 * @param {Function} next.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

export const validationErrorMiddleware = [handleValidationErrors];