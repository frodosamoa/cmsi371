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
        // These variables are divided by two because I will be passing
        // the full lengths of each dimension of the hexahedron.
        var X = x / 2,
            Y = y / 2,
            Z = z / 2;

        return {
            vertices: [
                [ X, Y, Z ],
                [ X, Y, -Z ],
                [ -X, Y, -Z ],
                [ -X, Y, Z ],
                [ X, -Y, Z ],
                [ X, -Y, -Z ],
                [ -X, -Y, -Z ],
                [ -X, -Y, Z ]
            ],

            indices: [
                [ 0, 1, 3 ],
                [ 2, 3, 1 ],
                [ 0, 3, 4 ],
                [ 7, 4, 3 ],
                [ 0, 4, 1 ],
                [ 5, 1, 4 ],
                [ 1, 5, 6 ],
                [ 2, 1, 6 ],
                [ 2, 7, 3 ],
                [ 6, 7, 2 ],
                [ 4, 7, 6 ],
                [ 5, 4, 6 ]
            ]
        };
    },

    /**
     * Returns the vertices for a cylinder.
     */
    cylinder: function (radius, depth, radiusSegments) {
        var theta,
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

        // The top and bottom middle points of the cylinder are pushed first.
        vertices.push([0, 0, depthHalf]);
        vertices.push([0, 0, -depthHalf]);

        for (i = 0; i < radiusSegments; i += 1) {
            phi = (i * 2 * Math.PI) / radiusSegments;
            x = radius * Math.cos(phi);
            y = radius * Math.sin(phi);
            z = depthHalf;

            vertices.push([x, y, z]);
            vertices.push([x, y, -z]);
        }

        for (i = 1; i < radiusSegments + 1; i += 1) {
            indices.push([0, (i * 2), ((i * 2) + 2) % radiusSegments]);
            indices.push([1, (i * 2) + 1, ((i * 2) + 3) % radiusSegments]);
        }

        for (i = 2; i < radiusSegments * 2 + 2; i += 1) {
            if (i >= radiusSegments * 2) {
                if (i % 2 === 0) {
                    indices.push([i, (i+2) % radiusSegments, (i+1)]);
                } else {
                    indices.push([i, (i+1) % radiusSegments, (i+2) % radiusSegments]);
                } 
            } else {
                if (i % 2 === 0) {
                    indices.push([i, (i+2), (i+1)]);
                } else {
                    indices.push([i, (i+1), (i+2)]);
                }
            }
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
     * Utility function for computing normal vectors based on indexed vertices.
     * The secret: take the cross product of each triangle.  Note that vertex order
     * now matters---the resulting normal faces out from the side of the triangle
     * that "sees" the vertices listed counterclockwise.
     *
     * The vector computations involved here mean that the Vector module must be
     * loaded up for this function to work.
     *
     * Taken from GitHub user Dondi's bazaar/light-more-wegbgl/shapes.js file. Thanks Dondi!
     */
    toNormalArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj,
            p0,
            p1,
            p2,
            v0,
            v1,
            v2,
            normal;

        // For each face...
        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
            p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
            p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            v0 = new Vector(p0[0], p0[1], p0[2]);
            v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
            v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
            normal = v1.cross(v2).unit();

            // We then use this same normal for every vertex in this face.
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    },

};