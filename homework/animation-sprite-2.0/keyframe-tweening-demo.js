/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),
        height = canvas.height,                 // canvas height
        width = canvas.width,                   // canvas width
        radius = 40,                            // radius of the balls
        middleX = width/2,                      // middle x coordinate of the balls on the cradle
        middleY = (height / 3) * 1.7,           // y coordinate of all of the balls on the cradle
        offsetX = 4,                            // x coordinate offset between the balls when hit
        offsetY = 0.5,                          // y coordinate offset between the balls when hit
        frameLength = 10,
        frame = [0 * frameLength, 1 * frameLength, 2 * frameLength,
                 3 * frameLength, 4 * frameLength, 5 * frameLength,
                 6 * frameLength, 7 * frameLength, 8 * frameLength],
        cradleFrameLineWidth = 15,
        ballStringLineWidth = 2,
        cradleBaseWidth = width - (60 * 2),


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
            renderingContext.lineTo((width / 7), (height / 3) * 2);
            renderingContext.lineTo(width - (width / 7), (height / 3) * 2);
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
            renderingContext.lineTo((width / 4), height - (height / 3.2));
            renderingContext.moveTo((width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), (height / 5));
            renderingContext.moveTo(width - (width / 4), (height / 5));
            renderingContext.lineTo(width - (width / 4), height - (height / 3.2));
            renderingContext.moveTo((width / 5), (height / 7));
            renderingContext.lineTo(width - (width / 5), (height / 7));
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
            renderingContext.lineWidth = ballStringLineWidth;

            // the line is moved down a the width of the cradle frame to look as though
            // it is connected to the bottom of the frame
            renderingContext.moveTo(0, cradleFrameLineWidth);
            renderingContext.lineTo(0, middleY - (height / 6));
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
            renderingContext.lineWidth = cradleFrameLineWidth;
            renderingContext.moveTo((width / 5), (height / 7));
            renderingContext.lineTo((width / 5), height - (height / 4.5));
            renderingContext.moveTo(width - (width / 5), (height / 7));
            renderingContext.lineTo(width - (width / 5), height - (height / 4.5));
            renderingContext.stroke();
            renderingContext.closePath();
        },
        
        
        sprites = [

            // ball 1 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 25,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: -0.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 5),
                        ty: (width / 7),
                        rotate: 25,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 1 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: 15,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6.25,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: -6,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 5) - 30,
                        ty: (width / 10),
                        rotate: 15,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 2 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 3),
                        ty: (width / 7),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 2 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4.75,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -4,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - (radius * 3) - 20,
                        ty: (width / 10),
                        rotate: -1,
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
                        ty: (width / 7),
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - radius,
                        ty: (width / 7),
                        rotate: 2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 3 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: -2,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX - radius - 10,
                        ty: (width / 10),
                        rotate: 0,
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
                        ty: (width / 7),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: -2.6,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + radius,
                        ty: (width / 7),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 4 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 2,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + radius + 10,
                        ty: (width / 10),
                        rotate: 3.5,
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
                        ty: (width / 7),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: -3.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + (radius * 3),
                        ty: (width / 7),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 5 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4.75,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 1,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + (radius * 3) + 20,
                        ty: (width / 10),
                        rotate: 4.75,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 6 back string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0.5,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: -25,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + (radius * 5),
                        ty: (width / 7),
                        rotate: 0.5,
                        ease: KeyframeTweener.cubicEaseIn

                    }

                ]
            },

            // ball 6 front string
            {
                draw: ballString,
                keyframes: [
                    {
                        frame: frame[0],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6.25,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[2],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[4],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: -15,
                        ease: KeyframeTweener.cubicEaseIn

                    },

                    {
                        frame: frame[6],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6,
                        ease: KeyframeTweener.cubicEaseOut

                    },

                    {
                        frame: frame[8],
                        tx: middleX + (radius * 5) + 30,
                        ty: (width / 10),
                        rotate: 6.25,
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