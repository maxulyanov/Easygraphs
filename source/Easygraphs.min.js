/*
 * Easygraphs: Javascript library for building flexible graphs for your website
 * 0.2.5
 *
 * By Max Ulyanov
 * Source: https://github.com/M-Ulyanov/Easygraphs
 * Example http://m-ulyanov.github.io/Easygraphs/
 */


'use strict';

;(function () {


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


    var utils = new Utils();


    /**
     *
     * @param options
     * @constructor
     */
    function Easygraphs(options) {
        this.options = {};
        utils.extend(this.options, [defaultOptions, options]);
    }


    /**
     *
     * @returns {boolean}
     */
    Easygraphs.prototype.render = function () {
        var buildComponents = new EasygraphsBuildComponents(this.options);

        var container = this.options.container;
        if (container != null) {
            buildComponents.SVG(container);
        }
        else {
            console.error('Container not found!');
            return false;
        }
    };


    /**
     *
     * @param options
     * @constructor
     */
    function EasygraphsBuildComponents(options) {
        this._options = options;
        this._svg = null;
        this._bg = null;

        this._upperPoint = 0;
        this._coordsX = [];
        this._textLabelsX = [];
        this._coordsY = [];
        this._textLabelsY = [];
    }


    /**
     *
     * @param container
     * @returns {EasygraphsBuildComponents}
     */
    EasygraphsBuildComponents.prototype.SVG = function (container) {

        var width = this._options.width + this._options.padding.left + this._options.padding.right;
        var height = this._options.height + this._options.padding.top + this._options.padding.bottom;
        var svg = utils.createSvgElement('svg', {
            width: width,
            height: height,
            viewBox: '0 0 ' + width + ' ' + height,
            style: 'display:block'
        });
        container.appendChild(svg);

        this._bg = utils.createSvgElement('rect', {
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: this._options.color
        });
        svg.appendChild(this._bg);
        this._svg = svg;

        this._calcUpperPoint();
        this._calcCoordsY();
        this._calcCoordsX();

        this._createGrid();

        this._createComponentsX();
        this._createComponentsY();

        this._createLegends();
        this._createGraphs();

        this._instanceTooltip = new Tooltip(this._options.tooltip, this._svg, {
            show: this._options.dotsOptions.show,
            width: this._options.dotsOptions.width
        });
        if(this._options.tooltip.show) {
            this._instanceTooltip.create();
        }

        var callbackEnd = this._options.callbacks.createInstance;
        if (callbackEnd != null && typeof callbackEnd === 'function') {
            callbackEnd(svg);
        }

        return this;
    };


    /**
     *
     * @returns {EasygraphsBuildComponents}
     * @private
     */
    EasygraphsBuildComponents.prototype._createGrid = function () {
        var gridY = this._options.yAxis.grid;
        var gridX = this._options.xAxis.grid;
        var gridGroupY, gridGroupX, grid;

        var paddingLeft = this._options.padding.left;
        var paddingTop = this._options.padding.top;
        var heightWithPaddingtop = this._options.height + paddingTop;


        // Y
        if (gridY.show) {
            gridGroupY = utils.createSvgElement('g', {
                'class': 'easy-graphs-grid-y'
            });
            for (var i = 0; i < this._coordsX.length; i++) {

                // Create grid item
                grid = utils.createSvgElement('path', {
                    d: 'M ' + (this._coordsX[i] + 0.5) + ' ' + paddingTop + ' L ' + (this._coordsX[i] + 0.5) + ' ' + heightWithPaddingtop,
                    fill: 'none',
                    stroke: gridY.color,
                    'stroke-width': gridY.width
                });

                if (gridY.dasharray) {
                    grid.setAttribute('stroke-dasharray', gridY.dasharray);
                }

                gridGroupY.appendChild(grid);
            }
            this._svg.appendChild(gridGroupY);

        }


        // X
        if (gridX.show) {
            gridGroupX = utils.createSvgElement('g', {
                'class': 'easy-graphs-grid-x'
            });
            for (var j = 0; j < this._coordsY.length - 1; j++) {


                // Create grid item
                grid = utils.createSvgElement('path', {
                    d: 'M ' + (paddingLeft) + ' ' + this._coordsY[j] + ' L ' + (paddingLeft + this._options.width) + ' ' + this._coordsY[j],
                    fill: 'none',
                    stroke: gridX.color,
                    'stroke-width': gridY.width
                });

                if (gridX.dasharray) {
                    grid.setAttribute('stroke-dasharray', gridX.dasharray);
                }

                gridGroupX.appendChild(grid);
            }
            this._svg.appendChild(gridGroupX);
        }

        return this;
    };


    /**
     *
     * @returns {boolean}
     * @private
     */
    EasygraphsBuildComponents.prototype._createGraphs = function () {
        var data = this._options.data;
        if (!data || data.length < 0) {
            console.error('incorrect data in _createGraphs!');
            return false;
        }

        var self = this;
        var paddingLeft = self._options.padding.left;
        var paddingTop = self._options.padding.top;
        var dotsOptions = self._options.dotsOptions;
        var lineOptions = self._options.lineOptions;

        var graphsMain = utils.createSvgElement('g', {
            'class': 'easy-graphs-main'
        });
        var linesGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-lines'
        });
        var pointsListGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-points-list'
        });

        graphsMain.appendChild(linesGroup);
        graphsMain.appendChild(pointsListGroup);

        for (var k = 0; k < data.length; k++) {
            var item = data[k];
            inner(item, k);
        }

        function inner(item) {
            var x, y, type;
            var d = '';
            var arrayD = [];
            var arrayDFill = [];
            var values = item.values;
            var height = self._options.height;

            if(values == null) {
                return;
            }

            if ((item.line && item.line.show === true) || (lineOptions.show === true && item.line.show == null)) {
                var line = utils.createSvgElement('path', {
                    d: d,
                    fill: 'none',
                    stroke: item.line.color || lineOptions.color,
                    'stroke-width': item.line.width || lineOptions.width
                });
                var lineGroup = utils.createSvgElement('g', {
                    'class': 'easy-graphs-line'
                });
                lineGroup.appendChild(line);

                if (typeof (item.line.fill) === 'string') {
                    var fill = utils.createSvgElement('path', {
                        d: '',
                        fill: item.line.fill
                    });
                    lineGroup.appendChild(fill);
                }

                linesGroup.appendChild(lineGroup);
            }


            if ((item.dots && item.dots.show === true) || (dotsOptions.show === true && item.dots.show == null)) {
                var pointsGroup = utils.createSvgElement('g', {
                    'class': 'easy-graphs-points'
                });
                pointsListGroup.appendChild(pointsGroup);

                var dotDOptions = {
                    width: item.dots.width || dotsOptions.width,
                    height: item.dots.height || dotsOptions.height,
                    stroke: item.dots.borderColor || item.dots.color,
                    fill: item.dots.color || self._options.color,
                    'stroke-width': item.dots.borderWidth || dotsOptions.borderWidth,
                    rx: item.dots.rx || dotsOptions.rx,
                    ry: item.dots.ry || dotsOptions.ry
                };

                var dotEOptions = {
                    width: dotsOptions.width * 2,
                    height: dotsOptions.height * 2,
                    fill: 'none;',
                    opacity: 0,
                    'class': 'dot-emulate',
                    'data-color': item.dots.color || item.dots.borderColor || item.line.color,
                    'data-color-default': item.dots.color || self._options.color,
                    'data-category': item.name,
                    style: 'cursor: pointer'
                };
            }


            for (var i = 0; i < values.length; i++) {
                (function (i) {
                    setTimeout(function () {
                        var value = values[i];
                        if (i === 0) {
                            x = paddingLeft;
                        }
                        else {
                            x = self._options.width / (values.length - 1) * i + paddingLeft;
                        }
                        y = height / 100 * (100 * value / (self._upperPoint));
                        y = height - y + paddingTop;

                        if (i === 0) {
                            type = 'M ';
                            arrayD.push(type + x + ' ' + y);
                            arrayDFill.push(type + x + ' ' + y);
                        }
                        else {
                            type = ' L '
                        }
                        d += type + x + ' ' + y;
                        arrayD.push('L ' + x + ' ' + y);


                        //
                        if ((item.line && item.line.show === true) || (lineOptions.show === true && item.line.show == null)) {
                            line.setAttribute('d', d);

                            if (typeof (item.line.fill) === 'string') {
                                var lastItem = arrayD[i + 1];
                                arrayDFill.splice(i + 1, 0, lastItem);

                                var lastItemSplitComponents = lastItem.split(' ');
                                lastItemSplitComponents[2] = self._options.height + paddingTop;

                                var lastCollect = lastItemSplitComponents.join(' ');
                                arrayDFill.splice(i + 2, 0, lastCollect);

                                fill.setAttribute('d', arrayDFill.join(' '));
                            }
                        }


                        //
                        if ((item.dots && item.dots.show === true) || (dotsOptions.show === true && item.dots.show == null)) {
                            var dotY = y - dotsOptions.height / 2;
                            if (dotY < 0) {
                                dotY = 0;
                            }

                            dotDOptions.x = x - dotsOptions.width / 2;
                            dotDOptions.y = dotY;
                            var dot = utils.createSvgElement('rect', dotDOptions);
                            pointsGroup.appendChild(dot);

                            dotEOptions.x = x - dotsOptions.width;
                            dotEOptions.y = dotY - dotsOptions.height / 2;
                            dotEOptions['data-value'] = value;
                            var dotEmulate = utils.createSvgElement('rect', dotEOptions);
                            pointsGroup.appendChild(dotEmulate);
                            self._setEventsDots(dotEmulate);
                        }

                    }, self._options.speedRenderingFragment * i);
                })(i);
            }

            // callback
            var callbackEnd = self._options.callbacks.createItem;
            if (callbackEnd != null && typeof callbackEnd === 'function') {
                callbackEnd(lineGroup, pointsGroup);
            }

            self._setEventsAnimateHover([lineGroup, pointsGroup]);
        }

        this._svg.appendChild(graphsMain);
    };


    /**
     *
     * @returns {*}
     * @private
     */
    EasygraphsBuildComponents.prototype._createLegends = function () {
        var data = this._options.data;
        var legends = this._options.legends;
        if (!data || data.length < 0) {
            console.error('incorrect data in _legend!');
            return false;
        }

        if (!legends.show) {
            return;
        }

        var legendItem, legendLine, legendText, clientRect;
        var translateItem = 'translate(0, 0)';
        var x = 0;
        var y = 0;
        var maxHeightLegendItem = 0;
        var lineNumber = 0;

        var legendsGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-legends'
        });
        this._svg.appendChild(legendsGroup);

        for (var i = 0; i < data.length; i++) {

            legendItem = utils.createSvgElement('g', {
                'class': 'easy-graphs-legend-item',
                transform: translateItem
            });

            var strokeColor;
            if(data[i].line && data[i].line.color) {
                strokeColor = data[i].line.color;
            }
            else if(data[i].dots) {
                if(data[i].dots.color) {
                    strokeColor = data[i].dots.color;
                }
                else if(data[i].dots.borderColor) {
                    strokeColor = data[i].dots.borderColor;
                }
            }

            legendLine = utils.createSvgElement('path', {
                fill: 'none',
                d: 'M 0 ' + (legends.offsetY + 0.5) + ' L ' + legends.width + ' ' + (legends.offsetY + 0.5),
                stroke: strokeColor,
                'stroke-width': legends.height
            });
            legendItem.appendChild(legendLine);

            legendText = utils.createSvgElement('text', {
                x: legends.width + 10, // 10 - spacing elements
                y: legends.height,
                'text-anchor': 'start',
                style: 'color:' + legends.color + ';cursor:default;font-weight:600;font-size:' + legends.size + 'px;' +
                'fill:' + legends.color
            });
            legendText.textContent = data[i].name || '';
            legendItem.appendChild(legendText);
            legendsGroup.appendChild(legendItem);

            if (clientRect) {
                x += clientRect.width + 20; // 20 - spacing elements
                if ((x + legendItem.getBBox().width) > this._options.width) {
                    x = 0;
                    lineNumber++;
                    y = lineNumber * maxHeightLegendItem; // padding between lines
                }
                translateItem = 'translate(' + x + ', ' + y + ')';
            }

            legendItem.setAttribute('transform', translateItem);

            clientRect = legendItem.getBBox();
            if (clientRect.height > maxHeightLegendItem) {
                maxHeightLegendItem = clientRect.height + 3; // 3 - padding between lines1
            }
        }

        var groupPositionX = this._options.padding.left;
        var groupPositionY = this._options.height + this._options.padding.top +
            (this._svg.querySelector('.easy-graphs-components-x').getBBox().height) + 20 // 20 -padding
        if (this._options.width > legendsGroup.getBBox().width && lineNumber === 0) {
            groupPositionX = (this._options.width / 2 + this._options.padding.left)
                - (legendsGroup.getBBox().width / 2);
        }
        legendsGroup.setAttribute('transform', 'translate(' + groupPositionX + ', ' + groupPositionY + ')');

        var height = parseInt(this._svg.getAttribute('height')) + (lineNumber + 1) * maxHeightLegendItem;
        var width = parseInt(this._svg.getAttribute('width'));
        this._updateSizeSVG(width, height);

        return this;
    };


    /**
     *
     * @param width
     * @param height
     * @private
     */
    EasygraphsBuildComponents.prototype._updateSizeSVG = function (width, height) {
        utils.setAttributes(this._svg, {
            width: width,
            height: height,
            viewBox: '0 0 ' + width + ' ' + height
        });
        if (this._bg) {
            utils.setAttributes(this._bg, {
                width: width,
                height: height
            });
        }
    };


    /**
     *
     * @returns {*}
     * @private
     */
    EasygraphsBuildComponents.prototype._createComponentsX = function () {
        var labels = this._options.xAxis.labels;
        if (!labels || labels.length < 0) {
            console.error('incorrect labels in _createComponentsX!');
            return false;
        }

        var xAxis = this._options.xAxis;
        var label, segment, x;
        var paddingLeft = this._options.padding.left;
        var heightWithPaddingtop = this._options.height + this._options.padding.top;


        var componentsXGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-components-x'
        });
        var labelsGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-labels'
        });
        var segmentGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-segments'
        });


        // Create line
        if(xAxis.border.show) {
            var line = utils.createSvgElement('path', {
                fill: 'none',
                d: 'M ' + paddingLeft + ' ' + (heightWithPaddingtop + 0.5) + ' L '
                + (this._options.width + paddingLeft) + ' ' + (heightWithPaddingtop + 0.5),
                stroke: xAxis.border.color,
                'stroke-width': xAxis.border.width
            });

            if (xAxis.border.dasharray) {
                line.setAttribute('stroke-dasharray', xAxis.border.dasharray);
            }

            componentsXGroup.appendChild(line);
        }


        //
        for (var i = 0; i < labels.length; i++) {

            // Create label (text)
            label = utils.createSvgElement('text', {
                x: this._textLabelsX[i],
                y: heightWithPaddingtop + xAxis.segment.height + (xAxis.text.size * 1.3),
                'text-anchor': 'middle',
                style: 'color:' + xAxis.text.color + ';cursor:default;font-size:' + xAxis.text.size + 'px;fill:' +
                xAxis.text.color + ';text-overflow:clip;'
            });
            label.textContent = labels[i];
            labelsGroup.appendChild(label);

            if(xAxis.segment.show) {
                // Create segment
                segment = utils.createSvgElement('rect', {
                    x: this._coordsX[i],
                    y: heightWithPaddingtop,
                    width: xAxis.segment.width,
                    height: xAxis.segment.height,
                    fill: xAxis.segment.color
                });
                segmentGroup.appendChild(segment);
            }
        }

        if(xAxis.segment.show) {
            componentsXGroup.appendChild(segmentGroup);
        }

        componentsXGroup.appendChild(labelsGroup);
        this._svg.appendChild(componentsXGroup);

        return this;
    };


    /**
     *
     * @private
     */
    EasygraphsBuildComponents.prototype._createComponentsY = function () {
        var yAxis = this._options.yAxis;
        var label, segment;
        var paddingLeft = this._options.padding.left;
        var paddingTop = this._options.padding.top;
        var heightWithPaddingTop = this._options.height + this._options.padding.top;


        var componentsYGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-components-y'
        });
        var labelsGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-labels'
        });
        var segmentGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-segments'
        });


        // Create line
        if (this._options.yAxis.border.show) {
            var line = utils.createSvgElement('path', {
                fill: 'none',
                d: 'M ' + (paddingLeft + 0.5) + ' ' + paddingTop + ' L ' + (paddingLeft + 0.5) + ' ' + heightWithPaddingTop,
                stroke: yAxis.border.color,
                'stroke-width': yAxis.border.width
            });

            if (yAxis.border.dasharray) {
                line.setAttribute('stroke-dasharray', yAxis.border.dasharray);
            }

            componentsYGroup.appendChild(line);
        }


        // Create title
        if (yAxis.title && yAxis.title.show) {
            var rotateY = this._options.padding.top + this._options.height / 2;
            var title = utils.createSvgElement('text', {
                x: 25,
                y: rotateY,
                'text-anchor': 'middle',
                transform: 'translate(0,0) rotate(270 ' + 25 + ' ' + rotateY + ')',
                style: 'color:' + yAxis.title.color + ';fill:' + yAxis.title.color + ';font-weight:600;font-size:' + yAxis.title.size + 'px'
            });
            title.textContent = yAxis.title.text;
            componentsYGroup.appendChild(title);
        }


        for (var i = 0; i < this._coordsY.length; i++) {
            var y = this._coordsY[i];

            if (this._options.yAxis.segment.show) {
                y -= (yAxis.text.size / 2);
                segment = utils.createSvgElement('path', {
                    d: 'M ' + (paddingLeft - yAxis.segment.width) + ' ' + this._coordsY[i] + ' L ' + (paddingLeft) + ' ' + this._coordsY[i],
                    fill: 'none',
                    stroke: yAxis.segment.color,
                    'stroke-width': yAxis.segment.height
                });
                segmentGroup.appendChild(segment);
            }

            if (this._options.yAxis.text.show) {
                label = utils.createSvgElement('text', {
                    x: paddingLeft - (yAxis.text.size / 2),
                    y: y,
                    'text-anchor': 'end',
                    style: 'color:' + yAxis.text.color + ';cursor:default;font-size:' + yAxis.text.size + 'px;fill:' +
                    yAxis.text.color + ';text-overflow:clip;'
                });
                label.textContent = this._textLabelsY[i];
                labelsGroup.appendChild(label);
            }
        }

        componentsYGroup.appendChild(segmentGroup);
        componentsYGroup.appendChild(labelsGroup);
        this._svg.appendChild(componentsYGroup);

        return this;
    };


    /**
     *
     * @returns {*}
     * @private
     */
    EasygraphsBuildComponents.prototype._calcUpperPoint = function () {
        var arrays = this._options.data;
        if (!arrays || arrays.length < 0) {
            console.error('incorrect arrays in _calcUpperPoint!');
            return false;
        }

        var concatArrays = [];
        for (var i = 0; i < arrays.length; i++) {
            var array = arrays[i].values;
            if(array == null) {
                continue;
            }
            for (var j = 0; j < array.length; j++) {
                concatArrays.push(array[j]);
            }
        }

        var maxValue = Math.max.apply(Math, concatArrays);
        var result = 0;
        var stringValue = String(maxValue);
        var stringArray = stringValue.split('.');
        var floatValue = stringArray[1];

        if (floatValue != null && 1 > floatValue) {
            while (true) {
                if (floatValue % 5 === 0) {
                    break;
                }
                floatValue = parseInt(floatValue) + 1;
            }
            stringArray[1] = floatValue;
            result = parseFloat(stringArray.join('.'));
        }
        else {
            var maxValue = parseInt(maxValue);
            var length = String(maxValue).length;
            var coef = 5;
            var zero = 0;
            if (length > 2) {
                zero = Math.floor((length - 1) / 2);
                for (var l = 0; l < zero; l++) {
                    coef += '0';
                    if(l > 0) {
                        coef *= 2;
                    }
                }
            }
            while (true) {
                if (maxValue % coef === 0) {
                    break;
                }
                maxValue++;
            }
            result = maxValue;
        }
        this._upperPoint = result;

        return this;
    };


    /**
     *
     * @private
     */
    EasygraphsBuildComponents.prototype._calcCoordsY = function () {
        var count = this._options.yAxis.segment.count;
        var outputCallback = this._options.yAxis.text.outputCallback;
        var coef = (this._upperPoint) / count;
        var total = this._upperPoint;
        var procent = 0;
        for (var i = 0; i < count; i++) {
            if (i !== 0 && total > 0) {
                total -= coef;
            }
            procent = total * 100 / this._upperPoint;
            procent = this._options.height - (this._options.height / 100 * procent);
            procent += this._options.padding.top;
            this._coordsY.push(parseInt(procent.toFixed(0)) + 0.5);

            if(typeof outputCallback === 'function') {
                this._textLabelsY.push(outputCallback(parseInt(total)));
            }
            else {
                this._textLabelsY.push(total.toFixed(this._options.yAxis.text.toFixed));
            }

        }
        this._textLabelsY.push(0);
        this._coordsY.push(this._options.height + this._options.padding.top + 0.5);
        return this;
    };


    /**
     *
     * @returns {*}
     * @private
     */
    EasygraphsBuildComponents.prototype._calcCoordsX = function () {
        var labels = this._options.xAxis.labels;
        if (!labels || labels.length < 0) {
            console.error('incorrect labels in _calcCoordsX!');
            return false;
        }

        var paddingLeft = this._options.padding.left;
        var x;
        for (var i = 0; i < labels.length; i++) {
            if (i === 0) {
                x = paddingLeft;
            }
            else {
                x = this._options.width / (labels.length - 1) * i + this._options.padding.left;
                if (i === (labels.length - 1)) {
                    x--;
                }
            }
            this._textLabelsX.push(x);

            var segmentX = x - this._options.xAxis.segment.width / 2;
            if (i === 0) {
                segmentX = x;
            }
            segmentX = Math.round(segmentX);
            this._coordsX.push(segmentX);

        }

        return this;
    };


    /**
     *
     * @param element
     * @returns {EasygraphsBuildComponents}
     * @private
     */
    EasygraphsBuildComponents.prototype._setEventsDots = function (element) {
        var self = this;

        element.addEventListener('mouseenter', function () {
            var color = element.getAttribute('data-color');
            var dot = this.previousSibling;

            if (dot) {
                dot.setAttribute('fill', color);
                if (self._instanceTooltip.isCreated) {
                    var style = 'fill:' + (self._options.tooltip.background || color) +
                                ';color:' + self._options.tooltip.color +
                                ';stroke-width:' + self._options.tooltip.borderWidth +
                                ';stroke:' + (self._options.tooltip.borderColor || color);
                    self._instanceTooltip.show({
                        template: self._options.tooltip.template,
                        rect: dot.getBoundingClientRect(),
                        style: style,
                        value: element.getAttribute('data-value'),
                        category: element.getAttribute('data-category')
                    });
                }
            }
        });

        element.addEventListener('mouseleave', function () {
            var colorDefault = element.getAttribute('data-color-default');
            var dot = this.previousSibling;
            if (dot) {
                dot.setAttribute('fill', colorDefault);
                if (self._instanceTooltip.isCreated) {
                    self._instanceTooltip.hide();
                }
            }
        });

        return this;
    };


    /**
     *
     * @param elements
     * @returns {EasygraphsBuildComponents}
     * @private
     */
    EasygraphsBuildComponents.prototype._setEventsAnimateHover = function (elements) {

        var self = this;

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element == null) {
                continue;
            }

            element.addEventListener('mouseenter', function (event) {
                editWidth(event.type);
            });

            element.addEventListener('mouseleave', function (event) {
                editWidth(event.type);
            });
        }


        /**
         *
         * @param eventType
         */
        function editWidth(eventType) {
            if (elements[0]) {
                var line = elements[0].querySelector('path');
                var widthLine = parseInt(line.getAttribute('stroke-width'));
            }
            if (elements[1]) {
                var dots = elements[1].querySelectorAll('rect');
                var widthDots = parseInt(dots[0].getAttribute('stroke-width'));
            }

            if (eventType === 'mouseenter') {
                widthLine++;
                widthDots++;
            }
            else {
                widthLine--;
                widthDots--;
            }

            if (self._options.dotsOptions.hoverEffect) {
                if (dots) {
                    for (var i = 0; i < dots.length; i++) {
                        var dot = dots[i];
                        dot.setAttribute('stroke-width', String(widthDots));
                    }
                }
            }
            if (self._options.lineOptions.hoverEffect) {
                if (line) {
                    line.setAttribute('stroke-width', String(widthLine));
                }
            }
        }

        return this;
    };


    /**
     *
     * @param options
     * @param svg
     * @param dotOptios
     * @constructor
     */
    function Tooltip(options, svg, dotOptios) {
        this.isCreated = false;
        this._tooltipBg = null;
        this._tooltipText = null;
        this._svg = svg;
        this._options = options;
        this._dotOptions = dotOptios;
    }


    /**
     *
     * @returns {*}
     */
    Tooltip.prototype.create = function () {
        if (!this._options || !this._options.show) {
            return false;
        }

        var tooltipGroup = utils.createSvgElement('g', {
            'class': 'easy-graphs-tooltip'
        });

        this._tooltipBg = utils.createSvgElement('rect', {
            x: 0,
            y: 0,
            width: this._options.width,
            height: this._options.height,
            rx: this._options.rx,
            ry: this._options.ry,
            visibility: 'hidden',
            style: 'fill:' + this._options.color
        });
        tooltipGroup.appendChild(this._tooltipBg);

        this._tooltipText = utils.createSvgElement('text', {
            x: 0,
            y: 0,
            visibility: 'hidden',
            style: 'font-size:' + this._options.size + 'px; fill:' + this._options.color + ';color: ' + this._options.color
        });
        tooltipGroup.appendChild(this._tooltipText);

        this._svg.appendChild(tooltipGroup);
        this.isCreated = true;

        return this;
    };


    /**
     *
     * @param data
     * @returns {Tooltip}
     */
    Tooltip.prototype.show = function (data) {
        utils.setAttributes(this._tooltipText, {
            visibility: 'visible'
        });
        this._tooltipText.textContent = utils.parseTemplate(data.template, data);

        if (this._options.widthAuto) {
            this._options.width = this._tooltipText.getBBox().width + 10;
        }

        var coords = this._calcPosition(data.rect);

        utils.setAttributes(this._tooltipText, {
            x: coords.x + 5,
            y: coords.y + 17

        });

        utils.setAttributes(this._tooltipBg, {
            x: coords.x,
            y: coords.y,
            width: this._options.width,
            visibility: 'visible',
            style: data.style
        });

        return this;
    };


    /**
     *
     * @returns {Tooltip}
     */
    Tooltip.prototype.hide = function () {
        this._tooltipText.setAttribute('visibility', 'hidden');
        this._tooltipBg.setAttribute('visibility', 'hidden');
        return this;
    };


    /**
     *
     * @param rect
     * @returns {{x: number, y: number}}
     * @private
     */
    Tooltip.prototype._calcPosition = function (rect) {
        var coords = {
            x: 0,
            y: 0
        };
        var padding = 5;
        var svgRect = this._svg.getBoundingClientRect();
        var svgX = svgRect.left + window.pageXOffset;
        var svgY = svgRect.top + window.pageYOffset;
        var x = rect.left + window.pageXOffset;
        var y = rect.top + window.pageYOffset;

        coords.x = x - svgX - (this._options.width / 2);
        if (this._dotOptions.show) {
            coords.x += this._dotOptions.width / 2
        }
        if (coords.x < 0) {
            coords.x = 0;
        }
        else if (coords.x + this._options.width >= svgRect.width) {
            coords.x = svgRect.width - this._options.width;
        }

        coords.y = y - svgY - this._options.height - padding;
        if (y - svgY < this._options.height + padding) {
            coords.y = y - svgY + rect.height + padding;
        }
        else if (coords.y + this._options.height >= svgRect.height) {
            coords.y = svgRect.height - this._options.height;
        }

        return coords;
    };


    /**
     *
     * @constructor
     */
    function Utils() {

        var self = this;

        /**
         *
         * @param target
         * @param objects
         * @param options
         * @returns {*}
         */
        this.extend = function (target, objects, options) {
            for (var object in objects) {
                if (objects.hasOwnProperty(object)) {
                    recursiveMerge(target, objects[object]);
                }
            }

            function recursiveMerge(target, object) {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        var current = object[property];
                        if (self.getConstructor(current) === 'Object') {
                            if (!target[property]) {
                                target[property] = {};
                            }
                            recursiveMerge(target[property], current);
                        }
                        else {
                            /** @namespace options.clearEmpty */
                            if (options && options.clearEmpty) {
                                if (current == null) {
                                    continue;
                                }
                            }
                            target[property] = current;
                        }
                    }
                }
            }

            return target;
        };


        /**
         *
         * @param template
         * @param objectCallback
         * @returns {*}
         */
        this.parseTemplate = function (template, objectCallback) {
            if (!template || !objectCallback) {
                return '';
            }

            var pattern = /{{[^{{]+}}/gi;

            return template.replace(pattern, function (foundString) {
                // remove {{ }} and spaces
                foundString = foundString.replace(/\s+/g, '');
                var property = foundString.split('').filter(function (current, index, array) {
                    if (index > 1 && array.length - 2 > index) {
                        return true;
                    }
                }).join('');
                if (property in objectCallback) {
                    return objectCallback[property];
                }
                else {
                    return '';
                }
            });
        };


        /**
         *
         * @param object
         * @returns {string}
         */
        this.getConstructor = function (object) {
            return Object.prototype.toString.call(object).slice(8, -1);
        };


        /**
         *
         * @param tag
         * @param attributes
         * @returns {Element}
         */
        this.createSvgElement = function (tag, attributes) {
            var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            this.setAttributes(element, attributes);
            return element;
        };


        /**
         *
         * @param element
         * @param attributes
         * @returns {*}
         */
        this.setAttributes = function (element, attributes) {
            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            return element;
        }
    }


    window.Easygraphs = Easygraphs;


})();
