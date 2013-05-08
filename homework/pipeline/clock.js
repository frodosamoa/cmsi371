var Clock = (function () {
	

	 var clock = function () {

        clock = { currentDate: new Date() };

        // Information about the clock.
        clock.secondAngle = (clock.currentDate.getSeconds() + clock.currentDate.getMilliseconds() * 0.001) * 6;
        clock.minuteAngle = ((clock.currentDate.getMinutes() + (clock.currentDate.getSeconds() / 60)) * 6);
        clock.hourAngle = (clock.minuteAngle / 12) + (clock.currentDate.getHours() * 30);
        clock.zAxisVector = new Vector (0, 0, -1);
        clock.radius = 1;
        clock.diameter = clock.radius * 2;

        // Colors of the clock.
        clock.secondHandColor = { r: 0.803, g: 0.113, b: 0.113 };

        // Depending on if it is day ot night time in a certain region,
        // change the colors of the clock. TODO
        var day = true;
        if (day) {    
            clock.clockFaceColor = { r: 0.863, g: 0.863, b: 0.863 };
            clock.tickAndOtherHandsColor = { r: 0.196, g: 0.196, b: 0.196 };
        } else {
            clock.clockFaceColor = { r: 0.062, g: 0.062, b: 0.062 };
            clock.tickAndOtherHandsColor = { r: 0.878, g: 0.878, b: 0.878 }; 
        }

        // Clock width, length, and depth ratios according to the radius.
        clock.clockFaceZDepth = -0.1;
        clock.clockFaceDepth = 0.2;
        clock.handDepth = 0.013;
        clock.secondHandDepth = (clock.handDepth * 3) + 0.005;
        clock.minuteHandDepth = (clock.handDepth * 2) + 0.005;
        clock.hourHandDepth = (clock.handDepth / 2) + 0.005;

        // Clock width ratios.
        clock.secondHandWidth = clock.diameter * 0.012;
        clock.minuteTickWidth = clock.diameter * 0.009;
        clock.hourMinuteAndTickWidth = clock.diameter * 0.039;

        // Clock length ratios.
        clock.secondHandLength = clock.diameter * 0.44;
        clock.hourHandLength = clock.diameter * 0.397;
        clock.minuteHandLength = clock.diameter * 0.57;

        clock.hourTickLength = clock.diameter * 0.113;
        clock.minuteTickLength = clock.diameter * 0.053;

        // Clock radii ratios.
        clock.secondHandBigCircleRadius = clock.radius * 0.075;
        clock.secondHandSmallCircleRadius = clock.radius * 0.03;

        // Clock offset ratios.
        clock.tickOffset = clock.diameter * 0.02;
        clock.hourHandOffset = clock.diameter * 0.25;
        clock.minuteHandOffset = clock.diameter * 0.076;
        clock.secondHandOffset = clock.diameter * 0.19;

        // Vertices of all of the parts of the clock.
        clock.clockFaceVertices = Shapes.toRawTriangleArray(
                                    Shapes.cylinder(
                                        clock.radius, clock.clockFaceDepth, 80
                                    )
                                  );
        clock.hourTickVertices = Shapes.toRawTriangleArray(
                                    Shapes.hexahedron(
                                        clock.hourTickLength, clock.hourMinuteAndTickWidth, clock.handDepth
                                    )
                                );
        clock.minuteTickVertices = Shapes.toRawTriangleArray(
                                        Shapes.hexahedron(
                                            clock.minuteTickLength, clock.minuteTickWidth, clock.handDepth
                                        )
                                    );
        clock.secondHandVertices = Shapes.toRawTriangleArray(
                                        Shapes.hexahedron(
                                            clock.secondHandWidth, clock.secondHandLength, clock.handDepth
                                        )
                                    );
        clock.secondHandBigCircleVertices = Shapes.toRawTriangleArray(
                                               Shapes.cylinder(
                                                    clock.secondHandBigCircleRadius, clock.handDepth * 2, 30
                                                )
                                            );
        clock.secondHandSmallCircleVertices = Shapes.toRawTriangleArray(
                                                  Shapes.cylinder(
                                                       clock.secondHandSmallCircleRadius, clock.handDepth, 30
                                                 )
                                               );
        clock.minuteHandVertices = Shapes.toRawTriangleArray(
                                        Shapes.hexahedron(
                                            clock.hourMinuteAndTickWidth, clock.minuteHandLength, clock.handDepth
                                        )
                                    );

        clock.hourHandVertices = Shapes.toRawTriangleArray(
                                    Shapes.hexahedron(
                                        clock.hourMinuteAndTickWidth, clock.hourHandLength, clock.handDepth
                                    )
                                );

        return clock;
    }

    /**
     * This function allows us to set the clock to any given date.
     */ 

    clock.prototype.setClock = function (clock, date) {
        // JD: This is the right direction, with your code updating relevant
        //     values that change with the current time.  However, your code
        //     does not go far enough (yet)---the issue here is that WebGL
        //     doesn't *see* secondAngle, minuteAngle, and hourAngle.  You
        //     need to follow your code to where these values end up affecting
        //     something that WebGL *does* see, then refactor your code so that
        //     *those* updates are taking place in here also.
        clock.currentDate = date;
        clock.secondAngle = (clock.currentDate.getSeconds() + clock.currentDate.getMilliseconds() * 0.001) * 6;
        clock.minuteAngle = ((clock.currentDate.getMinutes() + (clock.currentDate.getSeconds() / 60)) * 6);
        clock.hourAngle = (clock.minuteAngle / 12) + (clock.currentDate.getHours() * 30);
        drawScene();
    }

    /**
     *  Helper function for computing tick transforms.
     */

    clock.prototype.tickTransform = function (clock, i, radius) {
        var tickTransform = {};

        tickTransform = {
            tx: radius,
            tz: clock.handDepth / 2,
            angle: i * 6,
            rotationVector: clock.zAxisVector
        };

        return tickTransform;
    };

    /**
     *  Returns an array of tick objects ready to be drawn by WebGL.
     */  

    clock.prototype.tickObjectsWebGL = function (clock) {
        var tickObjects = [],
            tickObject = {};

        for (i = 1; i < 61; i ++) {
            // Since every tick object has the same color and mode, assign it here.
            tickObject = {
                color: clock.tickAndOtherHandsColor,
                mode: gl.TRIANGLES
            };

            if (i % 5 !== 0) {
                tickObject.name = i.toString() + " Minute Tick",
                tickObject.vertices = clock.minuteTickVertices;
                tickObject.transforms = tickTransform(clock, i, 
                        clock.radius - (clock.minuteTickLength / 2) - clock.tickOffset);
            } else {
                tickObject.name = (i / 5).toString() + " Hour Tick",
                tickObject.vertices = clock.hourTickVertices;
                tickObject.transforms = tickTransform(clock, i,
                        clock.radius - (clock.hourTickLength / 2) - clock.tickOffset);
            }

            tickObjects.push(tickObject);
        }

        return tickObjects;
    };



    /**
     *  Returns a minute hand ready to be drawn by WebGL.
     */     

    clock.prototype.minuteHandWebGl = function (clock) {
        return {
            name: "Minute Hand",
            color: clock.tickAndOtherHandsColor,
            vertices: clock.minuteHandVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: clock.radius - (clock.minuteHandLength / 2) - clock.minuteHandOffset,
                tz: clock.minuteHandDepth,
                angle: clock.minuteAngle,
                rotationVector: clock.zAxisVector
            }
        }
    };

    /**
     *  Returns an hour hand ready to be drawn by WebGL.
     */  

    clock.prototype.hourHandWebGl = function (clock) {
        return {
            name: "Hour Hand",
            color: clock.tickAndOtherHandsColor,
            vertices: clock.hourHandVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: clock.radius - (clock.hourHandLength / 2) - clock.hourHandOffset,
                tz: clock.hourHandDepth,
                angle: clock.hourAngle,
                rotationVector: clock.zAxisVector
            }
        }
    };

    /**
     *  Returns a second hand ready to be drawn by WebGL.
     */  

    clock.prototype.secondHandWebGL = function (clock) {
        return {
            name: "Second Hand",
            color: clock.secondHandColor,
            vertices: clock.secondHandVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: clock.radius - (clock.secondHandLength / 2) - clock.secondHandOffset,
                tz: clock.secondHandDepth,
                angle: clock.secondAngle,
                rotationVector: clock.zAxisVector
            },
            children: [
                {
                    name: "Big Red Circle",
                    color: clock.secondHandColor,
                    vertices: clock.secondHandBigCircleVertices,
                    mode: gl.TRIANGLES,
                    transforms: {
                        ty: clock.secondHandLength / 2
                    }
                },

                {
                    name: "Small Red Circle",
                    color: clock.secondHandColor,
                    vertices: clock.secondHandSmallCircleVertices,
                    mode: gl.TRIANGLES,
                    transforms: {
                        ty: -(clock.radius - (clock.secondHandLength / 2) - clock.secondHandOffset)
                    }
                }          
            ]
        };
    };

    /**
     *  Returns a minute hand ready to be drawn by WebGL.
     */  

    clock.prototype.clockFaceWebGL = function (clock) {
        return {
            name: "Clock Face",
            color: clock.clockFaceColor,
            vertices: clock.clockFaceVertices,
            mode: gl.TRIANGLES,
            transforms: {
                tz: clock.clockFaceZDepth
            },
        }
    };

    /**
     * This creates a clock object ready to be sent to WegGl. It takes in a clock
     * object with all of the necessary information to draw the object.
     */

    clock.prototype.clockWebGL = function (clock) {
        var clockObject = [];

        // Add the clock face to the array of clock objects.
        clockObject.push(clockFaceWebGL(clock));

        // Add the hour hand to the array of clock objects.
        clockObject.push(hourHandWebGl(clock));

        // Add the minute hand to the array of clock objects.
        clockObject.push(minuteHandWebGl(clock));

        // Add the second hand to the array of clock objects.
        clockObject.push(secondHandWebGL(clock));

        // Add the ticks to the array of clock objects.
        // clockObject.push(clockFaceWebGL);
        return clockObject;
    };
})();