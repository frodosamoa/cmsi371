/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {

    /*
     * Returns the vertices for a small sphere.
     */
    cube: function () {
        var X = 0.5,
            Y = 0.5,
            Z = 0.5;

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

    /*
     * Returns the vertices for a small sphere.
     */
    cross: function () {
        var X  = 0.2,
            X2 = 0.45,
            Y  = 0.2,
            Y2 = 0.45,
            Z  = 0.1;


        return {
            vertices: [
                [X, Y, Z],
                [X, Y2, Z],
                [X, -Y, Z],
                [X, -Y2, Z],
                [-X, Y, Z],
                [-X, Y2, Z],
                [-X, -Y, Z],
                [-X, -Y2, Z],
                [X2, Y, Z],
                [X2, -Y, Z],
                [-X2, Y, Z],
                [-X2, -Y, Z],
                [X, Y, -Z],
                [X, Y2, -Z],
                [X, -Y, -Z],
                [X, -Y2, -Z],
                [-X, Y, -Z],
                [-X, Y2, -Z],
                [-X, -Y, -Z],
                [-X, -Y2, -Z],
                [X2, Y, -Z],
                [X2, -Y, -Z],
                [-X2, Y, -Z],
                [-X2, -Y, -Z]
            ],

            indices: [
                [1, 13, 17, 5],
                [10, 11, 23, 22],
                [8, 9, 21, 20],
                [3, 7, 19, 15],
                [0, 1],
                [1, 5],
                [2, 3],
                [2, 9],
                [3, 7],
                [4, 5],
                [4, 10],
                [6, 7],
                [6, 11],
                [8, 0],
                [10, 11],
                [12, 13],
                [14, 15],
                [14, 21],
                [16, 17],
                [16, 22],
                [18, 19],
                [18, 23],
                [20, 12],
                [0, 12],
                [1, 13],
                [2, 14],
                [3, 15],
                [4, 16],
                [5, 17],
                [6, 18],
                [8, 20],
                [9, 21],
                [10, 22]
            ]
        };
    },

    /*
     * Returns the vertices for a small sphere.
     */
    sphere: function (latitudeBelts, longitudeBelts) {
        var radius = 0.8,
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
            k,
            l,
            sphereData = {};

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