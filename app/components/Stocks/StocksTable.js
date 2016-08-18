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

    render() {
        return (
            <div>
                <ul className="stocks-table">
                    {this.props.stocks.map((stock) => {
                        return (
                            <li key={stock.id} className="stock-wrapper">
                                <div className="stock-symbol">{stock.symbol}</div>
                                <div className="stock-created-at">Tracking since:  {stock.created_at}</div>
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