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


function getStockValues(symbols) {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_STOCK_VALUES'
        });
        const promiseArray = new Array(symbols.length);
        for(let i = 0; i < promiseArray.length; i++) {
             promiseArray[i] = new Promise((resolve, reject) => {
                fetch('https://www.quandl.com/api/v3/datasets/WIKI/' + symbols[i] + '.json' +
                    '?api_key=C3UE62CdFhxe2WfsM65n&start_date=2015-08-14&end_date=' + formatDate(new Date()) )
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
            dispatch({
                type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                stockValues: values
            });
        });
    };
}

export function addStock(stockSymbol) {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_STOCK_INFO'
        });
        fetch('https://www.quandl.com/api/v3/datasets/WIKI/' + stockSymbol + '/metadata.json')
            .then((response) => {
                return response.json();
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
                dispatch({
                    type: 'ADD_STOCK_SUCCESS',
                    stock: json
                });
                dispatch(getStockValues([stockSymbol]));
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

export function deleteStock(stockId) {
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