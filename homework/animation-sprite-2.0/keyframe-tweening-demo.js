/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),
        height = canvas.height,
        width = canvas.width,        
        radius = 40,                            //radius of the balls
        middleX = width/2,                      //middle x coordinate of the cradle
        middleY = (height / 3) * 1.5,           //the y coordinate of the cradle
        offsetX = 2,                            //x coordinate offset between the balls when hit
        offsetY = 0.25,                         //y coordinate offset between the balls when hit
        frameLength =10,
        frame = [0 * frameLength, 1 * frameLength, 2 * frameLength,
                 3 * frameLength, 4 * frameLength, 5 * frameLength,
                 6 * frameLength, 7 * frameLength, 8 * frameLength],


        //let's draw the background!
        background = function (renderingContext) {
        
        	//let's draw the back of the wall
            renderingContext.beginPath();
            renderingContext.fillStyle = "rgb(160,160,160)";
            renderingContext.fillRect(0,0, width, height);
            renderingContext.closePath();
            
            //let's draw the stand the Newton's cradle is on
            renderingContext.beginPath();
            renderingContext.fillStyle = "rgb(100,100,100)";
            renderingContext.strokeStyle = "rgb(120,120,120)";
            renderingContext.lineWidth = 7;
            renderingContext.moveTo((width / 16), (height / 4) * 3.2);
            renderingContext.lineTo((width / 16), ((height / 4) * 3.2) + 60);
            renderingContext.lineTo(width - (width / 16), ((height / 4) * 3.2) + 60);
            renderingContext.lineTo(width - (width / 16), (height / 4) * 3.2);
            renderingContext.lineTo((width / 16), (height / 4) * 3.2);
            renderingContext.moveTo((width / 16), (height / 4) * 3.2);
            renderingContext.lineTo((width / 10), (height / 3) * 2);
            renderingContext.lineTo(width - (width / 10), (height / 3) * 2);
            renderingContext.lineTo(width - (width / 16), (height / 4) * 3.2);            
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.closePath();

            //let's draw the back of the frame
            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(50,50,50)";
            renderingContext.lineCap = "round";
            renderingContext.lineWidth = 13;
            renderingContext.moveTo((width / 4), (height / 3) * 2.2);
            renderingContext.lineTo((width / 4), (height / 4) * 1.2);
            renderingContext.moveTo((width / 4), (height / 4) * 1.2);
            renderingContext.lineTo(width - (width / 4), (height / 4) * 1.2);
            renderingContext.moveTo(width - (width / 4), (height / 4) * 1.2);
            renderingContext.lineTo(width - (width / 4), (height / 3) * 2.2);

            renderingContext.moveTo(middleX - (radius * 10.7), (height / 4) * 1.1);
            renderingContext.lineTo(middleX + (radius * 10.7), (height / 4) * 1.1);
            renderingContext.stroke();
        },

		// declare the metallic balls for the Newton's Cradle
        metallicBall = function (renderingContext) {
           
           //declare all the style traits for the metallic balls 
            radialGradient = renderingContext.createRadialGradient(
                    -(radius / 2.5), -(radius / 2.5), 0.5, 0, 0, radius + (radius / 8)),
        	radialGradient.addColorStop(0, "rgba(255,255,255,1)");
		    radialGradient.addColorStop(1, "rgba(0,0,0,1)");
		    renderingContext.fillStyle = radialGradient;
            renderingContext.strokeStyle = "rgb(40,40,40)";
            renderingContext.lineWidth = 1;
            
			//let's draw the balls
            renderingContext.beginPath();
            renderingContext.arc(0, 0, radius, 0, Math.PI * 2);
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.closePath();
        },
        
        
        sprites = [
            //BALL 1
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 10),
                        ty: middleY - radius,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    						
					{
						frame: frame[4],
						tx: middleX - (radius * 5) + (offsetX / 2),
						ty: middleY,
						ease: KeyframeTweener.cubicEaseIn
					},
                    
                    {
                        frame: frame[6],
                        tx: middleX - (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 10),
                        ty: middleY - radius
                    }
                ]
            },
            
            //BALL 2
            {
				draw: metallicBall,
					keyframes: [
						{
							frame: frame[0],
							tx: middleX - (radius * 3) - (offsetX * 4),
							ty: middleY - (offsetY * 4),
							ease: KeyframeTweener.cubicEaseIn
						},
	
						{
							frame: frame[2],
							tx: middleX - (radius * 3),
							ty: middleY,
							ease: KeyframeTweener.cubicEaseOut
						},
						
						{
							frame: frame[4],
							tx: middleX - (radius * 3) + offsetX,
							ty: middleY - offsetY,
							ease: KeyframeTweener.cubicEaseIn
						},
						
						{
							frame: frame[6],
							tx: middleX - (radius * 3),
							ty: middleY,
							ease: KeyframeTweener.cubicEaseOut
						},
	
						{
							frame: frame[8],
							tx:  middleX - (radius * 3) - (offsetX * 4),
							ty: middleY - (offsetY * 4),
							ease: KeyframeTweener.cubicEaseIn
						}
					]
				},
			
			//BALL 3	
            { 
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - radius - (offsetX * 3),
                        ty: middleY - (offsetY * 3),
						ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[2],
                        tx: middleX - radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: frame[4],
                        tx: middleX - radius + (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[6],
                        tx: middleX - radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: frame[8],
                        tx: middleX - radius - (offsetX * 3),
                        ty: middleY - (offsetY * 3),
                        ease: KeyframeTweener.cubicEaseIn
                    }
                    
                ]
            },
            
            //BALL 4
            { 
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + radius - (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[2],
                        tx: middleX + radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: frame[4],
                        tx: middleX + radius + (offsetX * 3),
                        ty: middleY - (offsetY * 3),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[6],
                        tx: middleX + radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    
                    {
                        frame: frame[8],
                        tx: middleX + radius - (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    }
                    
                ]
            },
            
            //BALL 5
            { 
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 3) - offsetX,
                        ty: middleY - offsetY,
						ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[2],
                        tx: middleX + (radius * 3),
                        ty: middleY,
						ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: frame[4],
                        tx: middleX + (radius * 3) + (offsetX * 4),
                        ty: middleY - (offsetY * 4),
						ease: KeyframeTweener.cubicEaseIn
                    },

                    
                    {
                        frame: frame[6],
                        tx: middleX + (radius * 3),
                        ty: middleY,
						ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: frame[8],
                        tx: middleX + (radius * 3) - offsetX,
                        ty: middleY - offsetY,
						ease: KeyframeTweener.cubicEaseIn
                    }
                    
                ]
            },
            
            //BALL 6
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 5) - (offsetX / 2),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[2],
                        tx: middleX + (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 10),
                        ty: middleY - radius,
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: frame[6],
                        tx: middleX + (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: frame[8],
                        tx: middleX + (radius * 5) - (offsetX / 2),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                    
                ]
            }
        ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        background: background,
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
    
}());