var Clock = (function () {
	
	// Define the constructor.
	var clock = function (gl) {

		// Time information about the clock.
        this.currentDate = new Date();
        this.secondAngle = (this.currentDate.getSeconds() + this.currentDate.getMilliseconds() * 0.001) * 6;
        this.minuteAngle = ((this.currentDate.getMinutes() + (this.currentDate.getSeconds() / 60)) * 6);
        this.hourAngle = (this.minuteAngle / 12) + (this.currentDate.getHours() * 30);
        this.zAxisVector = new Vector (0, 0, -1);

        // Radius and diameter, used for all of the ratios.
        this.radius = 1;
        this.diameter = this.radius * 2;

        // A gl context must be passed for the mode of the WebGL objects.
       	this.gl = gl;

        // Colors of the clock.
        this.secondHandColor = { r: 0.803, g: 0.113, b: 0.113 };

        // Depending on if it is day ot night time in a certain region,
        // change the colors of the this. TODO
        var day = true;
        if (day) {    
            this.clockFaceColor = { r: 0.863, g: 0.863, b: 0.863 };
            this.tickAndOtherHandsColor = { r: 0.196, g: 0.196, b: 0.196 };
        } else {
            this.clockFaceColor = { r: 0.062, g: 0.062, b: 0.062 };
            this.tickAndOtherHandsColor = { r: 0.878, g: 0.878, b: 0.878 }; 
        }

        // this.width, length, and depth ratios according to the radius.
        this.clockFaceZDepth = -0.1;
        this.clockFaceDepth = 0.2;
        this.handDepth = 0.013;
        this.secondHandDepth = (this.handDepth * 3) + 0.005;
        this.minuteHandDepth = (this.handDepth * 2) + 0.005;
        this.hourHandDepth = (this.handDepth / 2) + 0.005;

        // Clock width ratios.
        this.secondHandWidth = this.diameter * 0.012;
        this.minuteTickWidth = this.diameter * 0.009;
        this.hourMinuteAndTickWidth = this.diameter * 0.039;

        // Clock length ratios.
        this.secondHandLength = this.diameter * 0.44;
        this.hourHandLength = this.diameter * 0.397;
        this.minuteHandLength = this.diameter * 0.57;
        this.hourTickLength = this.diameter * 0.113;
        this.minuteTickLength = this.diameter * 0.053;

        // Clock radii ratios.
        this.secondHandBigCircleRadius = this.radius * 0.075;
        this.secondHandSmallCircleRadius = this.radius * 0.03;

        // Clock offset ratios.
        this.tickOffset = this.diameter * 0.02;
        this.hourHandOffset = this.diameter * 0.25;
        this.minuteHandOffset = this.diameter * 0.076;
        this.secondHandOffset = this.diameter * 0.19;

        // Meshes of all of the parts of the clock.
        this.clockFaceMesh = Shapes.cylinder(this.radius, this.clockFaceDepth, 80);
        this.hourTickMesh = Shapes.hexahedron(this.hourTickLength, this.hourMinuteAndTickWidth, this.handDepth);
        this.minuteTickMesh = Shapes.hexahedron(this.minuteTickLength, this.minuteTickWidth, this.handDepth);
        this.secondHandMesh = Shapes.hexahedron(this.secondHandWidth, this.secondHandLength, this.handDepth);
        this.secondHandBigCircleMesh = Shapes.cylinder(this.secondHandBigCircleRadius, this.handDepth * 2, 30);
        this.secondHandSmallCircleMesh = Shapes.cylinder(this.secondHandSmallCircleRadius, this.handDepth, 30);
        this.minuteHandMesh = Shapes.hexahedron(this.hourMinuteAndTickWidth, this.minuteHandLength, this.handDepth);
        this.hourHandMesh = Shapes.hexahedron(this.hourMinuteAndTickWidth, this.hourHandLength, this.handDepth);

        for (i = 0; i < this.clockFaceMesh.indices.length; i++) {
        	if (this.clockFaceMesh.indices[i][0] > this.clockFaceMesh.vertices.length ||
        		this.clockFaceMesh.indices[i][1] > this.clockFaceMesh.vertices.length ||
        		this.clockFaceMesh.indices[i][2] > this.clockFaceMesh.vertices.length) {
        		console.log("We have a vertice that is too large.");
        	}
        }

        // Vertices of all of the parts of the clock.
        this.clockFaceVertices = Shapes.toRawTriangleArray(this.clockFaceMesh);
        this.hourTickVertices = Shapes.toRawTriangleArray(this.hourTickMesh);
        this.minuteTickVertices = Shapes.toRawTriangleArray(this.minuteTickMesh);
        this.secondHandVertices = Shapes.toRawTriangleArray(this.secondHandMesh);
        this.secondHandBigCircleVertices = Shapes.toRawTriangleArray(this.secondHandBigCircleMesh);
        this.secondHandSmallCircleVertices = Shapes.toRawTriangleArray(this.secondHandSmallCircleMesh);
        this.minuteHandVertices = Shapes.toRawTriangleArray(this.minuteHandMesh);
        this.hourHandVertices = Shapes.toRawTriangleArray(this.hourHandMesh);

        // Normals for all of the shapes of the clock.
        this.clockFaceNormals = Shapes.toNormalArray(this.clockFaceMesh);
        this.hourTickNormals = Shapes.toNormalArray(this.hourTickMesh);
        this.minuteTickNormals = Shapes.toNormalArray(this.minuteTickMesh);
        this.secondHandNormals = Shapes.toNormalArray(this.secondHandMesh);
        this.secondHandBigCircleNormals = Shapes.toNormalArray(this.secondHandBigCircleMesh);
        this.secondHandSmallCircleNormals = Shapes.toNormalArray(this.secondHandSmallCircleMesh);
        this.minuteHandNormals = Shapes.toNormalArray(this.minuteHandMesh);
        this.hourHandNormals = Shapes.toNormalArray(this.hourHandMesh);
    }

    /**
     * This function allows us to set the clock to any given date.
     */ 

    clock.prototype.setClock = function (date) {
        this.currentDate = date;
        this.secondAngle = (this.currentDate.getSeconds() + this.currentDate.getMilliseconds() * 0.001) * 6;
        this.minuteAngle = ((this.currentDate.getMinutes() + (this.currentDate.getSeconds() / 60)) * 6);
        this.hourAngle = (this.minuteAngle / 12) + (this.currentDate.getHours() * 30);
    }

    /**
     *  Helper function for computing tick transforms.
     */

    clock.prototype.tickTransform = function (i, radius) {
        var tickTransform = {};

        tickTransform = {
            tx: radius,
            tz: this.handDepth / 2,
            angle: i * 6,
            rotationVector: this.zAxisVector
        };

        return tickTransform;
    };

    /**
     *  Returns an array of tick objects ready to be drawn by WebGL.
     */  

    clock.prototype.tickObjectsWebGL = function () {
        var tickObjects = [],
            tickObject = {};

        for (i = 1; i < 61; i ++) {
            // Since every tick object has the same color and mode, assign it here.
            tickObject = {
                color: this.tickAndOtherHandsColor,
                mode: this.gl.TRIANGLES
            };

            if (i % 5 !== 0) {
                tickObject.name = i.toString() + " Minute Tick",
                tickObject.vertices = this.minuteTickVertices;
                tickObject.normals = this.minuteTickNormals;
                tickObject.transforms = this.tickTransform(i, 
                        this.radius - (this.minuteTickLength / 2) - this.tickOffset);
            } else {
                tickObject.name = (i / 5).toString() + " Hour Tick",
                tickObject.vertices = this.hourTickVertices;
                tickObject.normals = this.hourTickNormals;
                tickObject.transforms = this.tickTransform(i,
                        this.radius - (this.hourTickLength / 2) - this.tickOffset);
            }

            tickObjects.push(tickObject);
        }

        return tickObjects;
    };



    /**
     *  Returns a minute hand ready to be drawn by WebGL.
     */     

    clock.prototype.minuteHandWebGl = function () {
        return {
            name: "Minute Hand",
            color: this.tickAndOtherHandsColor,
            vertices: this.minuteHandVertices,
            mode: this.gl.TRIANGLES,
            normals: this.minuteHandNormals,
            transforms: {
                ty: this.radius - (this.minuteHandLength / 2) - this.minuteHandOffset,
                tz: this.minuteHandDepth,
                angle: this.minuteAngle,
                rotationVector: this.zAxisVector
            }
        }
    };

    /**
     *  Returns an hour hand ready to be drawn by WebGL.
     */  

    clock.prototype.hourHandWebGl = function () {
        return {
            name: "Hour Hand",
            color: this.tickAndOtherHandsColor,
            vertices: this.hourHandVertices,
            mode: this.gl.TRIANGLES,
            normals: this.hourHandNormals,
            transforms: {
                ty: this.radius - (this.hourHandLength / 2) - this.hourHandOffset,
                tz: this.hourHandDepth,
                angle: this.hourAngle,
                rotationVector: this.zAxisVector
            }
        }
    };

    /**
     *  Returns a second hand ready to be drawn by WebGL.
     */  

    clock.prototype.secondHandWebGL = function () {
        return {
            name: "Second Hand",
            color: this.secondHandColor,
            vertices: this.secondHandVertices,
            mode: this.gl.TRIANGLES,
            transforms: {
                ty: this.radius - (this.secondHandLength / 2) - this.secondHandOffset,
                tz: this.secondHandDepth,
                angle: this.secondAngle,
                rotationVector: this.zAxisVector
            },
            children: [
                {
                    name: "Big Red Circle",
                    color: this.secondHandColor,
                    vertices: this.secondHandBigCircleVertices,
                    mode: this.gl.TRIANGLES,
                    normals: this.secondHandBigCircleNormals,
                    transforms: {
                        ty: this.secondHandLength / 2
                    }
                },

                {
                    name: "Small Red Circle",
                    color: this.secondHandColor,
                    vertices: this.secondHandSmallCircleVertices,
                    mode: this.gl.TRIANGLES,
                    normals: this.secondHandSmallCircleNormals,
                    transforms: {
                        ty: -(this.radius - (this.secondHandLength / 2) - this.secondHandOffset)
                    }
                }          
            ]
        };
    };

    /**
     *  Returns a minute hand ready to be drawn by WebGL.
     */  

    clock.prototype.clockFaceWebGL = function () {
        return {
            name: "Clock Face",
            color: this.clockFaceColor,
            vertices: this.clockFaceVertices,
            mode: this.gl.TRIANGLES,
            normals: this.clockFaceNormals,
            transforms: {
                tz: this.clockFaceZDepth
            }
        }
    };

    /**
     * This creates a clock object ready to be sent to WegGl. It takes in a clock
     * object with all of the necessary information to draw the object.
     */

    clock.prototype.clockWebGL = function () {
        var clockObject = [];

        // Add the clock face to the array of clock objects.
        clockObject.push(this.clockFaceWebGL());

        // Add the ticks to the array of clock objects.
        tickObjects = this.tickObjectsWebGL();

        for (i = 0; i < tickObjects.length; i++) {
            clockObject.push(tickObjects[i]);
        }

        // Add the hour hand to the array of clock objects.
        clockObject.push(this.hourHandWebGl());

        // Add the minute hand to the array of clock objects.
        clockObject.push(this.minuteHandWebGl());

        // Add the second hand to the array of clock objects.
        clockObject.push(this.secondHandWebGL());

        return clockObject;
    };

        /**
     * This creates a clock object ready to be sent to WegGl. It takes in a clock
     * object with all of the necessary information to draw the object.
     */

    clock.prototype.clockHandsWebGL = function () {
        var clockHands = [];

        // Add the hour hand to the array of clock objects.
        clockHands.push(this.hourHandWebGl());

        // Add the minute hand to the array of clock objects.
        clockHands.push(this.minuteHandWebGl());

        // Add the second hand to the array of clock objects.
        clockHands.push(this.secondHandWebGL());

        return clockHands;
    };

    return clock;

})();