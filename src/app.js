const express = require('express');
const productRoutes = require('./routes/product.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

app.use(errorHandler);

app.listen(3001, () => {
    console.log('Server đang chạy tại http://localhost:3001');
});