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
function CanoAppsPageNode(params) {
    var self=this,
        $me,
        canopy = params.canopyClient,
        dispatcher = params.dispatcher,
        topbarSubmenuNode,
        sidebarNode,
        appsListNode,
        mainNode
    ;

    $.extend(this, new CanoNode());

    this.get$ = function() {
        return $me;
    }

    this.onLive = function() {
        sidebarNode.onLive();
        topbarSubmenuNode.onLive();
        mainNode.onLive();
        
        this.refresh();
    }

    this.refresh = function() {
        mainNode.select("apps");
    }

    sidebarNode = new CanoAppsSidebarNode({
        canopyClient : canopy,
        dispatcher: dispatcher
    });

    topbarSubmenuNode = new CanoTopbarSubmenuNode({
        canopyClient: canopy,
        items: [ {
            content: "Credentials",
            value: "apps"
        }],
        onSelect: function(val) {
            mainNode.select(val);
        }
    })

    appsListNode = new CanoAppsListNode({
        canopyClient: canopy
    });


    mainNode = new CanoSwitcherNode({
        children: [ {
            name: "apps",
            content: appsListNode
        } ],
        selectedIdx: 0
    });

    $me = CanopyUtil_Compose(["<div>\
        ", topbarSubmenuNode, "\
        ", sidebarNode, "\
        &nbsp; <div style='padding:16px; margin-left: 260px; margin-top:18px'>", mainNode, "</div>\
    </div>"]);
}
