import React from 'react';
import { connect } from 'react-redux';
import Messages from '../Messages';
class StocksTable extends React.Component {

    constructor() {
        super();
        this.state = {
            symbol: ''
        };
    }

    componentDidMount() {
        this.socket = this.props.socket;

        /*
         * Calls notifyChange to update the state based on an event emitted by the server
         */
        this.socket.on('add-stock', (stock) => {
            this.props.notifyChange({type: 'STOCK', payload: stock});
        });

        this.socket.on('receive-stock-values', (values) => {
            this.props.notifyChange({type: 'STOCK_VALUES', payload: values});
        });

        this.socket.on('remove-stock', (removedStock) => {
            this.props.notifyChange({type: 'REMOVED_STOCK', payload: removedStock});
        })

    }

    handleChange(event) {
        this.setState({ symbol: event.target.value });
    }

    handleAddButtonClick() {
        this.props.addStockHandle(this.state.symbol);
        this.setState({symbol: ''});
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
                <Messages messages={this.props.messages} />
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