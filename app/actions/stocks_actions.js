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


function getStockValues(symbols, socket) {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_STOCK_VALUES'
        });
        const promiseArray = new Array(symbols.length);
        for(let i = 0; i < promiseArray.length; i++) {
             promiseArray[i] = new Promise((resolve, reject) => {
                 const API_KEY = process.env.API_KEY;
                 console.log(process.env.NODE_ENV);
                fetch(`https://www.quandl.com/api/v3/datasets/WIKI/${symbols[i]}.json?api_key=${API_KEY}&start_date=2015-08-14&end_date=${formatDate(new Date())}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((json) => {
                        let color = '#';
                        for(let i = 0; i < 6; i++) {
                            color += Math.floor(Math.random() * 16).toString(16);
                        }
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
            if(socket)
                socket.emit('receive-stock-values-success', values);
            dispatch({
                type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                stockValues: values
            });
        });
    };
}

export function addStock(stockSymbol, socket) {
    return (dispatch) => {
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
                if(stockResponse.ok)
                    return stockResponse.json();
                else
                    return null;
            })
            .then((json) => {
                if(json) {
                    socket.emit('add-stock-success', json);
                    dispatch({
                        type: 'ADD_STOCK_SUCCESS',
                        stock: json
                    });
                }
                dispatch(getStockValues([stockSymbol], socket));
            })
            .catch((error) => {
                const msg = error.status === 404 ? error.msg : 'An error occurred. Please try later';
                dispatch({
                    type: 'ADD_STOCK_FAILURE',
                    msg: [{msg}]
                });
            });
    }
}

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
        fetch(`/api/stock/${stockId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    socket.emit('remove-stock-success', { stockId, stockSymbol: json.symbol});
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