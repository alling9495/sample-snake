var ScoreLayer = cc.Layer.extend({
    score: 0,
    labelScore: 0,
    ctor: function() {
        /* Call super constructor */
        this._super();
        /* Initialize */
        this.init();
    },
    init: function() {
        /* Create score text */
        this.labelScore = cc.LabelTTF.create("Score: 0");
        this.labelScore.setColor(cc.color(255, 255, 255, 255));
        this.labelScore.setPosition(cc.p(240, 700));
        this.addChild(this.labelScore);
        
    },
    scoreIncrease: function() {
        /* Increase score, update text */
        this.score += 1;
        this.labelScore.setString("Score: " + this.score);
    }
});