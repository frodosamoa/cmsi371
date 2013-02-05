/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),
        //radialGradient = renderingContext.createRadialGradient(20, 20, 1, 15, 15, 80),
        square = function (renderingContext) {
            renderingContext.fillStyle = "blue";
            renderingContext.fillRect(-20, -20, 40, 40);
        },

        circle = function (renderingContext) {
            renderingContext.strokeStyle = "red";
            renderingContext.beginPath();
            renderingContext.arc(0, 0, 50, 0, Math.PI * 2);
            renderingContext.stroke();
        },
        
        metallicBall = function (renderingContext) {
           renderingContext.strokeStyle = "rgb(64,64,64)";
           renderingContext.fillStyle = "rgb(128,128,128)";
           //radialGradient.addColorStop(0, "rgba(255,255,255,0.0)");
		   //radialGradient.addColorStop(1, "rgba(0,0,0,0.6)");
           renderingContext.beginPath();
           renderingContext.arc(0, 0, 40, 0, Math.PI * 2);
           renderingContext.fill();
           renderingContext.stroke();
           renderingContext.closePath();
        },
        
        sprites = [
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: 0,
                        tx: 100,
                        ty: 100,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 30,
                        tx: 260,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 32,
                        tx: 264,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 92,
                        tx: 264,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 94,
                        tx: 260,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 94,
                        tx: 260,
                        ty: 300,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 124,
                        tx: 100,
                        ty: 100
                    }
                ]
            },
            
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: 0,
                        tx: 340,
                        ty: 300
                    },
                    
                    {
                        frame: 30,
                        tx: 340,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 32,
                        tx: 344,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 92,
                        tx: 344,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 94,
                        tx: 340,
                        ty: 300,
                    },

                    {
                        frame: 124,
                        tx: 340,
                        ty: 300
                    }
                    
                ]
            },
            
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: 0,
                        tx: 420,
                        ty: 300
                    },
                    
                    {
                        frame: 30,
                        tx: 420,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 32,
                        tx: 424,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 92,
                        tx: 424,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 94,
                        tx: 420,
                        ty: 300,
                    },
                    
                    {
                        frame: 124,
                        tx: 420,
                        ty: 300
                    }
                    
                ]
            },
            
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: 0,
                        tx: 500,
                        ty: 300,
                    },
                    
                    {
                        frame: 30,
                        tx: 500,
                        ty: 300
                    },
                    
                    {
                        frame: 32,
                        tx: 504,
                        ty: 300,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 62,
                        tx: 660,
                        ty: 100,
                        ease: KeyframeTweener.quadEaseIn
                    },
                    
                    {
                        frame: 92,
                        tx: 504,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 94,
                        tx: 500,
                        ty: 300,
                    },
                    
                    {
                        frame: 124,
                        tx: 500,
                        ty: 300
                    }
                    
                ]
            }
        ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
    
}());