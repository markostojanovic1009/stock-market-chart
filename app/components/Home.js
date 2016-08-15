import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import StocksTable from './Stocks/StocksTable';
import { getAllStocks } from '../actions/stocks_actions';

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
                <div className="medium-offset-8 medium-4 small-12">
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
