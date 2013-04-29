/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {

    /*
     * Returns the vertices for a six sided three dimensional hexahedron.
     */
    hexahedron: function (x, y, z) {
        var X = x,
            Y = y,
            Z = z;

        return {
            vertices: [
                [X, Y, Z],
                [X, Y, -Z],
                [X, -Y, Z],
                [X, -Y, -Z],
                [-X, Y, Z],
                [-X, Y, -Z],
                [-X, -Y, Z],
                [-X, -Y, -Z]
            ],

            indices: [
                [0, 1, 3],
                [2, 0, 3],
                [7, 2, 3],
                [6, 7, 2],
                [4, 0, 2],
                [6, 4, 2],
                [5, 1, 7],
                [1, 3, 7],
                [4, 5, 7],
                [6, 4, 7],
                [4, 5, 0],
                [5, 1, 0]
            ]
        };
    },

    /**
     * Returns the vertices for a cylinder.
     */
    cylinder: function (radius, depth, radiusSegments) {
        var radius = radius,
            height = height,
            theta,
            radiusSegments = radiusSegments,
            i,
            j,
            x,
            y,
            z,
            top,
            bottom,
            vertices = [],
            indices = []
            cylinderData = {},
            depthHalf = depth / 2;

        // The "top" cap of the cylinder.
        vertices.push([0, 0, depthHalf]);
        vertices.push([0, 0, -depthHalf]);

        for (i = 0; i < radiusSegments + 1; i += 1) {
            phi = (i * 2 * Math.PI) / radiusSegments;
            x = radius * Math.cos(phi);
            y = radius * Math.sin(phi);
            z = depthHalf;

            vertices.push([x, y, z]);
            vertices.push([x, y, -z]);
        }


        for (i = 1; i < radiusSegments + 1; i += 1) {
            indices.push([0, (i * 2), (i * 2) + 2]);
            indices.push([1, (i * 2) + 1, (i * 2) + 3]);
        }

        for (i = 0; i < radiusSegments * 2 + 1; i += 1) {
                indices.push([i, i+1, i+2]);
                indices.push([i+2, i+3, i+4]);
        }

        cylinderData.vertices = vertices;
        cylinderData.indices = indices;

        return cylinderData;

    },

    /*
     * Returns the vertices for a small sphere.
     */
    sphere: function (radius, latitudeBelts, longitudeBelts) {
        var radius = radius,
            theta,
            sinTheta,
            cosTheta,
            phi,
            latBelts = latitudeBelts,
            longBelts = longitudeBelts,
            vertices = [],
            indices = [],
            top,
            bottom,
            x,
            y,
            z,
            i,
            j,
            sphereData = {};

        // This creates the vertices for the circle.
        for (i = 0; i < latBelts + 1; i += 1) {
            theta = (i * Math.PI) / latBelts;
            sinTheta = Math.sin(theta);
            cosTheta = Math.cos(theta);

            for (j = 0; j < longBelts + 1; j += 1) {
                phi = (j * 2 * Math.PI) / longBelts;
                x = radius * Math.cos(phi) * sinTheta;
                y = radius * cosTheta;
                z = radius * Math.sin(phi) * sinTheta;

                vertices.push([x, y, z]);
            }
        }

        // This creates the indices for the circle.
        for (i = 0; i < latBelts + 1; i += 1) {
            for (j = 0; j < longBelts + 1; j += 1) {
                top = (i * (longBelts + 1)) + j;
                bottom = top + longBelts + 1;

                indices.push([top, bottom, top + 1]);
                indices.push([bottom, bottom + 1, top + 1]);
            }
        }

        sphereData.vertices = vertices;
        sphereData.indices = indices;
        return sphereData;
    },

    /*
     * Returns the vertices for a small icosahedron.
     */
    icosahedron: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606,
            Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    },

    /*
     *
     * 
     */
    toRawPointArray: function (indexedVertices) {
        var result = [],
            i,
            maxi;

        for (i = 0, maxi = indexedVertices.vertices.length; i < maxi; i += 1) {
            result = result.concat(indexedVertices.vertices[i]);
        }

        return result;
    }

};