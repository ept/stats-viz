$(function () {
    var samples = [], sampleMean, sampleStddev;
    var chartArea = {width: 700, height: 500};
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var axisArea = {
        width:  chartArea.width  - margin.left - margin.right,
        height: chartArea.height - margin.top  - margin.bottom
    };

    // Set up axes
    var x = d3.scale.linear().range([0, axisArea.width]);
    var y = d3.scale.linear().range([axisArea.height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(10);
    var yAxis = d3.svg.axis().scale(y).orient('left').ticks(10);

    // Set up chart area
    var chart = d3.select('#samples-chart').append('svg')
        .attr('width', chartArea.width)
        .attr('height', chartArea.height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Returns a function for calculating the gaussian probability density function for
    // given parameters mu and sigma.
    function gaussian(mean, stddev) {
        return function (x) {
            return Math.exp(-0.5 * (x - mean) * (x - mean) / (stddev * stddev)) / stddev / Math.sqrt(2 * Math.PI);
        };
    }

    // Generates a new list of samples with current parameter values, and calculates stats.
    function generateSamples(mean, stddev, numSamples) {
        var random = d3.random.normal(mean, stddev);
        samples = d3.range(numSamples).map(random);
        sampleMean = d3.mean(samples);
        var meanSquared = samples.map(function (sample) { return (sample - sampleMean) * (sample - sampleMean); });
        sampleStddev = Math.sqrt(d3.sum(meanSquared) / (samples.length - 1));
    }

    // Sets up the axes of the chart so that it is 3 standard deviations wide, and
    // tall enough to comfortably include the peak of the probability density function.
    function renderChartAxes(mean, stddev) {
        x.domain([mean - 3 * stddev, mean + 3 * stddev]);
        y.domain([0, 1.2 * gaussian(mean, stddev)(mean)]);
        chart.selectAll('g.axis').remove();
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + axisArea.height + ')')
            .call(xAxis);
        chart.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + Math.min(Math.max(x(0), 0), axisArea.width) + ',0)')
            .call(yAxis);
    }

    // Renders the Gaussian probability density function in the chart.
    function renderGaussian(mean, stddev) {
        // Make a data point for each pixel in the range [0, axisArea.width)
        var data = d3.range(axisArea.width + 1).map(x.invert).map(gaussian(mean, stddev));
        var line = d3.svg.line()
            .x(function (d, i) { return i; })
            .y(function (d, i) { return y(d); });
        chart.selectAll('path.gaussian').remove();
        chart.append('path')
            .datum(data)
            .attr('class', 'gaussian')
            .attr('d', line);
    }

    // Renders the list of samples in tabular form.
    function renderSamplesToTable() {
        var row = d3.select('#samples-table tbody').selectAll('tr').data(samples);
        row.enter().append('tr');
        row.exit().remove();
        row.selectAll('td').remove();
        row.append('td').text(function (d, i) { return i + 1; });
        row.append('td').text(function (d, i) { return d.toFixed(4); });
    }

    // Renders the list of samples as dots on the chart, just above the x axis.
    function renderSamplesToChart() {
        var circle = chart.selectAll('circle.sample').data(samples);
        circle.enter().append('circle').attr('class', 'sample');
        circle.exit().remove();
        circle.attr('r', 3)
            .attr('cx', function (d) { return x(d); })
            .attr('cy', function (d) { return axisArea.height - 20; });
    }

    function renderStatistics() {
        d3.select('#observed-mean').text(sampleMean.toFixed(4));
        d3.select('#observed-stddev').text(sampleStddev.toFixed(4));
        chart.selectAll('circle.mean').remove();
        chart.append('circle')
            .attr('class', 'mean')
            .attr('cx', x(sampleMean))
            .attr('cy', axisArea.height - 30)
            .attr('r', 3);
    }

    // Uses the current parameter settings to generate a new sample, and updates the page.
    function refresh() {
        var mean = parseFloat($('input#mean').val());
        var stddev = parseFloat($('input#stddev').val());
        var numSamples = parseInt($('input#samples').val());
        generateSamples(mean, stddev, numSamples);
        renderSamplesToTable();
        renderChartAxes(mean, stddev);
        renderGaussian(mean, stddev);
        renderSamplesToChart();
        renderStatistics();
    }

    // Event handlers
    $('input#generate').click(refresh);
    $('input#mean, input#stddev, input#samples').change(refresh);
    refresh();
});
