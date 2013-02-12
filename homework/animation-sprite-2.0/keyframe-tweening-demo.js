/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),
        height = canvas.height,                 // Canvas height
        width = canvas.width,                   // Canvas width
        radius = 40,                            // Radius of the balls
        middleX = width/2,                      // Middle x coordinate of the balls on the cradle
        middleY = (height / 3) * 1.7,           // y coordinate of all of the balls on the cradle
        offsetX = 4,                            // x coordinate offset between the balls when hit
        offsetY = 0.5,                          // y coordinate offset between the balls when hit
        frameLength = 20,                       // The amount of frames between each major event 

        // There are 4 "major events" in the animation
        // 1. When the left most ball is at its apex of travel          //keyframeArray[0]
        // 2. When the left most ball hits the second left most ball    //keyframeArray[2]
        // 3. When the right most ball hits its apex of travel          //keyframeArray[4]
        // 4. When the right most ball hits the second right most ball  //keyframeArray[6]
        //                                                                    ^
        // This sequence repeats itself over and over.                        |
        // The 4 major events correspond to certain to these ------------------

        keyframeArray = [0 * frameLength, 1 * frameLength, 2 * frameLength,        
                         3 * frameLength, 4 * frameLength, 5 * frameLength,
                         6 * frameLength, 7 * frameLength, 8 * frameLength],

        cradleFrameLineWidth = 15,
        ballStringLineWidth = 2,
        cradleBaseWidth = width - (60 * 2),

        // Let's draw the background!
        background = function (renderingContext) {
        
        	// Let's draw the back of the wall
            renderingContext.beginPath();
            renderingContext.fillStyle = "rgb(160,160,160)";
            renderingContext.fillRect(0,0, width, height);
            renderingContext.closePath();
            
            // Let's draw the stand the Newton's cradle is on
            // All of the widths are reliant on the canvas width and height
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
            renderingContext.lineTo((width / 7), (height / 3) * 2);
            renderingContext.lineTo(width - (width / 7), (height / 3) * 2);
            renderingContext.lineTo(width - (width / 16), (height / 4) * 3.2);            
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.closePath();

            // Let's draw the back of the frame
            // All of the widths are reliant on the canvas width and height
            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(50,50,50)";
            renderingContext.lineCap = "round";
            renderingContext.lineWidth = 15;
            renderingContext.moveTo((width / 4), (height / 5));
            renderingContext.lineTo((width / 4), height - (height / 3.2));
            renderingContext.moveTo((width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), (height / 5));
            renderingContext.moveTo(width - (width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), height - (height / 3.2));
            renderingContext.moveTo((width / 5), (height / 7));
            renderingContext.lineTo(width - (width / 5), (height / 7));
            renderingContext.stroke();
        },

		// Declare the metallic ball function
        metallicBall = function (renderingContext) {
           
           // Declare all the style traits for the metallic balls 
            radialGradient = renderingContext.createRadialGradient(
                    -(radius / 2.5), -(radius / 2.5), 0.5, 0, 0, radius + (radius / 8)),
        	radialGradient.addColorStop(0, "rgba(255,255,255,1)");
		    radialGradient.addColorStop(1, "rgba(0,0,0,1)");
		    renderingContext.fillStyle = radialGradient;
            renderingContext.strokeStyle = "rgb(40,40,40)";
            renderingContext.lineWidth = 1;
            
			// Let's draw the balls
            renderingContext.beginPath();
            renderingContext.arc(0, 0, radius, 0, Math.PI * 2);
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.closePath();
        },

        // Declare the shiny metallic ball function
        metallicBallShiny = function (renderingContext) {
           
           // Declare all the style traits for the metallic balls 
            radialGradient = renderingContext.createRadialGradient(
                    -(radius / 2.5), -(radius / 2.5), 0.5, 0, 0, radius + (radius / 8)),
            radialGradient.addColorStop(0, "rgba(100,100,100,1)");
            radialGradient.addColorStop(1, "rgba(0,0,0,1)");
            renderingContext.fillStyle = radialGradient;
            renderingContext.strokeStyle = "rgb(40,40,40)";
            renderingContext.lineWidth = 1;
            
            // Let's draw the balls
            renderingContext.beginPath();
            renderingContext.arc(0, 0, radius, 0, Math.PI * 2);
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.closePath();
        },

        // Declare the ball string function
        ballString = function (renderingContext) {

            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(0,0,0)";
            renderingContext.lineWidth = ballStringLineWidth;

            // The line is moved down the width of the cradle frame to look as though
            // it is connected to the bottom of the frame
            renderingContext.moveTo(0, cradleFrameLineWidth);
            renderingContext.lineTo(0, middleY - (height / 6));
            renderingContext.stroke();
            renderingContext.closePath();
        },

        // This function will generate the part of the frame of the Newton's
        // cradle that is "in front" of the metallic balls
        cradleFrame = function (renderingContext) {
            
            // Let's draw the two frames
            renderingContext.beginPath();
            renderingContext.strokeStyle = "rgb(50,50,50)";
            renderingContext.lineCap = "round";
            renderingContext.lineWidth = cradleFrameLineWidth;
            renderingContext.moveTo((width / 5), (height / 7));
            renderingContext.lineTo((width / 5), height - (height / 4.5));
            renderingContext.moveTo(width - (width / 5), (height / 7));
            renderingContext.lineTo(width - (width / 5), height - (height / 4.5));
            renderingContext.stroke();
            renderingContext.closePath();
        },
        
        // Here are all of the sprites!
        // The strings of the balls must be drawn first must so that the balls
        // are "above" them in terms of the layering.
        sprites = [

            // Ball 1 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 25,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: -0.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 25,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 1 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: 15,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6.25,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: 15,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 1
            {
                draw: [metallicBall, metallicBallShiny],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - (radius * 8),
                        ty: middleY - radius,
                        rotate: 25,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    						
					{
						frame: keyframeArray[4],
						tx: middleX - (radius * 5) + (offsetX / 2),
						ty: middleY,
						ease: KeyframeTweener.cubicEaseIn
					},
                    
                    {
                        frame: keyframeArray[6],
                        tx: middleX - (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - (radius * 8),
                        ty: middleY - radius,
                        rotate: 25
                    }
                ]
            },
            // Ball 2 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 2 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4.75,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 2
            {
                draw: [metallicBall, metallicBallShiny],
					keyframes: [
						{
							frame: keyframeArray[0],
							tx: middleX - (radius * 3) - (offsetX * 4),
							ty: middleY - (offsetY * 4),
							ease: KeyframeTweener.cubicEaseIn
						},
	
						{
							frame: keyframeArray[2],
							tx: middleX - (radius * 3),
							ty: middleY,
							ease: KeyframeTweener.cubicEaseOut
						},
						
						{
							frame: keyframeArray[4],
							tx: middleX - (radius * 3) + offsetX,
							ty: middleY - offsetY,
							ease: KeyframeTweener.cubicEaseIn
						},
						
						{
							frame: keyframeArray[6],
							tx: middleX - (radius * 3),
							ty: middleY,
							ease: KeyframeTweener.cubicEaseOut
						},
	
						{
							frame: keyframeArray[8],
							tx:  middleX - (radius * 3) - (offsetX * 4),
							ty: middleY - (offsetY * 4),
							ease: KeyframeTweener.cubicEaseIn
						}
					]
			},

            // Ball 3 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 3 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },
			
			// Ball 3	
            { 
                draw: [metallicBall, metallicBallShiny],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX - radius - (offsetX * 3),
                        ty: middleY - (offsetY * 3),
						ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[2],
                        tx: middleX - radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[4],
                        tx: middleX - radius + (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[6],
                        tx: middleX - radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX - radius - (offsetX * 3),
                        ty: middleY - (offsetY * 3),
                        ease: KeyframeTweener.cubicEaseIn
                    }
                    
                ]
            },

            // Ball 4 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: -2.6,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 4 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },
            
            // Ball 4
            { 
                draw: [metallicBall, metallicBallShiny],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + radius - (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[2],
                        tx: middleX + radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[4],
                        tx: middleX + radius + (offsetX * 3),
                        ty: middleY - (offsetY * 3),
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[6],
                        tx: middleX + radius,
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[8],
                        tx: middleX + radius - (offsetX * 2),
                        ty: middleY - (offsetY * 2),
                        ease: KeyframeTweener.cubicEaseIn
                    }   
                ]
            },

            // Ball 5 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: -3.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 5 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4.75,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4.75,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },
            
            // Ball 5
            { 
                draw: [metallicBall, metallicBallShiny],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 3) - offsetX,
                        ty: middleY - offsetY,
						ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 3),
                        ty: middleY,
						ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 3) + (offsetX * 4),
                        ty: middleY - (offsetY * 4),
						ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 3),
                        ty: middleY,
						ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 3) - offsetX,
                        ty: middleY - offsetY,
						ease: KeyframeTweener.cubicEaseIn
                    } 
                ]
            },
            
            // Ball 6 back string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0.5,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: -25,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0.5,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 6 front string
            {
                draw: [ballString],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6.25,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: -15,
                        ease: KeyframeTweener.cubicEaseIn
                    },

                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6.25,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Ball 6
            {
                draw: [metallicBall, metallicBallShiny],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: middleX + (radius * 5) - (offsetX / 2),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[2],
                        tx: middleX + (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },

                    {
                        frame: keyframeArray[4],
                        tx: middleX + (radius * 8),
                        ty: middleY - radius,
                        rotate: -25,
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: keyframeArray[6],
                        tx: middleX + (radius * 5),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseOut
                    },
                    
                    {
                        frame: keyframeArray[8],
                        tx: middleX + (radius * 5) - (offsetX / 2),
                        ty: middleY,
                        ease: KeyframeTweener.cubicEaseIn
                    }
                ]
            },

            // Cradle frame needs to be drawn last.
            {
                draw: [cradleFrame],
                keyframes: [
                    {
                        frame: keyframeArray[0],
                        tx: 0,
                        ty: 0
                    },

                    {
                        frame: keyframeArray[8],
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