function CanowebDispatcher(canopy) {
    var self=this;
    self.currentPageNode = null;

    this.switchTo = function(nextPageNode) {
        if (self.currentPageNode != null) {
            self.currentPageNode.get$().fadeOut('fast', function() {
                self.currentPageNode = nextPageNode;
                self.currentPageNode.render($("#main"));
                self.currentPageNode.get$().fadeIn('fast');
            });
        }
        else {
            self.currentPageNode = nextPageNode;
            self.currentPageNode.render($("#main"));
            self.currentPageNode.get$().show();
        }
    }

    this.showPage = function(pageName) {
        if (pageName == "login") {
            this.switchTo(new CanoLoginPageNode(canopy, self));
        }
        else if (pageName == "main") {
            this.switchTo(new CanoMainPageNode(canopy, self));
        }
    }
}
