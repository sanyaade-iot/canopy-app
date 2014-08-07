/*
 * Copyright 2014 Gregory Prisament
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function CanoPlotNode(origParams)
{
    var self=this,
        $me,
        params,
        dataArray = []
    ;

    $.extend(this, new CanoNode());

    params = $.extend({}, {
    }, origParams);

    this.get$ = function() {
        return $me;
    }

    this.onLive = function() {
    }

    /* Expects array of objects [t: <RFC3339 Time>,  v: <float>] */
    this.setTimeseriesData = function(samples) {
        dataArray.length = 0;
        dataArray.push([
            "Time",
            "Value"
        ]);
        for (i = 1; i < samples.length; i++) {
            t0 = Date.parse(samples[i-1].t);
            t1 = Date.parse(samples[i].t);
            console.log(t0);
            console.log(t1);
            if (t1 - t0 > 2000000)
            {
                console.log("huh?");
                dataArray.push([
                    new Date(t0),
                    null
                ]);
                dataArray.push([
                    new Date(t1),
                    null
                ]);
            }
            else
            {
                if (params.vAxisFormat == "#%") {
                    console.log(new Date(t1));
                    dataArray.push([
                        new Date(t1),
                        samples[i].v / 100.0
                    ]);
                }
                else {
                    console.log(new Date(t1));
                    dataArray.push([
                        new Date(t1),
                        /*samples[i].v*1.8 + 32*/
                        samples[i].v
                    ]);
                }
            }
        }
        this.drawChart();
    }

    this.drawChart = function() {
        var data = google.visualization.arrayToDataTable(dataArray);

        var options = {
            title: params.title,
            legend: { position: 'none' },
            fontName : "Source Sans Pro",
            fontSize : 12,
            hAxis: {baselineColor: "#d8d8d8", textStyle:{color:"black"}, format: "h:mm a", gridlines: {color: 'transparent'}},
            vAxis: {baselineColor: "#000000", textStyle:{color:"black"}, format: params.vAxisFormat, gridlines: {color: 'transparent'}},
            chartArea:{left:50,top:10,width:840,height:420},
            height: 440,
            width: 800,
            backgroundColor: 'transparent',
        };

        var chart = new google.visualization.AreaChart($me[0]);
        chart.draw(data, options);
    }

    $me = $("<div style='color:#000000'>");

    /* Load default data for testing */
    this.setTimeseriesData([
        { t: "2014-08-06T08:01:47Z", v: 0},
        { t: "2014-08-06T08:11:47Z", v: 5},
        { t: "2014-08-06T08:21:47Z", v: 8},
        { t: "2014-08-06T08:31:47Z", v: -5},
        { t: "2014-08-06T08:41:47Z", v: 3.4},
        { t: "2014-08-06T08:51:47Z", v: 9.4},
        { t: "2014-08-06T09:01:47Z", v: 4.2},
        { t: "2014-08-06T09:11:47Z", v: -1},
        { t: "2014-08-06T09:21:47Z", v: 1.5},
    ]);
}


google.load("visualization", "1", {packages:["corechart"]});
