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
                   dispatch({
                       type: 'FETCH_STOCK_VALUES'
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

/*export function getAllStockValues() {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_STOCK_VALUES'
        });
        return fetch('/api/stock/values/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
           return response.json().then((json) => {
               if(response.ok) {
                   dispatch({
                       type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                       stockValues: json
                   });
               } else {
                   dispatch({
                       type: 'RECEIVE_STOCK_VALUES_FAILURE',
                       msg: json
                   });
               }
           });
        });
    };
}*/

function getStockValues(symbols) {
    return (dispatch) => {
        const promiseArray = new Array(symbols.length);
        for(let i = 0; i < promiseArray.length; i++) {
             promiseArray[i] = new Promise((resolve, reject) => {
                fetch('https://www.quandl.com/api/v3/datasets/WIKI/' + symbols[i] + '.json' +
                    '?api_key=C3UE62CdFhxe2WfsM65n&start_date=2015-08-14&end_date=2016-08-14')
                    .then((response) => {
                        return response.json();
                    })
                    .then((json) => {
                        const stockValues = {
                            name: json.dataset.dataset_code,
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
                        description: json.dataset.name
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
            console.log(response);
            response.json().then((json) => {
                console.log(json);
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