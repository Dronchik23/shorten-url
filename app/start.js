import {app} from './server.js';

const PORT = 7000;

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});