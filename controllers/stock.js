import Stock from '../models/Stock';
import StockValue from '../models/StockValue';

function mapErrors(errors) {
    return errors.map((error) => {
        return {msg: error.msg};
    });
}

export function createStock(req, res) {
    const symbol = req.body.symbol;
    req.assert('symbol', 'Symbol cannot be empty.').notEmpty();
    const errors = req.validationErrors();
    if(errors) {
        res.status(400).send(mapErrors(errors));
    }
    Stock.create(symbol).then((stock) => {
        res.status(200).send(stock);
    }).catch((error) => {
        res.status(400).send(error);
    });
}

export function removeStock(req, res) {
   const stockId = req.params.stockId;
   Stock.remove(stockId).then(() => {
       res.sendStatus(204);
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

export function setStockValue(req, res) {
    req.assert('value', 'Invalid value.').isFloat();
    if(req.body.day)
        req.assert('day', 'Day must be a valid date.').isDate();
    const errors = req.validationErrors();
    if(errors) {
        return res.status(400).send(mapErrors(errors));
    }
    StockValue.setValue(req.params.stockId, req.body.value, req.body.day).then(() => {
        res.sendStatus(204);
    }).catch((error) => {
        res.status(400).send(error);
    });
}

export function getStockValue(req, res) {
    const day = req.query.day;
    const stockId = req.params.stockId;
    if(day) {
        StockValue.getStockValueForDay(stockId, day).then((stockValue) => {
            res.status(200).send(stockValue);
        }).catch((error) => {
            res.status(400).send(error);
        });
    } else {
        StockValue.getStockValues(stockId).then((stockValues) => {
            res.status(200).send(stockValues);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
}

export function getAllValues(req, res) {
    StockValue.getAll().then((stockValues) => {
        res.status(200).send(stockValues);
    }).catch((error) => {
        res.status(400).send(error);
    });
}
