import React from 'react';
import { connect } from 'react-redux';
class StocksTable extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <ul className="stocks-table">
                    {this.props.stocks.map((stock) => {
                        return (
                            <li key={stock.id} className="stock-wrapper">
                                <div className="stock-symbol">{stock.symbol}</div>
                                <div className="stock-created-at">Tracking since:  {stock.created_at}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages
    }
};

export default connect(mapStateToProps)(StocksTable);