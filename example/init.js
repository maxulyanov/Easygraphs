/**
 * Created by 1 on 19.05.2016.
 */

'use strict';

document.addEventListener('DOMContentLoaded', ready);

function ready() {
    var eg1 = new Easygraphs({
        container: document.getElementById('svg-init-1'),
        width: 880,
        height: 200,
        padding: {
            top: 30,
            right: 30,
            left: 55
        },
        tooltip: {
            template: 'Number errors: {{ value }}',
            widthAuto: true,
            color: '#222',
            background: '#FFF'
        },
        yAxis: {
            text: {
                toFixed: 0
            },
            title: {
                text: 'May'
            },
            grid: {
                dasharray: '1%'
            }
        },
        xAxis: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
            grid: {
                dasharray: '1%'
            }
        },
        data: [{
            name: 'Errors',
            dots: {
                color: 'rgb(246, 75, 47)'
            },
            line: {
                width: 2,
                color: 'rgb(246, 75, 47)',
                fill: 'rgba(246, 75, 47, 0.5)'
            },
            values: [12, 22, 25, 23, 32, 34, 37, 30, 32, 40, 51, 56, 52, 70, 68, 72, 74, 78, 91, 92, 95, 96, 98, 121, 70, 78, 76, 68, 72, 71, 92]
        }]
    });
    eg1.render();



    var eg2 = new Easygraphs({
        container: document.getElementById('svg-init-2'),
        width: 870,
        height: 200,
        padding: {
            top: 30,
            right: 30,
            left: 65
        },
        tooltip: {
            template: '{{ category }}: {{ value }}',
            widthAuto: true,
            color: '#222',
            background: '#FFF'
        },
        yAxis: {
            text: {
                toFixed: 0
            },
            title: {
                text: 'May visitors'
            }
        },
        xAxis: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
            grid: {
                show: false
            }
        },
        data: [
            {
                name: 'Search engines',
                dots: {
                    color: 'rgb(139, 197, 84)'
                },
                line: {
                    width: 2,
                    color: 'rgb(139, 197, 84)'
                },
                values: [1145, 1172, 915, 950, 1166, 1167, 1120, 1154, 1199, 1204, 905, 1178, 902, 925, 957, 960, 1102, 1107, 1133, 1150, 1170, 1190, 1170, 1120, 1180, 996, 1125, 1155, 1210, 1290, 1299]
            },
            {
                name: 'Direct Request',
                dots: {
                    color: 'rgb(255, 217, 99)'
                },
                line: {
                    width: 2,
                    color: 'rgb(255, 217, 99)'
                },
                values: [145, 372, 115, 450, 266, 146, 132, 135, 139, 140, 205, 378, 402, 425, 455, 426, 450, 401, 331, 350, 410, 420, 370, 326, 358, 421, 526, 561, 624, 526, 599]
            },
            {
                name: 'Links to websites',
                dots: {
                    color: 'rgb(169, 85, 184)'
                },
                line: {
                    width: 2,
                    color: 'rgb(169, 85, 184)'
                },
                values: [23, 72, 15, 41, 66, 248, 72, 354, 30, 48, 25, 71, 42, 25, 352, 126, 45, 73, 31, 44, 52, 62, 87, 106, 138, 99, 52, 87, 62, 144, 301]
            }
        ]
    });
    eg2.render();


    var bigData = [];
    for (var i = 0; i < 200; i++) {
        bigData[i] = randomInteger(0, 1000);

    }
    var eg3 = new Easygraphs({
        container: document.getElementById('svg-init-3'),
        width: 870,
        height: 200,
        speedRenderingFragment: 10,
        padding: {
            top: 30,
            right: 30,
            left: 65
        },
        tooltip: {
            show: false
        },
        yAxis: {
            grid: {
                dasharray: '#D7D7D7'
            },
            text: {
                toFixed: 0
            },
            title: {
                text: 'Number likes'
            },
            border: 0
        },
        xAxis: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            grid: {
                show: false
            }
        },
        legends: {
            show: false
        },
        data: [
            {
                name: 'Likes',
                dots: {
                    show: false
                },
                line: {
                    width: 1,
                    color: 'rgb(77, 159, 171)',
                    fill: 'rgba(77, 159, 171, 0.5)'
                },
                values: bigData
            }
        ]
    });
    eg3.render();


    var eg4 = new Easygraphs({
        container: document.getElementById('svg-init-4'),
        width: 880,
        height: 200,
        speedRenderingFragment: 50,
        padding: {
            top: 30,
            right: 30,
            left: 55
        },
        tooltip: {
            widthAuto: true
        },
        yAxis: {
            grid: {
                dasharray: '1%'
            },
            title: {
                text: 'Temperature (°C)'
            },
            text: {
                toFixed: 0
            }
        },
        xAxis: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            grid: {
                show: false
            }
        },
        legends: {
            width: 6,
            height: 6,
            offsetY: 2
        },
        dotsOptions: {
            width: 10,
            height: 10,
            color: '#FFF'
        },
        lineOptions: {
            show: false
        },
        data: [
            {
                name: 'New York City',
                dots: {
                    borderColor: '#5BD999'
                },
                values: [0.3, 1.8, 5.9, 11.7, 16.9, 21.9, 24.7, 24, 20, 13.8, 8.7, 3.1]
            },
            {
                name: 'Miami',
                dots: {
                    borderColor: '#E6567A'
                },
                values: [20.1, 21.2, 22.6, 24.3, 26.6, 29, 31, 28.3, 26.6, 23.8, 21.4, 25.1]
            },
            {
                name: 'Rio de Janeiro',
                dots: {
                    borderColor: '#00C0E4'
                },
                values: [26.2, 26.5, 26, 27.5, 23, 24.5, 21.3, 20.8, 22.8, 27, 27.8, 28]
            },
            {
                name: 'Las Vegas',
                dots: {
                    borderColor: '#EAC14D'
                },
                values: [12.3, 10.5, 15.4, 16.1, 19.6, 26.7, 28.3, 26.2, 24.8, 21, 18.5, 15]
            }
        ]
    });
    eg4.render();



    var eg5 = new Easygraphs({
        container: document.getElementById('svg-init-5'),
        width: 880,
        height: 200,
        color: '#282B2E',
        padding: {
            top: 30,
            right: 30,
            left: 55
        },
        tooltip: {
            template: '{{ category }}: {{ value }}',
            widthAuto: true
        },
        yAxis: {
            text: {
                toFixed: 0,
                color: '#D6D6D6'
            },
            title: {
                text: 'Share prices',
                color: '#D6D6D6'
            },
            grid: {
                dasharray: '1%',
                color: '#43484C'
            },
            border: {
                color: '#43484C'
            },
            segment: {
                color: '#43484C',
                width: 5
            }
        },
        xAxis: {
            text: {
                color: '#D6D6D6'
            },
            labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'],
            grid: {
               show: false
            },
            segment: {
                width: 1,
                height: 5,
                color: '#43484C'
            },
            border: {
                color: '#43484C'
            }
        },
        legends: {
            color: '#D6D6D6'
        },
        dotsOptions: {
            rx: 0,
            ry: 0
        },
        data: [
            {
                name: 'EURO / RUB',
                dots: {
                    color: 'rgb(231, 93, 93)'
                },
                line: {
                    width: 2,
                    color: 'rgb(231, 93, 93)',
                    fill: 'rgba(231, 93, 93, 0.3)'
                },
                values: [25, 26, 26, 33, 36, 37, 34, 34, 36, 41, 43, 40, 38, 40, 45, 75, 91]
            },
            {
                name: 'USD / RUB',
                dots: {
                    color: 'rgb(47, 173, 100)'
                },
                line: {
                    width: 2,
                    color: 'rgb(47, 173, 100)',
                    fill: 'rgba(47, 173, 100, 0.3)'
                },
                values: [26, 28, 30, 31, 28, 28, 27, 26, 24, 30, 31, 29, 31, 30, 33, 62, 76]
            }
        ]
    });
    eg5.render();

}