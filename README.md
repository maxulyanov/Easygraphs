# Easygraphs
Javascript library for building flexible graphs for your website
[![](http://m-ulyanov.github.io/Easygraphs/easy-graphs.jpg)](http://m-ulyanov.github.io/Easygraphs/)

##Getting started
1. `npm install easy-graphs` your project or download arhive
2. Include Easygraphs.js
3. Create instance Easygraphs with your options
5. Draw Easygraphs at the right time
```html
<script>
   var eq = new Easygraphs(object options);
   eq.render();
</script>
```

## Options
```javascript
var defaultOptions = {
        container: null,
        width: 1024,
        height: 400,
        speedRenderingFragment: 40,
        padding: {
            top: 20,
            left: 60,
            bottom: 60,
            right: 20
        },
        color: '#FFF',
        xAxis: {
            labels: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
            border: {
                show: true,
                width: 1,
                color: '#DADADA'
            },
            segment: {
                show: true,
                width: 1,
                height: 10,
                color: '#DADADA'
            },
            text: {
                color: '#222',
                size: 12
            },
            grid: {
                show: true,
                width: 1,
                color: '#DADADA'
            }
        },
        yAxis: {
            title: {
                show: true,
                text: 'yAxis title',
                size: 14,
                color: '#222'
            },
            segment: {
                show: true,
                count: 5,
                width: 10,
                height: 1,
                color: '#DADADA'
            },
            border: {
                show: true,
                width: 1,
                color: '#DADADA'
            },
            text: {
                show: true,
                color: '#222',
                size: 12,
                toFixed: 1,
                outputCallback: null
            },
            grid: {
                show: true,
                width: 1,
                color: '#DADADA'
            }
        },
        legends: {
            show: true,
            width: 20,
            height: 4,
            offsetY: 0,
            color: '#222',
            size: 12
        },
        tooltip: {
            show: true,
            color: '#FFF',
            background: false,
            borderWidth: 1,
            borderColor: false,
            template: '{{value}}',
            size: 12,
            width: 120,
            height: 25,
            widthAuto: false,
            rx: 3,
            ry: 3
        },
        dotsOptions: {
            show: true,
            width: 6,
            height: 6,
            color: '#7CB5EC',
            borderColor: '#7CB5EC',
            borderWidth: 1,
            rx: 25,
            ry: 25,
            hoverEffect: true
        },
        lineOptions: {
            show: true,
            width: 2,
            color: '#7CB5EC',
            fill: false,
            hoverEffect: true
        },
        data: [{
            name: 'Test data',
            dots: {
                color: 'rgb(31, 118, 185)'
            },
            line: {
                color: 'rgb(31, 118, 185)',
                fill: 'rgba(31, 118, 185, 0.3)'
            },
            values: [1, 5, 7, 9, 11, 15, 22, 14, 10, 1, 2]
        }],
        callbacks: {
            createItem: null,
            createInstance: null
        }
    };
```

##Callbacks
`createItem` - successful creation of the object array data<br>
`createInstance` - successful creation all object in data

##Browsers support
Chrome, FF, Opera, Safari, IE9+

##Example
See example - <a href="http://m-ulyanov.github.io/Easygraphs/">Easygraphs</a>
