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
    secondAngle = currentDate.getSeconds() * 6;
    minuteAngle = ((currentDate.getMinutes() + (currentDate.getSeconds() / 60)) * 6);
    hourAngle = (minuteAngle / 12) + (currentDate.getHours() * 30);
    zAxisVector = new Vector (0, 0, 1); 

    hourTick = Shapes.toRawTriangleArray(Shapes.cube(0.03, 0.12, 0.005));
    minuteTick = Shapes.toRawTriangleArray(Shapes.cube(0.007, 0.06, 0.005));
    secondHand = Shapes.toRawTriangleArray(Shapes.cube(0.007, 0.45, 0.005));
    minuteHand = Shapes.toRawTriangleArray(Shapes.cube(0.03, 0.4, 0.005));
    hourHand = Shapes.toRawTriangleArray(Shapes.cube(0.03, 0.3, 0.005));

    hourHandTransform = function (hour, radius) {
        var xNeg = -1,
            yNeg = -1,
            hourAngle = hour * 30,
            transformObject = {};

        transformObject = {
            ty: yNeg * radius * Math.cos(hourAngle * (Math.PI / 180)),
            tx: xNeg * radius * Math.sin(hourAngle * (Math.PI / 180)),
            angle: -hourAngle,
            rotationVector: zAxisVector
        };

        return transformObject;
    };

    hourHandsTickObjects = function (radius) {
        var i,
            hourHandTickArray = [],
            hourHandTickObject = {};

        for (i = 1; i < 13; i ++) {
            hourHandTickObject =  {
                    name: i.toString() + " Hour Tick",
                    color: { r: 0.196, g: 0.196, b: 0.196 },
                    vertices: hourTick,
                    mode: gl.TRIANGLES,
                    transforms: hourHandTransform(i, radius)
                };
            hourHandTickArray.push(hourHandTickObject);
        }

        return hourHandTickArray;
    };

    objectsToDraw = [
        {
            name: "Null Object Anchor",
            vertices: Shapes.toRawTriangleArray(
                {
                    vertices: [0],
                    indices: [0]
                }
            ),
            transforms: {
                tx: 0,
                ty: 0
            },
            leafs: [
                {
                    name: "Second Hand",
                    color: { r: 0.803, g: 0.113, b: 0.113 },
                    vertices: secondHand,
                    mode: gl.TRIANGLES,
                    transforms: {
                        angle: secondAngle,
                        rotationVector: zAxisVector
                    }
                    // Temporary red circle TODO
                        /*
                        leafs: [
                            name: "Red Circle",
                            color: {r: 1.0, g: 0.0, b: 0.0 },
                            vertices: Shapes.toRawTriangleArray(Shapes.cylinder()),
                            mode: gl.TRIANGLES,
                            transforms: {
                                tx: secondhandCoords.tx,
                                ty: secondhandCoords.ty
                            }
                        ]
                        */   
                },

                {
                    name: "Hour Hand",
                    color: { r: 0.196, g: 0.196, b: 0.196 },
                    vertices: hourHand,
                    mode: gl.TRIANGLES,
                    transforms: {
                        angle: hourAngle,
                        rotationVector: zAxisVector
                    }
                },

                {
                    name: "Minute Hand",
                    color: { r: 0.196, g: 0.196, b: 0.196 },
                    vertices: minuteHand,
                    mode: gl.TRIANGLES,
                    transforms: {
                        angle: minuteAngle,
                        rotationVector: zAxisVector
                    }
                },

                {
                    name: "Minute Ticks",
                    vertices: Shapes.toRawTriangleArray(
                        {
                            vertices: [0],
                            indices: [0]
                        }
                    )/*,
                    leafs: [
                        {
                            name: "1 Minute Tick",
                            color: { r: 0.196, g: 0.196, b: 0.196 },
                            vertices: minuteTick,
                            mode: gl.TRIANGLES,
                            transforms: {
                                tx: 0.1,
                                ty: 0.78
                                angle: 6,
                                rotationVector: zAxisVector
                            }
                        }
                    ]*/
                },

                {
                    name: "Hour Ticks",
                    vertices: Shapes.toRawTriangleArray(
                        {
                            vertices: [0],
                            indices: [0]
                        }
                    ),
                    leafs: hourHandsTickObjects(0.8)
                }
            ]
        }
    ];

    // Pass the vertices of all of the objects to WebGL, including any objects' leafs.
    vertexify = function (objectsToDraw) {
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
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

            if (objectsToDraw[i].leafs && (objectsToDraw[i].leafs.length !== 0)) {
                vertexify(objectsToDraw[i].leafs);
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

    /*
     * Displays all of the objects, including any leafs an object has.
     */
    drawObjects = function (objectsToDraw) {
        for (i = 0; i < objectsToDraw.length; i += 1) {

            if (objectsToDraw[i].transforms) {
                gl.uniformMatrix4fv(transformMatrix, gl.FALSE, 
                    new Float32Array(
                        Matrix4x4.getTransformMatrix(objectsToDraw[i].transforms).columnOrder()
                    )
                );
            }

            // Set the varying colors.
            gl.bindBuffer(gl.ARRAY_BUFFER, objectsToDraw[i].colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, objectsToDraw[i].buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(objectsToDraw[i].mode, 0, objectsToDraw[i].vertices.length / 3);

            if (objectsToDraw[i].leafs) {
                    drawObjects(objectsToDraw[i].leafs);
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
        gl.uniformMatrix4fv(rotationMatrix, gl.FALSE,
            new Float32Array(
                Matrix4x4.getRotationMatrix(currentRotation, 0, 0, 1).columnOrder()
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
            Matrix4x4.getOrthoMatrix(-1, 1, -1, 1, -1, 1).columnOrder()
        )
    );

    // Send the vertices to WebGL.
    vertexify(objectsToDraw);

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        } else {
            currentInterval = setInterval(function () {
                currentRotation += 1.0;
                drawScene();
                if (currentRotation >= 360.0) {
                    currentRotation -= 360.0;
                }
            }, 30);
        }
    });

}(document.getElementById("time")));