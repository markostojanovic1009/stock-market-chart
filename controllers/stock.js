import Stock from '../models/Stock';
import StockValue from '../models/StockValue';

export function createStock(req, res) {
    const symbol = req.body.symbol;
    req.assert('symbol', 'Symbol cannot be empty.').notEmpty();
    const errors = req.validationErrors();
    if(errors) {
        res.status(400).send(errors.map((error) => {
            return {msg: error.msg};
        }));
    }
    Stock.create(symbol).then((stock) => {
        res.status(200).send(stock);
    }).catch((error) => {
        res.status(400).send(error);
    });
}
