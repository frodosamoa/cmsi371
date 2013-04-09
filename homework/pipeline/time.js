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
        tranformMatrix,
        cameraMatrix,
        vertexPosition,
        vertexColor,

        // A function that draws all of the objects.
        drawObjects,

        // The big "draw scene" function.
        drawScene,

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

    sphereTriangleVertices = Shapes.toRawTriangleArray(Shapes.sphere());
    sphereLineVertices = Shapes.toRawLineArray(Shapes.sphere());

    // Build the objects to display.
    // JD: This works on the top-level object...does it work as expected on
    //     subobjects?  You should try that  ;-)
    objectsToDraw = [
        {
            color: { r: 0.7, g: 0.7, b: 0.7 },
            vertices: sphereLineVertices,
            mode: gl.LINES,
            tick: 0,
            tickDelta: 0.1,
            transforms: {
                tx: 0.25,
                ty: 0.0,
                tz: -110,
                sx: 0.3,
                sy: 0.3,
                rotationVector: new Vector (5, 5, 5),
                angle: 50
            }
        },

        {
            color: { r: 0.7, g: 0.7, b: 0.7 },
            vertices: sphereTriangleVertices,
            mode: gl.TRIANGLES,
            tick: 0,
            tickDelta: 1,
            transforms: {
                tx: -0.25,
                ty: 0.0,
                tz: -110,
                sx: 0.3,
                sy: 0.3
            }
        },

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
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");

    /*
     * Displays all of the objects, including any leafs an object has.
     */
    drawObjects = function (objectsToDraw) {
        for (i = 0; i < objectsToDraw.length; i += 1) {

            if (objectsToDraw[i].transforms) {
                gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(Matrix4x4.getTransformMatrix(objectsToDraw[i].transforms).columnOrder()));
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

        // Display the objects.
        drawObjects(objectsToDraw);

        // All done.
        gl.flush();
    };

    // Here is the camera matrix. TODO
    /*
    gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, new Float32Array(
        Matrix4x4().getLookAtMatrix(
            new Vector (0, 1, 0),
            new Vector (0, 0, 0),
            new Vector (0, 1, 0)
        ).convertToWebGL); */
    
    // We now can "project" our scene to whatever way we want.
    // JD: I'm going to guess that you did this on purpose: project to the exact
    //     same viewing volume initially in order to make sure that things work.
    //     Good move, and yes, this works nicely.
    //
    //     But, hope you don't mind, I took the liverty of doing a little
    //     reformatting so that the editor window need not be so wide.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE,
        new Float32Array(
            Matrix4x4.getFrustumMatrix(-10, 10, -10, 10, 100, 10000).columnOrder()
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
                // Modify the transforms property of the different objects.
                var i, maxi;
                // Assumption: the objectsToDraw array is strictly an array
                // of sphere objects to be modified through a trig function.
                for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
                    objectsToDraw[i].tick += objectsToDraw[i].tickDelta;
                    if (i % 2) {
                        // For balls at odd indices, tweak tx and tz.
                        objectsToDraw[i].transforms.tx += (Math.sin(objectsToDraw[i].tick) / 10.0);
                        objectsToDraw[i].transforms.tz -= (Math.cos(objectsToDraw[i].tick) / 50.0);
                    } else {
                        // For balls at even indices, tweak tx and ty.
                        objectsToDraw[i].transforms.tx -= (Math.cos(objectsToDraw[i].tick) / 30.0);
                        objectsToDraw[i].transforms.ty += (Math.sin(objectsToDraw[i].tick) / 20.0);
                    }
                }

                drawScene();
            }, 30);
        }
    });

}(document.getElementById("time")));