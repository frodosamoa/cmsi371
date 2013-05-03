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
        currentRotation = 0.0,
        currentInterval,
        projectionMatrix,
        transformMatrix,
        rotationMatrix,
        cameraMatrix,
        vertexPosition,
        vertexColor,

        // Variables for the clock.
        // JD: Good; this is effectively your "model model."
        //     For better readability, consider putting these
        //     in a single object, i.e.,
        //
        // clock = {
        //         currentDate: new Date(),
        //         (you can put other initializations here if
        //          they can be invoked immediately)
        //     },
        //
        //     Thus, your code will look like this, making it
        //     easier to tell when you are accessing your
        //     core model data:
        //
        // clock.secondAngle = clock.currentDate.getSeconds() * 6;
        // clock.hourAngle = ...;
        //
        //     ...etc.  Clock-specific functions can be held here
        //     also, again in the spirit of better readability and
        //     separation of concerns.
        currentDate,
        secondAngle,
        hourAngle,
        minuteAngle,
        minuteTick,
        hourTick,
        secondHand,
        hourHand,
        minuteHand,
        zAxisVector,
        hourHandTransform,
        isRotating = false,

        // Functions for creating clock objects.
        tickTransform,
        minuteTickObject,
        hourTickObject,
        clock,

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

    currentDate = new Date();
    secondAngle = (currentDate.getSeconds() + currentDate.getMilliseconds() * 0.001) * 6;
    minuteAngle = ((currentDate.getMinutes() + (currentDate.getSeconds() / 60)) * 6);
    hourAngle = (minuteAngle / 12) + (currentDate.getHours() * 30);
    zAxisVector = new Vector (0, 0, 1); 


    nullObject = Shapes.toRawTriangleArray(
                    {
                        vertices: [0],
                        indices: [0]
                    }
                );
    hourTick = Shapes.toRawTriangleArray(Shapes.hexahedron(0.10, 0.03, 0.005));
    minuteTick = Shapes.toRawTriangleArray(Shapes.hexahedron(0.06, 0.007, 0.005));
    secondHand = Shapes.toRawTriangleArray(Shapes.hexahedron(0.007, 0.4, 0.005));
    secondHandBigCircle = Shapes.toRawTriangleArray(Shapes.cylinder(0.065, 0.005, 30));
    secondHandSmallCircle = Shapes.toRawTriangleArray(Shapes.cylinder(0.05, 0.005, 30));
    minuteHand = Shapes.toRawTriangleArray(Shapes.hexahedron(0.03, 0.55, 0.005));
    hourHand = Shapes.toRawTriangleArray(Shapes.hexahedron(0.03, 0.3, 0.005));

    tickTransform = function (minuteORHour, time, radius) {
        var angle,
            tickObject = {};

        angle = minuteORHour ? time * 6 : time * 30;

        tickObject = {
            tx: radius,
            angle: angle,
            rotationVector: zAxisVector
        };

        return tickObject;
    };

    tickObjects = function (radius) {
        var i,
            tickObjects = [],
            tickObject = {};

        for (i = 1; i < 61; i ++) {
            tickObject = {
                color: { r: 0.196, g: 0.196, b: 0.196 },
                mode: gl.TRIANGLES
            };

            if (i % 5 !== 0) {
                tickObject.name = i.toString() + " Minute Tick",
                tickObject.vertices = minuteTick;
                tickObject.transforms = tickTransform(true, i, radius + 0.04);
            } else {
                tickObject.name = (i / 5).toString() + " Hour Tick",
                tickObject.vertices = hourTick;
                tickObject.transforms = tickTransform(false, i, radius);
            }

            tickObjects.push(tickObject);
        }

        return tickObjects;
    };

    minuteHandWebGl = function (minuteAngle, vertices) {
        return {
            name: "Minute Hand",
            color: { r: 0.196, g: 0.196, b: 0.196 },
            vertices: vertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: 0.3,
                angle: minuteAngle,
                rotationVector: zAxisVector
            }
        }
    };

    hourHandWebGl = function (hourAngle, vertices) {
        return {
            name: "Hour Hand",
            color: { r: 0.196, g: 0.196, b: 0.196 },
            vertices: hourHand,
            mode: gl.TRIANGLES,
            transforms: {
                ty: 0.2,
                angle: hourAngle,
                rotationVector: zAxisVector
            }
        }
    };

    secondHandWebGL = function (secondAngle, handVertices, bigCircleVertices, smallCircleVertices) {
        return {
            name: "Second Hand",
            color: { r: 0.803, g: 0.113, b: 0.113 },
            vertices: handVertices,
            mode: gl.TRIANGLES,
            transforms: {
                ty: 0.2,
                angle: secondAngle,
                rotationVector: zAxisVector
            },
            children: [
                {
                    name: "Bigger Red Circle",
                    color: {r: 0.803, g: 0.113, b: 0.113 },
                    vertices: bigCircleVertices,
                    mode: gl.TRIANGLES,
                    transforms: {
                        ty: 0.65,
                        angle: secondAngle,
                        rotationVector: zAxisVector
                    }
                },            

                {
                    name: "Smaller Red Circle",
                    color: {r: 0.803, g: 0.113, b: 0.113 },
                    vertices: smallCircleVertices,
                    mode: gl.TRIANGLES,
                    transforms: {
                        angle: secondAngle,
                        rotationVector: zAxisVector
                    }
                }

            ]
        };
    }



    clock = function (radius) {
        var clockObject = {},
            i;


        return clockObject;
    };

    objectsToDraw = [
        {
            name: "Clock Face",
            color: { r: 0.863, g: 0.863, b: 0.863 },
            vertices: Shapes.toRawTriangleArray(Shapes.cylinder(0.95, 0.2, 80)),
            mode: gl.TRIANGLES,
            transforms: {
                tx: 0,
                ty: 0,
                tz: 0.2
            }/*,
            children: [

                secondHandWebGL(secondAngle, secondHand, secondHandBigCircle, secondHandSmallCircle),
                hourHandWebGl(hourAngle, hourHand),
                minuteHandWebGl(minuteAngle, minuteHand), 

                {
                    name: "Tick Objects",
                    vertices: nullObject,
                    children: tickObjects(0.82)
                }
            ]*/
        }
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
    drawObjects = function (objectsToDraw, inheritedTransformMatrix) {
        // Redeclaration of i necessary for recursiveness.
        var i;

        for (i = 0; i < objectsToDraw.length; i += 1) {

            // This if statement check to see if the object that is about to be drawn has any transforms.
            if (objectsToDraw[i].transforms) {

                // This if statement checks to see if the object's parents had any transforms.
                // They will be multiplied through another matrix. If not, only the objects
                // transforms are applied.
                if (inheritedTransformMatrix) {
                    inheritedTransformMatrix = Matrix4x4.getTransformMatrix(objectsToDraw[i].transforms).multiply
                                (inheritedTransformMatrix);
                    gl.uniformMatrix4fv(transformMatrix, gl.FALSE, 
                        new Float32Array(
                            Matrix4x4.getTransformMatrix(inheritedTransformMatrix.columnOrder())
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
                    drawObjects(objectsToDraw[i].children);
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
                Matrix4x4.getRotationMatrix(currentXRotation, 1, 0, 0).columnOrder()
            )
        );

        // Set up the rotation matrix before we draw the objects.
        gl.uniformMatrix4fv(yRotationMatrix, gl.FALSE,
            new Float32Array(
                Matrix4x4.getRotationMatrix(currentYRotation, 0, -1, 0).columnOrder()
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
            new Vector (0, 0, -1),
            new Vector (0, 0, 1),
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