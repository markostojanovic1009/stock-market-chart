import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import StocksTable from './Stocks/StocksTable';
import StocksChart from './Stocks/StocksChart';
import { getAllStocks, getStockValues } from '../actions/stocks_actions';

class Home extends React.Component {
    componentDidMount() {
        this.props.dispatch(getAllStocks());
    }

    render() {

        const loading = this.props.stocks.isFetching ?
            <div className="small-12">
                Loading...
            </div> : null;

        return (
            <div className="expanded row">
                {loading}
                <Messages messages={this.props.messages}/>
                <div className="medium-7 small-12 stock-chart-wrapper">
                    <StocksChart stocks={this.props.stocks.items}/>
                </div>
                <div className="medium-4 small-12 stock-table-wrapper">
                    <StocksTable stocks={this.props.stocks.items} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        stocks: state.stocks
    };
};

export default connect(mapStateToProps)(Home);
