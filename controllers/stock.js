import Stock from '../models/Stock';

function mapErrors(errors) {
    return errors.map((error) => {
        return {msg: error.msg};
    });
}

export function createStock(req, res) {
    const symbol = req.body.symbol;
    const description = req.body.description;
    console.log('SYMBOL: ', symbol, '\nDESC: ', description);
    req.assert('symbol', 'Symbol cannot be empty.').notEmpty();
    const errors = req.validationErrors();
    if(errors) {
        res.status(400).send(mapErrors(errors));
    }
    Stock.create(symbol, description).then((stock) => {
        res.status(200).send(stock);
    }).catch((error) => {
        res.status(400).send(error);
    });
}

export function removeStock(req, res) {
   const stockId = req.params.stockId;
   Stock.remove(stockId).then((data) => {
       res.status(200).send(data);
   }).catch((error) => {
       res.status(400).send(error);
   });
}

export function getAllStocks(req, res) {
    Stock.all().then((stocks) => {
       res.status(200).send(stocks);
    }).catch((error) => {
        res.status(400).send(error);
    });
}
