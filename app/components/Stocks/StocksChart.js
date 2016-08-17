import React from 'react';
import {connect} from 'react-redux';
import { getAllStockValues } from '../../actions/stocks_actions';

class StocksChart extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.dispatch(getAllStockValues());
        this.drawChart(document);
    }

    componentDidUpdate() {
        this.drawChart(document);
    }

    render() {
        const loading = this.props.stockValues.isFetching ?
            <div>
                Loading...
            </div> : null;
        return (
            <div>
                {loading}
                <div id="chart" style={{maxWidth: 100 + '%'}}></div>
            </div>
        );
    }

    drawChart(document) {

       $('#chart').highcharts('StockChart', {
            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'Tracked stocks'
            },

            series: this.props.stockValues.items
        });
    }
}

const mapStateToProps = (state) => {
    return {
        stockValues: state.stockValues
    }
};

export default connect(mapStateToProps)(StocksChart);