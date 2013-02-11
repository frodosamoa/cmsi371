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
        middleY = (height / 3) * 1.7,           //the y coordinate of the cradle
        offsetX = 4,                            //x coordinate offset between the balls when hit
        offsetY = 0.5,                         //y coordinate offset between the balls when hit
        frameLength = 15,
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
            renderingContext.lineWidth = 15;
            renderingContext.moveTo((width / 4), (height / 5));
            renderingContext.lineTo((width / 4), height - (height / 3.5));
            renderingContext.moveTo((width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), (height / 5));
            renderingContext.moveTo(width - (width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), height - (height / 3.5));

            renderingContext.moveTo((width / 6), (height / 7));
            renderingContext.lineTo(width - (width / 6), (height / 7));
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

        ballString = function (renderingContext) {

            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(0,0,0)";
            renderingContext.lineWidth = 2;
            renderingContext.moveTo(0, 0);
            renderingContext.lineTo(0, middleY - (height / 5));
            renderingContext.stroke();
            renderingContext.closePath();

        },

        // this function will generate the part of the frame of the Newton's
        // cradle that is "in front" of the metallic balls
        cradleFrame = function (renderingContext) {
            
            //let's draw the two frames
            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(50,50,50)";
            renderingContext.lineCap = "round";
            renderingContext.lineWidth = 15;
            renderingContext.moveTo((width / 6), (height / 7));
            renderingContext.lineTo((width / 6), height - (height / 4));
            renderingContext.moveTo(width - (width / 6), (height / 7));
            renderingContext.lineTo(width - (width / 6), height - (height / 4));
            renderingContext.stroke();
            renderingContext.closePath();
        },
        
        
        sprites = [

            // ball 2 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 3 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - radius,
                        ty: (width / 7) + 15,
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - radius,
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - radius,
                        ty: (width / 7) + 15,
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - radius,
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - radius,
                        ty: (width / 7) + 15,
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 4 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + radius,
                        ty: (width / 7) + 15,
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + radius,
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + radius,
                        ty: (width / 7) + 15,
                        rotate: -2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + radius,
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + radius,
                        ty: (width / 7) + 15,
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 5 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: -3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + (radius * 3),
                        ty: (width / 7) + 15,
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },





            // ball 1
            {
                draw: metallicBall,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 8),
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
                        tx: middleX - (radius * 8),
                        ty: middleY - radius
                    }
                ]
            },
            
            // ball 2
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
			
			// ball 3	
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
            
            // ball 4
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
            
            // ball 5
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
            
            // ball 6
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
                        tx: middleX + (radius * 8),
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
            },

            // this is the cradle frame!
            {
                draw: cradleFrame,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: 0,
                        ty: 0
                    },

                    {
                        frame: frame[8],
                        tx: 0,
                        ty: 0
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