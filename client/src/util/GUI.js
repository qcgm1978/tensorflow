export default class {
    constructor({ plot }) {
        if (plot) {
            this.embedThree = require('vega-embed').default;
            this.plot = this.embed;
        } else {
            this.plot = this.plotly;
        }
    }
    plotly(lines, layout) {
        this.Plotly = require('plotly.js-geo-dist');
        this.Plotly.newPlot('graph', lines, layout, {
            displayModeBar: false
        });
    }
    embed({ lossValues, accuracyValues, examplesPerSecValues }) {
        this.embedThree(
            '#lossCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': { 'values': lossValues },
                'mark': 'line',
                'encoding': {
                    'x': { 'field': 'epoch', 'type': 'ordinal' },
                    'y': { 'field': 'loss', 'type': 'quantitative' },
                    'color': { 'field': 'set', 'type': 'nominal' },
                },
                'width': 400,
            },
            {});

        this.embedThree(
            '#accuracyCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': { 'values': accuracyValues },
                'mark': 'line',
                'encoding': {
                    'x': { 'field': 'epoch', 'type': 'ordinal' },
                    'y': { 'field': 'accuracy', 'type': 'quantitative' },
                    'color': { 'field': 'set', 'type': 'nominal' },
                },
                'width': 400,
            },
            {});
        this.embedThree(
            '#examplesPerSecCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': { 'values': examplesPerSecValues },
                'mark': 'line',
                'encoding': {
                    'x': { 'field': 'epoch', 'type': 'ordinal' },
                    'y': { 'field': 'examples/s', 'type': 'quantitative' },
                },
                'width': 400,
            },
            {});
    }
}