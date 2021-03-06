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
function DizonDemoPageNode(params) {
    var self=this,
        $me,
        canopy = params.canopyClient,
        smallHumPlotNode,
        smallTempPlotNode,
        bigHumPlotNode,
        bigTempPlotNode,
        device = null
    ;
    /*for (var i = 0; i < canopy.me.Devices().length; i++) {
        if (canopy.me.Devices()[i].Vars().Var("fan_speed")) {
            device = canopy.me.Devices()[i];
        }
    }*/

    device = canopy.me.Devices()['e6968460-f010-48ef-8e69-835543843b32'];
    $.extend(this, new CanoNode());

    this.get$ = function() {
        return $me;
    }
    var speed;

    function updateImage(event, ui) {
        var oldSpeed = speed;
        var val = ui.value;
        if (val == 0 || val == 1) {
            $("#slider_title").html("OFF");
            $("#fan_image").attr("src", "images/dyson_fan_off_cropped.jpg");
            speed = 0;
        }
        else if (val == 2) {
            $("#slider_title").html("LOW");
            $("#fan_image").attr("src", "images/dyson_fan_low_cropped.jpg");
            speed = 1;
        }
        else if (val == 3) {
            $("#slider_title").html("MED");
            $("#fan_image").attr("src", "images/dyson_fan_med_cropped.jpg");
            speed = 2;
        }
        else if (val == 4 || val == 5) {
            $("#slider_title").html("MAX");
            $("#fan_image").attr("src", "images/dyson_fan_high_cropped.jpg");
            speed = 3;
        }
        $("#instructions").hide();

        if (speed != oldSpeed) {
            var cloudvar = device.Vars().Var("fan_speed");
            cloudvar.Value(speed);
            cloudvar.Save({ });
        }
    }

    var showTemp = false;
    var showHumidity = false;

    function showScreen(showTempPlot, showHumidityPlot) {

        function hideAll() {
            smallTempPlotNode.get$().hide();
            smallHumPlotNode.get$().hide();
            bigTempPlotNode.get$().hide();
            bigHumPlotNode.get$().hide();
            $("#main_screen").hide();
            $("#plot_screen").hide();
        }

        $("#thermometer").toggleClass("demo-icon-selected", showTempPlot);
        $("#humidity").toggleClass("demo-icon-selected", showHumidityPlot);

        if (showTempPlot && showHumidityPlot) {
            device.Vars().Var("temperature").FetchHistoricData({
                onSuccess: function(data) {
                    smallTempPlotNode.setTimeseriesData(data.samples);
                    device.Vars().Var("humidity").FetchHistoricData({
                        onSuccess: function(hdata) {
                            smallHumPlotNode.setTimeseriesData(hdata.samples);
                            hideAll();
                            smallTempPlotNode.get$().show();
                            smallHumPlotNode.get$().show();
                            $("#plot_screen").show();
                        }
                    });
                }
            });
        }
        else if (showTempPlot) {
            device.Vars().Var("temperature").FetchHistoricData({
                onSuccess: function(data) {
                    bigTempPlotNode.setTimeseriesData(data.samples);
                    hideAll();
                    bigTempPlotNode.get$().show();
                    $("#plot_screen").show();
                }
            });
        }
        else if (showHumidityPlot) {
            device.Vars().Var("humidity").FetchHistoricData({
                onSuccess: function(data) {
                    bigHumPlotNode.setTimeseriesData(data.samples);
                    hideAll();
                    bigHumPlotNode.get$().show();
                    $("#plot_screen").show();
                }
            });
        }
        else {
            hideAll();
            $("#main_screen").show();
        }
    }

    this.onLive = function() {
        $('body').css('background', '#ffffff');
        $("#slider").slider({
            range: "min",
            max: 5,
            value: 0,
            change: updateImage,
            slide: updateImage
        });
        var screen = "main";
        $("#thermometer").off('click').on("click", function(){
            showTemp = !showTemp;
            showScreen(showTemp, showHumidity);
        });
        $("#humidity").off('click').on("click", function(){
            showHumidity = !showHumidity;
            showScreen(showTemp, showHumidity);
        });
        $("#share").off('click').on("click", function(){
            new CanoSharingPopupNode({
                canopyClient: canopy, 
                device: device
            }).appendTo($("#main"));
        });
        $("#settings").off('click').on("click", function(){
            new CanoDeviceSettingsPopupNode({
                canopyClient: canopy, 
                device: device
            }).appendTo($("#main"));
        });
        $("body").on("touchstart", function(ev) {
            $("#slider").hide();
        });
        $("#fan_image").on("touchstart touchmove", function(ev) {
            ev.preventDefault();
            var value = ((ev.originalEvent.pageX - 255) / (800 - 255.0)) * 5;
            if (value < 0)
                value = 0;
            if (value > 5)
                value = 5;
            value = Math.floor(value);
            updateImage(null, {value: value});
        });
        $("#instructions").on("touchstart touchmove", function(ev) {
            ev.preventDefault();
            var value = ((ev.originalEvent.pageX - 255.) / (800. - 255.0)) * 5;
            if (value < 0)
                value = 0;
            if (value > 5)
                value = 5;
            value = Math.floor(value);
            updateImage(null, {value: value});
        });

        smallTempPlotNode.appendTo($("#plotspot"));
        smallHumPlotNode.appendTo($("#plotspot"));
        bigTempPlotNode.appendTo($("#plotspot"));
        bigHumPlotNode.appendTo($("#plotspot"));

        if (device.IsConnected()) {
            $("#connected").show();
            $("#disconnected").hide();
        }
        else {
            $("#connected").hide();
            $("#disconnected").show();
        }
    }

    if (!device) {
        $me = $("<div>No smart fan device</div>");
        return;
    }
    var temperature = (device.Vars().Var("temperature").Value() !== null) ? Math.round(100*device.Vars().Var("temperature").Value())/100 : '-';
    var humidity = (device.Vars().Var("humidity").Value() !== null) ? Math.round(100*device.Vars().Var("humidity").Value())/100 : '-';
    $me = $("<div class=center_channel style='padding-left:32px;'>\
        <br>\
        <br>\
        <br>\
        <!--span style='color:#a0a0a0;font-size:70px; font-weight:200'>dyzon</span-->\
        <div id=dyzon style='display:inline-block; color:#a0a0a0;font-size:70px; font-weight:200'>dyzon</div>\
        <span style='color:#000000;font-size:70px; font-weight:200'>AR06</span>\
        <div id='settings' style='cursor: pointer; white-space:nowrap; float:right; solid #a0a0a0;line-height:1; text-align:right; padding-right:32px;'><br><span style='color:#808080;font-size:40px; font-weight:300'>" + device.FriendlyName() + "</span><span style='font-size:30px'><br>" + "Greg's Office" + "</span></div>\
        <table cellspacing=0 cellpadding=0 width=100%><tr><td width=1 align=center valign=top style='padding-left:24px; font-size:20px;line-height:1; border-right:2px solid #d8d8d8; padding-right:24px;'>\
            <div id=connected>\
                <br><br><img src=http://b.dryicons.com/images/icon_sets/pixelistica_blue_icons/png/64x64/approve.png>\
                <br>\
                Connected\
            </div>\
            <div id=disconnected style='display:none'>\
                <br><img src=images/delete.png>\
                <br>\
                Disconnected\
            </div>\
            <br><img id='thermometer' class=demo-icon src=http://b.dryicons.com/images/icon_sets/pixelistica_blue_icons/png/64x64/thermometer.png>\
            <br>\
            " + temperature + "&deg;C\
            <br><br><img id='humidity' class=demo-icon src=http://b.dryicons.com/images/icon_sets/pixelistica_blue_icons/png/64x64/drop.png>\
            <br>\
            " + humidity + "%\
            <br><br><img id=share class=demo-icon src=http://b.dryicons.com/images/icon_sets/pixelistica_blue_icons/png/64x64/add_contact.png>\
            <br>\
            Share\
        </td><td valign=top>\
            <div id='main_screen' style='padding-left:48px'>\
                <img id='fan_image' src=images/dyson_fan_off_cropped.jpg width=85%>\
                <div style='position:relative'>\
                    <div id='instructions' style='display:inline-block; position:absolute; top:-410px; left:40px;'>\
                        <div style='border-bottom: 1px dashed #b0b0b0; border-top:1px dashed #b0b0b0; font-size:16px;display:inline-block; text-align:center;width:500px; padding-left:80px; height:140px; padding-top:110px'>\
                        &larr; click or drag to adjust fan speed &rarr;</div>\
                    </div>\
                    <div style='display:inline-block; position:absolute; top:-410px; left:00px;'>\
                        <div id='slider' style='font-size:400px;display:inline-block; width:680px'></div>\
                    </div>\
                    <div style='display:inline-block; position:absolute; top:-140px; left:180px;'>\
                        <div style='display:inline-block; color: #a0a0a0; font-weight:200; margin-left:40px; font-size:70px' id='slider_title'>OFF</div>\
                    </div>\
                </div>\
            </div>\
            <div id='plot_screen' style='display:none'>\
                <div style='position:relative'>\
                    <br><div id=plotspot style='padding:4px;'>\
                    </div>\
                </div>\
            </div>\
        </table>\
    </div><br><br><br><br>");

    smallTempPlotNode = new CanoPlotNode({
        title: "hi",
        vAxisFormat: "#°C",
        width: 800,
        height: 220
    });
    smallHumPlotNode = new CanoPlotNode({
        title: "hi",
        vAxisFormat: "#.#%",
        width: 800,
        height: 220
    });
    bigTempPlotNode = new CanoPlotNode({
        title: "hi",
        vAxisFormat: "#°C",
        width: 800,
        height: 440
    });
    bigHumPlotNode = new CanoPlotNode({
        title: "hi",
        vAxisFormat: "#.#%",
        width: 800,
        height: 440
    });
}
