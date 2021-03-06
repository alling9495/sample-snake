var SnakePart = cc.Sprite.extend({
    prevX: this.x,
    prevY: this.y,
    ctor: function(sprite) {
        /* Call super constructor with Snake body directory */
        this._super(sprite);
    },
    move: function(posX, posY) {
        /* Set previous location */
        this.prevX = this.x;
        this.prevY = this.y;
        /* Update current location */
        this.x = posX;        
        this.y = posY;
    },
});

var SnakeLayer = cc.Layer.extend({
    snakeParts: null,
    interval: 0.15, /* 1 second */
    counter: this.interval,
    curDir: 0,
    nextDir: 0,
    biscuit: null,
    ctor: function () {
        /* Acquire window size */
        var winSize = cc.view.getDesignResolutionSize();
        /* Call super constructor */
        this._super();
        
        /* Initialize snakeParts array */
        this.snakeParts = [];    
        /* Create snake head */
        var snakeHead = new SnakePart(asset.SnakeHead_png);
        //this.snakeHead = new SnakePart(asset.SnakeHead_png);
    
         /* Set snake head coordinates */
        snakeHead.x = winSize.width / 2;
        snakeHead.y = winSize.height / 2;
                
        /* Add as child of layer */
        this.addChild(snakeHead);
        this.snakeParts.push(snakeHead);
            
        /* Register keyboard listener */
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                var targ = event.getCurrentTarget();   
                /* Direction enums */
                var up = 1, down = -1, left = -2, right = 2;
                /* Object with keys being keycodes mapped to a direction */            
                var keyMap = {};
                keyMap[87] = up; // w
                keyMap[83] = down; // s
                keyMap[65] = left; // a
                keyMap[68] = right; // d
                
                var debugKeyMap = {};
                debugKeyMap[49] = 0.15;
                debugKeyMap[50] = 0.10;
                debugKeyMap[51] = 0.05;
                debugKeyMap[52] = 0.03;
                debugKeyMap[53] = 0.01;
                                
                /* Processes key strokes */
                if (keyMap[keyCode] !== undefined) {
                    targ.nextDir = keyMap[keyCode];
                }                           
                
                if (debugKeyMap[keyCode] !== undefined) {
                    targ.interval = debugKeyMap[keyCode];
                }
            }            
        }, this);
        
        /* Register touch listener */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function() {
                /* Allows onTouchMoved to be used if you return true */
                return true;
            },
            onTouchMoved: function(touch, event) {
                var targ = event.getCurrentTarget();
                var up = 1, down = -1, left = -2, right = 2;
            
                /* Get the movement distance */ 
                var delta = touch.getDelta();
                
                /* If a touch moved a distance */
                if (delta.x !== 0 && delta.y !== 0) {
                    if (Math.abs(delta.x) > Math.abs(delta.y)) {                    
                        /* Determine the direction via sign */
                        targ.nextDir = Math.sign(delta.x) * right;                        
                    } else if (Math.abs(delta.x) < Math.abs(delta.y)) {
                        /* Determine the direction via sign */
                        targ.nextDir = Math.sign(delta.y) * up;                        
                    }                            
                }            
                /* Otherwise, if the touch moved no distance do nothing */
            }                    
        }, this);
        
        /* Add in biscuit */
        this.updateBiscuit();
        /* Initialize difficulty */
        this.updateDifficulty();
        
        /* Schedule update */
        this.scheduleUpdate();
    },    
    moveSnake: function() {
        /* Movement enums and constants */
        var up = 1, down = -1, left = -2, right = 2,
            step = 20;
        var snakeHead = this.snakeParts[0];
        
        /* Map of direction to appropriate movement code */
        var dirMap = {};
        dirMap[up] = function() {snakeHead.move(snakeHead.x, snakeHead.y + step);};
        dirMap[down] = function() {snakeHead.move(snakeHead.x, snakeHead.y - step);};
        dirMap[left] = function() {snakeHead.move(snakeHead.x - step, snakeHead.y);};
        dirMap[right] = function() {snakeHead.move(snakeHead.x + step, snakeHead.y);};
                
        
        /* Change current direction if it isn't the opposite direction or there is only the Snake head */
        if ((this.nextDir * -1) != this.curDir || this.snakeParts.length == 1)  {            
            this.curDir = this.nextDir;
        }
        
        /* Move head in current direction */    
        if (dirMap[this.curDir] !== undefined) {
            dirMap[this.curDir]();    
        }
        
        /* Move head in current direction */
        /*if (dirMap[dir] !== undefined) {
            dirMap[dir]();
        }*/
        
        /* Save previous position of head for next part */
        var prevX = snakeHead.prevX;
        var prevY = snakeHead.prevY;
        
        /* Move rest of snake */
        for (var part = 1; part < this.snakeParts.length; part++) {
            var curPart = this.snakeParts[part];
            
            /* Move current part, pull out its previous position for next iteration */
            curPart.move(prevX, prevY);
            prevX = curPart.prevX;
            prevY = curPart.prevY;
        }
    },
    addPart: function() {
        var newPart = new SnakePart(asset.SnakeBody_png),
        size = this.snakeParts.length,        
        tail = this.snakeParts[size - 1];
                
        /* Initially position at tail */
        newPart.x = tail.x;
        newPart.y = tail.y;
        
        /* Add as child of layer */
        this.addChild(newPart);
        this.snakeParts.push(newPart);
    },
    updateBiscuit: function() {
        /* If a biscuit exists */
        if (this.biscuit) {
            /* Reposition it */
            this.biscuit.randPosition(this.snakeParts);        
        /* If it does not */
        } else {
            /* Create a new biscuit */
            this.biscuit = new Biscuit(this.snakeParts);
            /* Add it as child */
            this.addChild(this.biscuit);
        }
    },
    checkCollision: function() {
        var winSize = cc.view.getDesignResolutionSize();
        var head = this.snakeParts[0];
        var body = this.snakeParts;
        
        /* Check collision with border */
        if (head.x < 0) {
            head.x = winSize.width;
        } else if (head.x > winSize.width) {
            head.x = 0;
        }
        
        if (head.y < 0) {
            head.y = winSize.height;
        } else if (head.y > winSize.height) {
            head.y = 0;
        } 
        
        /* Check collision with self */
        for (var part = 1; part < body.length; part++) {
            if (head.x == body[part].x && head.y == body[part].y) {
                /* Run GameOver Scene */
                //this.snakeParts = null;
                cc.director.runScene(new GameOverScene(this.parent.score_layer.score));
            }
        }    
        
        /* Check collision with biscuit */
        if (head.x == this.biscuit.x && head.y == this.biscuit.y) {
            /* Increase score */
            this.parent.score_layer.scoreIncrease();
            /* Update biscuit */
            this.updateBiscuit();
            /* Increase length of snake */
            this.addPart();
            /* Increases difficulty if at appropriate score */
            this.updateDifficulty(this.parent.score_layer.score);
        }
                
    },
    updateDifficulty: function(curScore) {
        var scoreToDiff = {};
        
        /* Define each level of difficulty in terms of score to interval */
        scoreToDiff[0] = 0.15;
        scoreToDiff[5] = 0.10;
        scoreToDiff[15] = 0.05;
        scoreToDiff[25] = 0.03;
        scoreToDiff[35] = 0.01;
        
        /* Update interval */
        if (scoreToDiff[curScore] !== undefined) {
            this.interval = scoreToDiff[curScore];
        }        
    },
	update: function(dt) {
        /* Movement enum */
        var up = 1;        
        /* Only move if interval has elasped */
        if (this.counter < this.interval) {
            this.counter += dt;   
        } else {
            this.counter = 0;
            /* Move snake */
            this.moveSnake();                        
            /* Check if head has collided the border, body or the biscuit */
            this.checkCollision();            
        }
	}    
});

var GameScene = cc.Scene.extend({
    snake_layer: {},
    score_layer: {},
    onEnter:function () {
        this._super();
        this.score_layer = new ScoreLayer();
        this.snake_layer = new SnakeLayer();
        
        this.addChild(this.score_layer, 1);
        this.addChild(this.snake_layer, 0);        
    }
});