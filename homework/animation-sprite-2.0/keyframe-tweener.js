/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
var KeyframeTweener = {
    // The module comes with a library of common easing functions.
    linear: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * percentComplete + start;
    },
    
    quadEaseIn: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration; 
        return distance * percentComplete * percentComplete + start;
    },

    quadEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return -distance * percentComplete * (percentComplete - 2) + start;
    },

    quadEaseInAndOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / (duration / 2);
        return (percentComplete < 1) ?
                (distance / 2) * percentComplete * percentComplete + start :
                (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
    }, 
    
    cubicEaseIn: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
	    return distance * Math.pow(percentComplete, 3) + start;
    },

	cubicEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        percentComplete--;
	    return distance * (Math.pow(percentComplete, 3) + 1) + start;
    },

    sineEaseIn: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return -distance * Math.cos(percentComplete * (Math.PI/2)) + distance + start;
    },

    sineEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * Math.sin(percentComplete * (Math.PI/2)) + start;
    },
    
    
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - sprites: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          it to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)
    //
    // Initialization primarily calls setInterval on a custom-built
    // frame-drawing (and updating) function.
    initialize: function (settings) {

        // We need to keep track of the current frame.  
        var currentFrame = 0,

            // Avoid having to go through settings to get to the
            // rendering context and sprites.
            renderingContext = settings.renderingContext,
            background = settings.background,
            width = settings.width,
            height = settings.height,
            sprites = settings.sprites;

        setInterval(function () {
            // Some reusable loop variables.
            var i,
                j,
                k,
                maxI,
                maxJ,
                ease,
                startKeyframe,
                endKeyframe,
                txStart,
                txDistance,
                tyStart,
                tyDistance,
                sxStart,
                sxDistance,
                syStart,
                syDistance,
                rotateStart,
                rotateDistance,
                currentTweenFrame,
                duration,
                whichDraw;

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);
            background(renderingContext);


            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // We look for keyframe pairs such that the current
                    // frame is between their frame numbers.

                    if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                            (currentFrame <= sprites[i].keyframes[j + 1].frame)) {
                        // Point to the start and end keyframes.
                        startKeyframe = sprites[i].keyframes[j];
                        endKeyframe = sprites[i].keyframes[j + 1];

                        // Save the rendering context state.
                        renderingContext.save();
                        
                        // Set up our start and distance values, using defaults
                        // if necessary.
                        ease = startKeyframe.ease || KeyframeTweener.linear;
                        txStart = startKeyframe.tx || 0;
                        txDistance = (endKeyframe.tx || 0) - txStart;
                        tyStart = startKeyframe.ty || 0;
                        tyDistance = (endKeyframe.ty || 0) - tyStart;
                        sxStart = startKeyframe.sx || 1;
                        sxDistance = (endKeyframe.sx || 1) - sxStart;
                        syStart = startKeyframe.sy || 1;
                        syDistance = (endKeyframe.sy || 1) - syStart;
                        rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180;
                        rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;
                        currentTweenFrame = currentFrame - startKeyframe.frame;
                        duration = endKeyframe.frame - startKeyframe.frame + 1;
						
                        // Build our transform according to where we should be.
                        renderingContext.translate(
                            ease(currentTweenFrame, txStart, txDistance, duration),
                            ease(currentTweenFrame, tyStart, tyDistance, duration)
                        );
                        renderingContext.scale(
                            ease(currentTweenFrame, sxStart, sxDistance, duration),
                            ease(currentTweenFrame, syStart, syDistance, duration)
                        );
                        renderingContext.rotate(
                            ease(currentTweenFrame, rotateStart, rotateDistance, duration)
                        );
                          
                        // Draw the sprite. There is one test condition to see if the draw property is
                        // an array (basically if it is larger than 1). If it is, we use the keyframes's
                        // frame property to choose when the metallic balls should change to being "shiny".
                        //
                        // A big thank you to Haley Young for helping me with understanding this!

                        // JD: Well, this is *a* form of internal animation, but not exactly what
                        //     I had in mind.  That hardcoding of keyframes[1] and keyframes[3] is
                        //     particularly bothersome...if those have special meaning, then there
                        //     are better ways of capturing that than a hardcoded array index.
                        //
                        //     Refer back to that Pacman cut scene (among others) to see what I
                        //     had in mind by "internal animation."
                        if (sprites[i].draw.length > 1) {
                            whichDraw = (currentFrame === sprites[i].keyframes[1].frame || 
                                currentFrame === sprites[i].keyframes[3].frame) ? 1 : 0;
                            sprites[i].draw[whichDraw](renderingContext);
                        } else {
                            sprites[i].draw[0](renderingContext);
                        }

                        // Clean up.
                        renderingContext.restore();

                    }
                }
            }

            // Move to the next frame.
            currentFrame += 1;
            if (currentFrame > sprites[0].keyframes[4].frame) { 
                currentFrame = 0;
            }
        }, 1000 / (settings.frameRate || 60));
    }
};
