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
function CanoDevicesSidebarNode(params) {
    var self=this,
        $me,
        filterName = "",
        canopy = params.canopyClient,
        dispatcher = params.dispatcher,
        accountDropdownNode,
        $createDevice,
        $all,
        $activated,
        $connected,
        $disconnected,
        $neverConnected,
        $newlyCreated,
        $inactive,
        $active
    ;

    $.extend(this, new CanoNode());

    this.get$ = function() {
        return $me;
    }

    this.onLive = function() {
        /*$username.off('click').on('click', function(event) {
            accountDropdownNode.show();
            event.preventDefault();
            return false;
        });
        accountDropdownNode.onLive();

        // hacky way to determine when to close the window.
        $("html").click(function(e) {
            if (!$(e.target).is($me)) {
                if (accountDropdownNode.isVisible()) {
                    accountDropdownNode.hide();
                }
            }
        });*/
        $createDevice.off('click').on('click', function() {
            if (params.onCreateDeviceLink) {
                params.onCreateDeviceLink();
            }
        });

        var clearAllFilters = function() {
            $connected.prop("checked", false);
            $disconnected.prop("checked", false);
            $neverConnected.prop("checked", false);
            $newlyCreated.prop("checked", false);
            $active.prop("checked", false);
            $inactive.prop("checked", false);
        }

        $all.off('click').on('click', function() {
            clearAllFilters();
            updateFilter();
        });

        $activated.off('click').on('click', function() {
            clearAllFilters();
            $active.prop("checked", true);
            $inactive.prop("checked", true);
            filterName = "Activated";
            updateFilter();
        });

        $newlyCreated.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });

        $connected.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });
        $disconnected.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });
        $neverConnected.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });
        $active.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });
        $inactive.off('click').on('click', function() {
            filterName = "";
            updateFilter();
        });
    }

    function updateFilter() {
        var filter = {};
        var genFilterName = (filterName == "");

        if ($newlyCreated.is(":checked")) {
            if (genFilterName) {
                filterName += "Newly Created &amp; ";
            }
            // TODO: also show connected devices
            filter.newly_created = true;
        }
        if ($connected.is(":checked")) {
            if (genFilterName) {
                filterName += "Connected &amp; ";
            }
            filter.connected = true;
        }
        if ($disconnected.is(":checked")) {
            if (genFilterName) {
                filterName += "Disconnected &amp; ";
            }
            // TODO: also show connected devices
            filter.disconnected = true;
        }
        if ($neverConnected.is(":checked")) {
            if (genFilterName) {
                filterName += "Never Connected &amp; ";
            }
            // TODO: also show connected devices
            filter.never_connected = true;
        }
        if ($active.is(":checked")) {
            if (genFilterName) {
                filterName += "Active &amp; ";
            }
            filter.active = true;
        }
        if ($inactive.is(":checked")) {
            if (genFilterName) {
                filterName += "Inactive &amp; ";
            }
            filter.inactive = true;
        }
        if (genFilterName) {
            if (filterName == "") {
                filterName = "All";
            }
            else {
                filterName = filterName.substring(0, filterName.length-6);
            }
        }
        if (params.onFilterChange)
            params.onFilterChange(filterName, filter);

    }

    /*accountDropdownNode = new CanoAccountDropdown({
        canopyClient: canopy,
        dispatcher: dispatcher
    });

    $username = $("<a href='javascript:void(0);'>" + canopy.account.username() + "</a>");*/
    $createDevice = $("<input type=submit value='CREATE DEVICES'></input>");

    $all = $("<a href='javascript:void(0);'>All (" + canopy.me.devices.length + ")</a>");
    $activated = $("<a href='javascript:void(0);'>Activated (" + canopy.me.devices.Filter({active:true, inactive:true}).length + ")</a>");
    $connected = $("<input type=checkbox>Connected (" + canopy.me.devices.Connected().length + ")</input>");
    $active = $("<input type=checkbox>Active (" + canopy.me.devices.Active().length + ")</input>");
    $inactive = $("<input type=checkbox>Inactive (" + canopy.me.devices.Inactive().length + ")</input>");
    $disconnected = $("<input type=checkbox>Disconnected (" + canopy.me.devices.Disconnected().length + ")</input>");
    $neverConnected = $("<input type=checkbox>Never Connected (" + canopy.me.devices.NeverConnected().length + ")</input>");
    $newlyCreated = $("<input type=checkbox>Newly Created (" + canopy.me.devices.NewlyCreated().length + ")</input>");
    $me = CanopyUtil_Compose(["\
        <div style='z-index: 400; position:fixed; left:16px; width: 234px; top: 90px; bottom:0px; background:#ffffff; color:#000000'>\
            <div style='padding:8px; font-size: 16px;'>\
                <div class='ml'>Filter</div>\
                ", $all, "\
                <br>", $activated, "\
                <br>\
                <br><b>ACTIVITY</b>\
                <br>", $active, "\
                <br>", $inactive, "\
                <br>", $newlyCreated, "\
                \
                <br><br><b>WEBSOCKET STATUS</b>\
                <br>", $connected, "\
                <br>", $disconnected, "\
\
                <!--br><br><b>LABEL</b>\
                <br><input type=checkbox></input>Raspberry Pi (" + canopy.me.devices.Connected().length + ")\
\
                <br><br><b>MODEL</b>\
                <br><input type=checkbox></input><i>Unspecified</i> (" + canopy.me.devices.Connected().length + ")\
\
                <br><br><b>CREATION LOT</b>\
                <br><input type=checkbox>Lot 2: 8/24/2014 (1)</input>\
                <br><input type=checkbox>Lot 1: 8/19/2014 (54)</input-->\
            </div>\
        </div>\
        <div style='padding-bottom:16px; text-align:center; z-index: 500; position:fixed; width: 250px; bottom:0px; background:#ffffff; color:#000000'>\
            ", $createDevice, "<br><br>\
            Powered by <a target=_blank href=http://canopy.link><span class='logo-in-text'>Canopy</div>\
        </div>\
    "]);
}
