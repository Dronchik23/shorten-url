import express from "express";
import bodyParser from "body-parser";
import {validationErrorMiddleware} from "./middlewares/validation-error.middleware.js";
import {ensureWwwPrefix} from "./helpers/ensure-www-prexif.helper.js";
import {generateShortCode} from "./helpers/generate-short-code.helper.js";
import {paramsShortCodeValidation} from "./validations/params-short-code.validation.js";
import {customCodeValidation} from "./validations/custom-code.validation.js";
import {urlValidation} from "./validations/url.validation.js";

export const app = express();

app.use(bodyParser.json());

/** @type {Record<string, string>} */
export const urlToShortCode = {}; // URL -> Короткий код

/** @type {Record<string, string>} */
export const shortCodeToUrl = {}; // Короткий код -> URL

/**
 * Эндпоинт для сокращения заданного URL.
 * Если в теле запроса предоставлен customCode, он будет использован в качестве короткого кода.
 * Если данный короткий код уже существует, он будет перезаписан новым URL.
 * В противном случае будет сгенерирован случайный короткий код.
 *
 * @param {express.Request} req.
 * @param {express.Response} res.
 */
app.post('/shorten', urlValidation, customCodeValidation, validationErrorMiddleware, (req, res) => {
    let originalUrl = req.body.url;
    originalUrl = ensureWwwPrefix(originalUrl);
    const customShortCode = req.body.customCode;

    if (urlToShortCode[originalUrl]) {
        return res.json({shortUrl: urlToShortCode[originalUrl]});
    }
    if (customShortCode && shortCodeToUrl[customShortCode]) {
        return res.status(400).send('Код уже используется');
    }

    let shortCode = customShortCode || generateShortCode();

    urlToShortCode[originalUrl] = shortCode;
    shortCodeToUrl[shortCode] = originalUrl;

    res.json({shortUrl: shortCode});
});

/**
 * Эндпоинт для перенаправления на оригинальный URL с использованием предоставленного короткого кода.
 *
 * @param {express.Request} req.
 * @param {express.Response} res.
 */
app.get('/:shortCode',
    paramsShortCodeValidation,
    validationErrorMiddleware,
    (req, res) => {
        const shortCode = req.params.shortCode;
        const originalUrl = shortCodeToUrl[shortCode];

        if (originalUrl) {
            res.redirect(originalUrl);
        } else {
            res.status(404).send('URL не найден');
        }
    });
