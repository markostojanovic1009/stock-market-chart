import React from 'react';
import { connect } from 'react-redux';
class StocksTable extends React.Component {

    constructor() {
        super();
        this.state = {
            symbol: ''
        };
    }

    handleChange(event) {
        this.setState({ symbol: event.target.value });
    }

    handleAddButtonClick() {
        this.props.addStockHandle(this.state.symbol);
    }

    handleDeleteButtonClick(stockId) {
        this.props.deleteStockHandle(stockId);
    }

    render() {
        return (
            <div>
                <ul className="stocks-table">
                    {this.props.stocks.map((stock) => {
                        return (
                            <li key={stock.id} className="stock-wrapper">
                                <div className="stock-symbol">{stock.symbol}</div>
                                <button className="stock-delete-button" onClick={this.handleDeleteButtonClick.bind(this, stock.id)}>
                                    X
                                </button>
                                <div className="stock-description">{stock.description}</div>
                            </li>
                        );
                    })}
                    <li className="stock-wrapper stock-form">
                        <input name="symbol" onChange={this.handleChange.bind(this)}
                               value={this.state.symbol}
                               type="text" placeholder="Stock symbol..." />
                        <button className="button" onClick={this.handleAddButtonClick.bind(this)}>Add</button>
                    </li>
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