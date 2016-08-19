/**
 * Gets stocks info (id, symbol, description) from the
 * database.
 * Calls getStockValues to fill the chart.
 */
export function getAllStocks() {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_MESSAGES"
        });
        dispatch({
            type: 'FETCH_STOCKS'
        });
        return fetch('/api/stock', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return response.json().then((json) => {
                if(response.ok) {
                    dispatch({
                        type: 'RECEIVE_STOCKS_SUCCESS',
                        stocks: json
                    });
                    dispatch(getStockValues(json.map(item => item.symbol)));
                } else {
                    dispatch({
                        type: 'RECEIVE_STOCKS_FAILURE',
                        msg: json
                    });
                }
            });
        });
    };
}

/**
 * Calls Quandl API to confirm that stock symbol is valid
 * before adding it to the database.
 * Calls getStockValues to update the chart.
 * @param stockSymbol
 * @param socket
 */
export function addStock(stockSymbol, socket) {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_MESSAGES"
        });
        dispatch({
            type: 'FETCH_STOCK_INFO'
        });
        fetch(`https://www.quandl.com/api/v3/datasets/WIKI/${stockSymbol}/metadata.json`)
            .then((response) => {
                if(response.ok)
                    return response.json();
                else
                    throw {
                        status: 404,
                        msg: `Stock with symbol ${stockSymbol} doesn't exist.`
                    };
            })
            .then((json) => {
                return fetch('/api/stock', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        symbol: stockSymbol,
                        description: json.dataset.name.substring(0, json.dataset.name.indexOf('Prices'))
                    })
                });
            })
            .then((stockResponse) => {
                return stockResponse.json();
            })
            .then((json) => {
                if(!json.msg) {
                    socket.emit('add-stock-success', json);
                    dispatch({
                        type: 'ADD_STOCK_SUCCESS',
                        stock: json
                    });
                    dispatch(getStockValues([stockSymbol], socket));
                } else {
                    throw {
                        status: 400,
                        msg: json.msg
                    }
                }
            })
            .catch((error) => {
                let msg;
                switch(error.status) {
                    case 400:
                    case 404:
                        msg = error.msg;
                        break;
                    default:
                        msg = 'An error occurred. Please try later'
                }
                dispatch({
                    type: 'ADD_STOCK_FAILURE',
                    msg: [{msg}]
                });
            });
    }
}

/**
 * Used to update the state of a client
 * when another client adds or removes a stock.
 * @param change - {type, payload}
 */

export function notifyStateChange(change) {
    switch(change.type) {
        case 'STOCK':
            return {
                type: 'ADD_STOCK_SUCCESS',
                stock: change.payload
            };
            break;
        case 'STOCK_VALUES':
            return {
                type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                stockValues: change.payload
            };
            break;
        case 'REMOVED_STOCK':
            return {
                type: 'REMOVE_STOCK_SUCCESS',
                stockId: change.payload.stockId,
                stockSymbol: change.payload.stockSymbol
            };
        default:
            return;
    }
}


export function deleteStock(stockId, socket) {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_MESSAGES"
        });
        fetch(`/api/stock/${stockId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((json) => {

                if (response.ok) {

                    socket.emit('remove-stock-success', { stockId, stockSymbol: json.symbol });

                    dispatch({
                        type: 'REMOVE_STOCK_SUCCESS',
                        stockId,
                        stockSymbol: json.symbol
                    });
                }
            });
        });
    }
}

/**
 * Returns date in the format 'YYYY-MM-DD'
 * @param date
 * @returns {string}
 */
function formatDate (date) {
    function fill(value) {
        if(value < 10) {
            return "0" + value.toString();
        } else {
            return value.toString();
        }
    }
    return date.getFullYear() + "-" + fill(date.getMonth() + 1) + '-' + fill(date.getDate());
}
/**
 * Calls the Quandl.com API to get the stock data.
 * Since it needs to make individual calls for every
 * stock, it uses an array of promises and Promise.all
 * to send data after all API calls were resolved.
 * @param symbols - array of stock symbols.
 * @param socket
 */
function getStockValues(symbols, socket) {
    return (dispatch) => {

        dispatch({
            type: 'FETCH_STOCK_VALUES'
        });

        dispatch({
            type: "CLEAR_MESSAGES"
        });

        const promiseArray = new Array(symbols.length);
        for(let i = 0; i < promiseArray.length; i++) {

            promiseArray[i] = new Promise((resolve, reject) => {
                const API_KEY = process.env.API_KEY;
                fetch(`https://www.quandl.com/api/v3/datasets/WIKI/${symbols[i]}.json?api_key=${API_KEY}&start_date=2015-08-14&end_date=${formatDate(new Date())}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((json) => {
                        /*
                         * Generates a random hex color for the stock line on the chart.
                         */
                        let color = '#';
                        for(let i = 0; i < 6; i++) {
                            color += Math.floor(Math.random() * 16).toString(16);
                        }

                        /*
                         * Maps the data to be in format [Unix timestamp, closing price] and
                         * reverses it because Highcharts requires dates to be in order of
                         * lowest to highest date and API returns it in highest to lowest.
                         */
                        const stockValues = {
                            name: json.dataset.dataset_code,
                            color,
                            data: json.dataset.data.map((item) => {
                                return [Date.parse(item[0]), item[4]];
                            }).reverse()
                        };

                        resolve(stockValues);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }

        return Promise.all(promiseArray).then((values) => {

            /*
             * Emits an event to be received by the server.
             */
            if(socket)
                socket.emit('receive-stock-values-success', values);

            dispatch({
                type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                stockValues: values
            });
        });
    };
}
