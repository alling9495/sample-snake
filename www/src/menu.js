var MenuScene = cc.Scene.extend({
    titleSprite: {},
    subTitleSprite: {},
    onEnter: function() {
        this._super();
        /* Get window size */
        var winSize = cc.view.getDesignResolutionSize();
        
        /* Create title */
        this.titleSprite = cc.LabelTTF.create("Snake.", "Arial", 50);
        this.titleSprite.x = winSize.width / 2;
        this.titleSprite.y = winSize.height / 2;
        this.addChild(this.titleSprite);
        
        /* Create subTitle */
        this.subTitleSprite = cc.LabelTTF.create("Click anywhere to play", "Arial", 20);
        this.subTitleSprite.x = winSize.width / 2;
        this.subTitleSprite.y = winSize.height / 2 - 80;
        this.addChild(this.subTitleSprite);
        
        /* Add touch listener to start game */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) {                
                cc.director.runScene(new GameScene());          
            },
        }, this);
        
    },    
});