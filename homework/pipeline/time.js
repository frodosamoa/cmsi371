/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl, // The WebGL context.

        // This variable stores 3D model information.
        objectsToDraw,

        // The shader program to use.
        shaderProgram,

        // A function that passes all of the object's vertices to WebGL.
        vertexify,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        currentInterval,
        projectionMatrix,
        transformMatrix,
        rotationMatrix,
        cameraMatrix,
        vertexPosition,
        vertexColor,

        // Variables for canvas width and height.
        width,
        height,
        widthRatio,
        heightRatio,

        // Function to make a clock object.
        clock,

        // Functions for creating WebGL ready clock objects.
        tickTransform,
        tickObjectsWebGL,
        secondHandWebGL,
        minuteHandWebGl,
        hourHandWebGl,
        clockFaceWebGL,
        clockWebGL,

        // Variables for mouse rotation.
        isRotating = false,
        currentXRotation = 0,
        currentYRotation = 0,
        mouseXStartingPoint,
        mouseYStartingPoint,

        // A function that draws all of the objects.
        drawObjects,

        // The big "draw scene" function.
        drawScene,

        // Variables to hold object positions.
        secondHandCoords,

        // Reusable loop variables.
        i,
        maxi,
        j,
        maxj;

    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);


    // This function returns a clock object with all of the information
    // necessary to be passed to WebGL.

    // Work on ability for clock to pas another clock as an object.
    clock = function () {

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

    setClock = function (clock, date) {
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

    tickTransform = function (clock, i, radius) {
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

    tickObjectsWebGL = function (clock) {
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

    minuteHandWebGl = function (clock) {
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

    hourHandWebGl = function (clock) {
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

    secondHandWebGL = function (clock) {
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

    clockFaceWebGL = function (clock) {
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

    clockWebGL = function (clock) {
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
        console.log(clockObject);
        return clockObject;
    };

    nullObject = Shapes.toRawTriangleArray(
                {
                    vertices: [0],
                    indices: [0]
                }
            );

    var clock1 = clock();

    objectsToDraw = [
        {
            name: "Clock Array",
            vertices: nullObject,
            children: clockWebGL(clock1)
        },

        {
            name: "Tick Objects",
            vertices: nullObject,
            children: tickObjectsWebGL(clock1)
         }
    ];

    /**
     *  Pass the vertices of all of the objects to WebGL, including any objects' children.
     */

    vertexify = function (objectsToDraw) {
        // Redeclaration of i necessary for recursiveness.
        var i;
        
        for (i = 0; i < objectsToDraw.length; i += 1) {
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].vertices);

            if (!objectsToDraw[i].colors) {
                // If we have a single color, we expand that into an array
                // of the same color over and over.
                objectsToDraw[i].colors = [];
                for (j = 0, maxj = objectsToDraw[i].vertices.length / 3;
                        j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
            }

            objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].colors);

            if (objectsToDraw[i].children && (objectsToDraw[i].children.length !== 0)) {
                vertexify(objectsToDraw[i].children);
            }
        }
    };  

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");

    /*
     * Displays all of the objects, including any children an object has.
     */

    drawObjects = function (objectsToDraw, inheritedTransforms) {
        // Redeclaration of i for recursiveness.
        // Matrix to hold all of the inhereted transforms.
        var i,
            inheritedTransformMatrix = new Matrix4x4 ();

        for (i = 0; i < objectsToDraw.length; i += 1) {
            // This if statement check to see if the object that is about to be drawn has any transforms.
            if (objectsToDraw[i].transforms) {

                // This if statement checks to see if the object's parents had any transforms.
                // They will be multiplied through another matrix. If not, only the object's
                // transforms are applied.
                if (inheritedTransforms) {
                    inheritedTransformMatrix = Matrix4x4.getTransformMatrix(inheritedTransforms).multiply(
                            Matrix4x4.getTransformMatrix(objectsToDraw[i].transforms));
                    gl.uniformMatrix4fv(transformMatrix, gl.FALSE, 
                        new Float32Array(
                            inheritedTransformMatrix.columnOrder()
                        )
                    );
                } else {
                    gl.uniformMatrix4fv(transformMatrix, gl.FALSE, 
                        new Float32Array(
                            Matrix4x4.getTransformMatrix(objectsToDraw[i].transforms).columnOrder()
                        )
                    );
                }
            }

            // Set the varying colors.
            gl.bindBuffer(gl.ARRAY_BUFFER, objectsToDraw[i].colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, objectsToDraw[i].buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(objectsToDraw[i].mode, 0, objectsToDraw[i].vertices.length / 3);

            if (objectsToDraw[i].children && (objectsToDraw[i].children.length !== 0)) {
                inheritedTransforms = objectsToDraw[i].transforms;
                drawObjects(objectsToDraw[i].children, inheritedTransforms);
            }
        }

    };

    /*
     * Displays the scene.
     */

    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the rotation matrix before we draw the objects.
        gl.uniformMatrix4fv(xRotationMatrix, gl.FALSE,
            new Float32Array(
                Matrix4x4.getRotationMatrix(currentXRotation / 4, 1, 0, 0).columnOrder()
            )
        );

        // Set up the rotation matrix before we draw the objects.
        gl.uniformMatrix4fv(yRotationMatrix, gl.FALSE,
            new Float32Array(
                Matrix4x4.getRotationMatrix(currentYRotation / 4, 0, 1, 0).columnOrder()
            )
        );
        
        // Display the objects.
        drawObjects(objectsToDraw);

        // All done.
        gl.flush();
    };

    // Here is the camera matrix.
    gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, new Float32Array(
        Matrix4x4.getLookAtMatrix(
            new Vector (0, 0, 0.8),
            new Vector (0, 0, -1),
            new Vector (0, 1, 0)
        ).columnOrder()));
    
    width = canvas.width;
    height = canvas.height;
    widthRatio = width * 0.01;
    heightRatio = height * 0.01;

    // We now can "project" our scene to whatever way we want.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE,
        new Float32Array(
            Matrix4x4.getOrthoMatrix(-widthRatio, widthRatio, -heightRatio, heightRatio, -3, 5).columnOrder()
        )
    );

    // Send the vertices to WebGL.
    vertexify(objectsToDraw);


    window.setInterval(function () {
        setClock(clock1, new Date())
    }, 1000);

    // Draw the initial scene.
    $(window).load(function (event) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        drawScene();
    });

    // When the window is resized, change the canvas width and height.
    $(window).resize(function (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Projection TODO

        drawScene();
    });

    // Rotate the canvas based on user input.
    $(canvas).mousedown(function (event) {
        isRotating = true;
        mouseXStartingPoint = event.clientX;
        mouseYStartingPoint = event.clientY;
        startingYRotation = currentYRotation;
        startingXRotation = currentXRotation;
    });
        
    $(canvas).mousemove(function (event) {
        if (isRotating) {
            currentYRotation = startingYRotation + (event.clientX - mouseXStartingPoint);
            currentXRotation = startingXRotation + (event.clientY - mouseYStartingPoint);
            drawScene();
        }
    });

    $(canvas).mouseup(function () {
        isRotating = false;
    });

}(document.getElementById("time")));