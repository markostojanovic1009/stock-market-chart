import React from 'react';
import { connect } from 'react-redux';
class StocksTable extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                STOCKS:
                <ul>
                    {this.props.stocks.map((stock) => {
                        return (
                            <li key={stock.id}>
                                {stock.symbol} created at {stock.created_at}
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