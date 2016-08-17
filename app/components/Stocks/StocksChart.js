import React from 'react';
import {connect} from 'react-redux';

class StocksChart extends React.Component {
    constructor() {
        super();
    }

    componentDidUpdate() {
        this.drawChart();
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

    drawChart() {

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