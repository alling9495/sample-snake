var GameOverScene = cc.Scene.extend({
    finalScore: 0,
    labelGameOver: {},
    labelScore: {},
    labelPrompt: {},
    ctor: function(score) {
        this._super();
        this.finalScore = score;
        
        /* On touch, run menu */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                cc.director.runScene(new MenuScene());
            }
        }, this);
        
    },
    onEnter: function() {
        this._super();
        /* window size */
        var winSize = cc.view.getDesignResolutionSize();
        
        /* GameOver scene labels */
        this.labelGameOver = new cc.LabelTTF("Game Over", "Arial", 60);    
        this.labelGameOver.x = winSize.width * 0.50;
        this.labelGameOver.y = winSize.height * 0.50;
        this.addChild(this.labelGameOver);
        
        /* Score label */        
        this.labelScore = new cc.LabelTTF("Score: " + this.finalScore, "Arial", 30);
        this.labelScore.x = winSize.width * 0.50;
        this.labelScore.y = winSize.height * 0.43;
        this.addChild(this.labelScore);
        
        /* Score prompt to try again */
        this.labelPrompt = new cc.LabelTTF("Click or Tap To Try Again");
        this.labelPrompt.x = winSize.width * 0.50;
        this.labelPrompt.y = winSize.height * 0.39;
        this.addChild(this.labelPrompt);
        
    },
});