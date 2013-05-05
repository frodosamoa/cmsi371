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

        // Variables for the clock.
        clock,
        minuteTick,
        hourTick,
        secondHand,
        hourHand,
        minuteHand,
        zAxisVector,

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
    clock = function () {
        clock = { currentDate: new Date() };

        // Information about the clock.
        clock.secondAngle = (clock.currentDate.getSeconds() + clock.currentDate.getMilliseconds() * 0.001) * 6;
        clock.minuteAngle = ((clock.currentDate.getMinutes() + (clock.currentDate.getSeconds() / 60)) * 6);
        clock.hourAngle = (clock.minuteAngle / 12) + (clock.currentDate.getHours() * 30);
        clock.zAxisVector = new Vector (0, 0, -1);
        clock.radius = 1;


        // Colors of the clock.
        clock.secondHandColor = { r: 0.803, g: 0.113, b: 0.113 };
        var day = true;
        if (day) {    
            clock.clockFaceColor = { r: 0.863, g: 0.863, b: 0.863 };
            clock.tickAndOtherHandsColor = { r: 0.196, g: 0.196, b: 0.196 };
        } else {
            clock.clockFaceColor = { r: 0.062, g: 0.062, b: 0.062 };
            clock.tickAndOtherHandsColor = { r: 0.878, g: 0.878, b: 0.878 }; 
        }

        // Reusable depth variable.
        clock.handDepth = 0.005;

        // Vertices of the clock.
        clock.clockFaceVertices = Shapes.toRawTriangleArray(Shapes.cylinder(0.95, 0.2, 80));
        clock.hourTickVertices = Shapes.toRawTriangleArray(Shapes.hexahedron(0.10, 0.03, clock.handDepth));
        clock.minuteTickVertices = Shapes.toRawTriangleArray(Shapes.hexahedron(0.06, 0.007, clock.handDepth));
        clock.secondHandVertices = Shapes.toRawTriangleArray(Shapes.hexahedron(0.007, 0.4, clock.handDepth));
        clock.secondHandBigCircle = Shapes.toRawTriangleArray(Shapes.cylinder(0.065, clock.handDepth, 30));
        clock.secondHandSmallCircle = Shapes.toRawTriangleArray(Shapes.cylinder(0.05, clock.handDepth, 30));
        clock.minuteHandVertices = Shapes.toRawTriangleArray(Shapes.hexahedron(0.03, 0.55, clock.handDepth));
        clock.hourHandVertices = Shapes.toRawTriangleArray(Shapes.hexahedron(0.03, 0.3, clock.handDepth));

        return clock;
    }


    nullObject = Shapes.toRawTriangleArray(
                    {
                        vertices: [0],
                        indices: [0]
                    }
                );


    var clock1 = clock();

    /**
     *  Helper function for computing tick transforms.
     */

    tickTransform = function (clock, minuteORHour, time, radius) {
        var i,
            tickTransform = {};

        // Boolean assignment to see if we have a minute or hour tick.
        angle = minuteORHour ? time * 6 : time * 30;

        tickTransform = {
            tx: radius,
            angle: angle,
            rotationVector: clock.zAxisVector
        };

        return tickTransform;
    };

    /**
     *  Returns an array of tick objects ready to be drawn by WebGL.
     */  

    tickObjectsWebGL = function (clock, radius) {
        var tickObjects = [],
            tickObject = {};

        for (i = 1; i < 61; i ++) {
            // Since every tick object has the same color and mode, assign it here.
            tickObject = {
                color: clock.tickAndOtherHandsColor,
                mode: gl.TRIANGLES,
            };

            if (i % 5 !== 0) {
                tickObject.name = i.toString() + " Minute Tick",
                tickObject.vertices = clock.minuteTickVertices;
                tickObject.transforms = tickTransform(clock, true, i, radius + 0.04);
            } else {
                tickObject.name = (i / 5).toString() + " Hour Tick",
                tickObject.vertices = clock.hourTickVertices;
                tickObject.transforms = tickTransform(clock, false, i, radius);
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
                ty: 0.3,
                tz: 0.06,
                angle: clock.minuteAngle,
                rotationVector: clock.zAxisVector
            }
        }
    };

    hourHandWebGl = function (clock) {
        return {
            name: "Hour Hand",
            color: clock.tickAndOtherHandsColor,
            vertices: clock.hourHandVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: 0.2,
                tz: 0.03,
                angle: clock.hourAngle,
                rotationVector: clock.zAxisVector
            }
        }
    };

    secondHandWebGL = function (clock) {
        return {
            name: "Second Hand",
            color: clock.secondHandColor,
            vertices: clock.secondHandVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: 0.3,
                tz: 0.1,
                angle: clock.secondAngle,
                rotationVector: clock.zAxisVector
            },
            children: [
                {
                    name: "Red Circle",
                    color: clock.secondHandColor,
                    vertices: clock.secondHandBigCircle,
                    mode: gl.TRIANGLES,
                    transforms: {
                        ty: 0.35
                    }
                }           
            ]
        };
    };

    clockFaceWebGL = function (clock) {
        return {
            name: "Clock Face",
            color: clock.clockFaceColor,
            vertices: clock.clockFaceVertices,
            mode: gl.TRIANGLES,
            transforms: {
                tz: -0.1
            },
        }
    };


    /**
     * This creates a clok object ready to be sent to WegGl. It takes in a clock
     * object with all of the necessary information to draw the object.
     */ 

    //clock width 760

    // hour tick length 86
    // hour tick width 30

    // minute tick length 35

    // tick offset from outside 18

    // minute hand length 437
    // minute hand width 30
    // minute hand offset from outside 54

    // hour hand length 312
    // hour hand offset from outside 175

    // second hand circle radius 57
    // second hand small circle radius 25

    // second hand length  209
    // second hand offset from circel 175
    // second hand width 12

    clockWebGL = function (clock) {
        var clockObject = {},
            i,


            handDepth,

        // Assigne the hand depth.
        handDepth = 0.005;

        // Assign the colors values.

        // Add the clock face to the array of clock objects.
        // clockObject.push(clockFaceWebGL);

        // Add the second hand to the array of clock objects.
        // clockObject.push(clockFaceWebGL);

        // Add the minute hand to the array of clock objects.
        // clockObject.push(clockFaceWebGL);

        // Add the hour hand to the array of clock objects.
        // clockObject.push(clockFaceWebGL);

        // Add the ticks to the array of clock objects.
        // clockObject.push(clockFaceWebGL);

        return clockObject;
    };

    objectsToDraw = [

        clockFaceWebGL(clock1),
        hourHandWebGl(clock1),
        minuteHandWebGl(clock1),
        secondHandWebGL(clock1),

        {
            name: "Tick Objects",
            vertices: nullObject,
            children: tickObjectsWebGL(clock1, 0.82)
         }/*,

        {
            name: "Smaller Red Circle",
            color: {r: 0.803, g: 0.113, b: 0.113 },
            vertices: secondHandSmallCircle,
            mode: gl.TRIANGLES
        }*/
    ];

    // Pass the vertices of all of the objects to WebGL, including any objects' children.
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
    xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");

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
            new Vector (0, 0, 1),
            new Vector (0, 0, -1),
            new Vector (0, 1, 0)
        ).columnOrder()));
    
    // We now can "project" our scene to whatever way we want.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE,
        new Float32Array(
            Matrix4x4.getOrthoMatrix(-2, 2, -1, 1, -3, 3).columnOrder()
        )
    );

    // Send the vertices to WebGL.
    vertexify(objectsToDraw);

    // Draw the initial scene.
    drawScene();

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