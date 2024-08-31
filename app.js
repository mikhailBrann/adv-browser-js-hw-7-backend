import express from 'express';
import TicketRouter from './src/routes/TiketRouter.js';
const port = process.env.PORT || 8787;

const app = express();

//отключение кеширования
app.enable('view cache');
app.set('view cache', false);

//парсинг тела запроса
app.use(express.json());  // Готов принять JSON
//app.use(express.urlencoded({ extended: true }));  // Укажите для обработки URL-encoded форм

app.use('/ticket', TicketRouter);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});