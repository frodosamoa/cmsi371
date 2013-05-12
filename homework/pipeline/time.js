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
        projectionMatrix,
        transformMatrix,
        rotationMatrix,
        cameraMatrix,
        vertexPosition,
        vertexColor,

        // Variables for canvas width and height, and their ratios.
        width,
        height,
        widthRatio,
        heightRatio,
        resize,

        // For emphasis, we separate the variables that involve lighting.
        normalVector,
        lightPosition,
        lightDiffuse,

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

    var clock = new Clock (gl);
    objectsToDraw = clock.clockWebGL();

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

            // Normal buffer.
            objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].normals);

            // Color buffer.
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
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    // Out projection, mouse movement rotation, and camera matrices are "hooked".
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");

    // Note the additional variables.
    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");

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
            // Set the varying normal vectors.
            gl.bindBuffer(gl.ARRAY_BUFFER, objectsToDraw[i].normalBuffer);
            gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

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
    
    // Send the vertices to WebGL.
    vertexify(objectsToDraw);

    window.setInterval(function () {
        clock.setClock(new Date());
        // JD: Yikes---it's a whole new clock, every single second!!!
        objectsToDraw = clock.clockWebGL();

        // JD: When you see how not to replace objectsToDraw every
        //     time, you will also find that vertexify will no longer
        //     be necessary.
        vertexify(objectsToDraw);
        drawObjects(objectsToDraw);
    }, 1000);

    /**
     *  This function resizes the canvas and updates the porjection matrix.
     */
    redraw = function (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        widthRatio = ((canvas.width/canvas.height) + 1) * 0.7;
        heightRatio = ((canvas.height/canvas.width) + 1) * 0.7;

        gl.uniformMatrix4fv(projectionMatrix, gl.FALSE,
            new Float32Array(
                Matrix4x4.getOrthoMatrix(-widthRatio, widthRatio, -heightRatio, heightRatio, -2, 2).columnOrder()
            )
        );

        // Set the viewport.
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Draw the scene.
        drawScene();
    }

    // Set up our one light source and color.  Note the uniform3fv function.
    gl.uniform3fv(lightPosition, [0.0, 0.0, -1.0]);
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);

    // Draw the initial scene.
    $(window).load(function () {
        redraw(canvas);
    });

    // When the window is resized, update the scene.
    $(window).resize(function () {
        redraw(canvas);
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