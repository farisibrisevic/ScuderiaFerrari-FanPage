var data = [{
    x: ['Ukupno', 'HTML', 'CSS', 'JS'],
    y: [2878, 1113, 1522, 243],
    marker: {
        color: ['#6F0100', '#1f77b4', '#ff7f0e', '#2ca02c']
    },
    type: 'bar'
}];

var layout = {
    plot_bgcolor: '#ccc', 
    paper_bgcolor: '#ccc', 
    title: 'Korišteni jezici u projektu',
    xaxis: {
        title: 'Jezik',
        titlefont: {
            size: 18
        }
    },
    yaxis: {
        title: 'Linija koda',
        titlefont: {
            size: 18
        }
    }
};

Plotly.newPlot('myDiv', data, layout);
