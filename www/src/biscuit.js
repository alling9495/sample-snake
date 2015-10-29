var Biscuit = cc.Sprite.extend({
    winSize: 0,
    ctor: function(snakeParts) {
        /* Call super */        
        this._super(asset.SnakeBiscuit_png);          
        /* Setup winSize */
        this.winSize = cc.view.getDesignResolutionSize();
        /* Set its position */
        this.randPosition(snakeParts);
    },
    randPosition: function(snakeParts) {            
        var step = 20;
        var randNum = function(range) {
            /* Return random number within range */
            return Math.floor(Math.random() * range);        
        };
        
        /* Range of possible positions the biscuit could be in */
        var range = {
            x: (this.winSize.width / step) - 1,
            y: (this.winSize.height / step) - 1
                        
        }        
                             
        /* The possible positions themselves */
        var possible = {
             x: (randNum(range.x) + 1) * step,
             y: (randNum(range.y) + 1) * step
        }                  
                
        var flag = true;
        var hit = false;
        
        /* While we still need to try */
        while (flag) {            
            /* For every part */
            for (var part = 0; part < snakeParts.length; part++) {
                /* Check if the generated coordinates collide with any of the Snake */
                if (snakeParts[part].x == possible.x && snakeParts[part].y == possible.y) {
                    /* If so flag it as a hit */
                    hit = true;
                }
            }
            
            /* If we had a collision */
            if (hit == true) {                
                /* Try again */
                possible.x = randNum(range.x) * step;
                possible.y = randNum(range.y) * step;                
                hit = false;
            } else { /* Otherwise */
                /* We found our new position */
                flag = false;
                this.x = possible.x;
                this.y = possible.y;
            }            
            
        }        
    },    
});