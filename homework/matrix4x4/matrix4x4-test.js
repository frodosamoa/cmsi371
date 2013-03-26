/*
 * Unit tests for our Matrix4x4 object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var m1 = new Matrix4x4();
        deepEqual(m1.elements,
            [1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1],
            "Default matrix constructor");

        m = new Matrix4x4(  0,        1,       2,  3,
                           90,     1024,      67, 32,
                          123,  0.12345, Math.PI,  6,
                          3.2,   444444,       0,  7);
        deepEqual(m.elements,
            [  0,        1,       2,  3,
              90,     1024,      67, 32,
             123,  0.12345, Math.PI,  6,
             3.2,   444444,       0,  7],
            "Matrix constructor with passed values");

        m = new Matrix4x4( 0,  1,  2,  3,
                           4,  5,  6,  7,
                           8,  9, 10, 11,
                          12, 13, 14, 15);
        deepEqual(m.row(0),
            [0, 1, 2, 3],
            "Matrix first row by index");
        deepEqual(m.row(1),
            [4, 5, 6, 7],
            "Matrix second row by index");
        deepEqual(m.row(2),
            [8, 9, 10, 11],
            "Matrix third row by index");
        deepEqual(m.row(3),
            [12, 13, 14, 15],
            "Matrix fourth row by index");

        deepEqual(m.column(0),
            [0, 4, 8, 12],
            "Matrix first column by index");
        deepEqual(m.column(1),
            [1, 5, 9, 13],
            "Matrix second column by index");
        deepEqual(m.column(2),
            [2, 6, 10, 14],
            "Matrix third column by index");
        deepEqual(m.column(3),
            [3, 7, 11, 15],
            "Matrix fourth column by index");

    });

    test("Pure Transformation Matrices", function () {
        var m = Matrix4x4.getTranslationMatrix(5, 9, -1);
        deepEqual(m.elements,
            [1, 0, 0, 5,
             0, 1, 0, 9,
             0, 0, 1, -1,
             0, 0, 0, 1],
            "Pure translation matrix");

        m = Matrix4x4.getScaleMatrix(2, 5, 21);
        deepEqual(m.elements,
            [2, 0,  0, 0,
             0, 5,  0, 0,
             0, 0, 21, 0,
             0, 0,  0, 1],
            "Pure scale matrix");

        m = Matrix4x4.getRotationMatrix(30, 0, 0, 1);
        deepEqual(m.elements,
            [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), 0, 0,
             Math.sin(Math.PI / 6),  Math.cos(Math.PI / 6), 0, 0,
                                 0,                      0, 1, 0,
                                 0,                      0, 0, 1],
            "Rotation by 30 degrees about the z-axis");

        m = Matrix4x4.getRotationMatrix(270, 0, 1, 0);
        deepEqual(m.elements,
            [ Math.cos(3 * (Math.PI / 2)), 0, Math.sin(3 * (Math.PI / 2)), 0,
                                        0, 1,                           0, 0,
             -Math.sin(3 * (Math.PI / 2)), 0, Math.cos(3 * (Math.PI / 2)), 0,
                                        0, 0,                           0, 1],
            "Rotation by 270 degrees about the y-axis");

        m = Matrix4x4.getRotationMatrix(87, 1, 0, 0);
        deepEqual(m.elements,
            [1,                            0,                             0, 0,
             0, Math.cos(87 * Math.PI / 180), -Math.sin(87 * Math.PI / 180), 0,
             0, Math.sin(87 * Math.PI / 180),  Math.cos(87 * Math.PI / 180), 0,
             0,                            0,                             0, 1],
            "Rotation by  degrees about the x-axis");
    });


    test("Addition and Subtraction", function () {
        var m1 = new Matrix4x4(  0,       1,        2,  3,
                                90,     1024,      67, 32,
                               123,  0.12345, Math.PI,  6,
                               3.2,   444444,       0,  7),
            m2 = new Matrix4x4(  56,        8,    Math.cos(90),   3,
                                0.1,       45,              67,  32,
                                 13,   34 ^ 3,        -Math.PI,  42,
                                543,    11144, Math.pow(32, 4),   7);
            mresult = m1.add(m2);

            equal(mresult.dimensions(), 16, "Matrix sum size check");

            deepEqual(mresult.elements,
                [   56,        9, 1.55192638387083,  6,
                  90.1,     1069,              134, 64,
                   136, 33.12345,                0, 48,
                 546.2,   455588,          1048576, 14],
                "Matrix sum text")

        m1 = new Matrix4x4(   0,       1,       2,  3,
                             90,     1024,      67, 32,
                            123,  0.12345, Math.PI,  6,
                            3.2,   444444,       0,  7),
        m2 = new Matrix4x4(  56,        8,    Math.cos(90),   3,
                            0.1,       45,              67,  32,
                             13,   34 ^ 3,        -Math.PI,  42,
                            543,    11144, Math.pow(32, 4),   7);
        mresult = m1.subtract(m2);
        equal(mresult.dimensions(), 16, "Matrix difference size check");

        deepEqual(mresult.elements,
            [   -56,        -7, 2.4480736161291703,   0,
               89.9,       979,                  0,   0,
                110, -32.87655,  6.283185307179586, -36,
             -539.8,    433300,           -1048576,   0],
            "Matrix difference text")


    });

    test("Matrix Projection", function () {
        equal(0, 0, "0 is 0");
    });

    test("Matrix conversion and convenience functions", function () {
        var m1 = new Matrix4x4( 0,  1,  2,  3,
                                4,  5,  6,  7,
                                8,  9, 10, 11,
                               12, 13, 14, 15);
            m2 = new Matrix4x4( 0,  1,  2,  3,
                                4,  5,  6,  7,
                                8,  9, 10, 11,
                               12, 13, 14, 15);
            mresult = m1.multiply(m2);

        equal(mresult.dimensions(), 16, "Matrix multiply size check");
        deepEqual(mresult.elements,
            [ 56,  62,  68,  74,
             152, 174, 196, 218,
             248, 286, 324, 362,
             344, 398, 452, 506],
            "4x4 matrix multiplication");
    });

});