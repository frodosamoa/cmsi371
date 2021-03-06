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

        deepEqual(m.rowAt(0),
            [0, 1, 2, 3],
            "Matrix first row by index");
        deepEqual(m.rowAt(1),
            [4, 5, 6, 7],
            "Matrix second row by index");
        deepEqual(m.rowAt(2),
            [8, 9, 10, 11],
            "Matrix third row by index");
        deepEqual(m.rowAt(3),
            [12, 13, 14, 15],
            "Matrix fourth row by index");

        deepEqual(m.columnAt(0),
            [0, 4, 8, 12],
            "Matrix first column by index");
        deepEqual(m.columnAt(1),
            [1, 5, 9, 13],
            "Matrix second column by index");
        deepEqual(m.columnAt(2),
            [2, 6, 10, 14],
            "Matrix third column by index");
        deepEqual(m.columnAt(3),
            [3, 7, 11, 15],
            "Matrix fourth column by index");

        // JD: Wow, now *that* is thorough!
        equal(m.elementAt(0),
            0,
            "Matrix first element");
        equal(m.elementAt(1),
            1,
            "Matrix second element");
        equal(m.elementAt(2),
            2,
            "Matrix third element");
        equal(m.elementAt(3),
            3,
            "Matrix fourth element");

        equal(m.elementAt(4),
            4,
            "Matrix fifth element");
        equal(m.elementAt(5),
            5,
            "Matrix sixth element");
        equal(m.elementAt(6),
            6,
            "Matrix seventh element");
        equal(m.elementAt(7),
            7,
            "Matrix eighth element");

        equal(m.elementAt(8),
            8,
            "Matrix ninth element");
        equal(m.elementAt(9),
            9,
            "Matrix tenth element");
        equal(m.elementAt(10),
            10,
            "Matrix eleventh element");        
        equal(m.elementAt(11),
            11,
            "Matrix twelth element");  

        equal(m.elementAt(12),
            12,
            "Matrix thirteenth element");        
        equal(m.elementAt(13),
            13,
            "Matrix fourteenth element");        
        equal(m.elementAt(14),
            14,
            "Matrix fifteenth element");        
        equal(m.elementAt(15),
            15,
            "Matrix sixteenth element");

    });

    test("Transformation, Scaling, and Rotation Matrices", function () {
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

        m = new Matrix4x4( 0,  1,  2,  3,
                           4,  5,  6,  7,
                           8,  9, 10, 11,
                          12, 13, 14, 15);
      
        m = Matrix4x4.getRotationMatrix(30, 0, 0, 1);
        deepEqual(m.elements,
            [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), 0, 0,
             Math.sin(Math.PI / 6),  Math.cos(Math.PI / 6), 0, 0,
                                 0,                      0, 1, 0,
                                 0,                      0, 0, 1],
            "Pure rotation matrix by 30 degrees about the z-axis");

        m = Matrix4x4.getRotationMatrix(270, 0, 1, 0);
        deepEqual(m.elements,
            [ Math.cos(3 * (Math.PI / 2)), 0, Math.sin(3 * (Math.PI / 2)), 0,
                                        0, 1,                           0, 0,
             -Math.sin(3 * (Math.PI / 2)), 0, Math.cos(3 * (Math.PI / 2)), 0,
                                        0, 0,                           0, 1],
            "Pure rotation matrix by 270 degrees about the y-axis");

        m = Matrix4x4.getRotationMatrix(87, 1, 0, 0);
        deepEqual(m.elements,
            [1,                            0,                             0, 0,
             0, Math.cos(87 * Math.PI / 180), -Math.sin(87 * Math.PI / 180), 0,
             0, Math.sin(87 * Math.PI / 180),  Math.cos(87 * Math.PI / 180), 0,
             0,                            0,                             0, 1],
            "Pure rotation matrix by 87 degrees about the x-axis");
    });

    // JD: How about getTransformMatrix?
    // JD 0502: And now getLookAtMatrix also?

    test("Matrix Projection", function () {
        var m = new Matrix4x4.getOrthoMatrix(-2, 2, -10, 10, -5, 5);
        equal(m.dimensions(), 16, "Pure matrix ortho projection size check");
        deepEqual(m.elements,
            [0.5,   0,    0, 0,
               0, 0.1,    0, 0,
               0,   0, -0.2, 0,
               0,   0,    0, 1],
            "Pure matrix ortho projection test");

        var m = Matrix4x4.getFrustumMatrix(-2, 2, -2, 2, -2, 2);
        equal(m.dimensions(), 16, "Pure matrix frustum projection size check");
        deepEqual(m.elements,
            [-1,  0,  0, 0,
              0, -1,  0, 0,
              0,  0,  0, 2,
              0,  0, -1, 0], 
            "Pure matrix frustum projection test");

        var m = Matrix4x4.getLookAtMatrix(-2, 2, -2, 2, -2, 2);
        console.log(m.elements);
        equal(m.dimensions(), 16, "Pure look at projection size check");
        deepEqual(m.elements,
            [-1,  0,  0, 0,
              0, -1,  0, 0,
              0,  0,  0, 2,
              0,  0, -1, 0], 
            "Pure look at projection test");
    });

    test("Matrix Multiplication", function () {
        var m1 = new Matrix4x4( 0,  1,  2,  3,
                                4,  5,  6,  7,
                                8,  9, 10, 11,
                               12, 13, 14, 15),
            m2 = new Matrix4x4( 0,  1,  2,  3,
                                4,  5,  6,  7,
                                8,  9, 10, 11,
                               12, 13, 14, 15),
            mresult = m1.multiply(m2);

        equal(mresult.dimensions(), 16, "Matrix multiply size check");
        deepEqual(mresult.elements,
            [ 56,  62,  68,  74,
             152, 174, 196, 218,
             248, 286, 324, 362,
             344, 398, 452, 506],
            "4x4 matrix multiplication first test");

        var m1 = new Matrix4x4(   3,  6,   9, 12,
                                 -1, -2,  -3, -4,
                                -10, 20, -30, 40,
                                 20, 40,  60, 80),
            m2 = new Matrix4x4(  20, 40,  60, 80,
                                  3,  6,   9, 12,
                                 -1, -2,  -3, -4,
                                -10, 20, -30, 40),
            mresult = m1.multiply(m2);
        deepEqual(mresult.elements,
            [ -51,  378,  -153,  756,
               17, -126,    51, -252,
             -510,  580, -1530, 1160,
             -340, 2520, -1020, 5040],
            "4x4 matrix multiplication second test");
    });

    test("Matrix Conversion and Convenience functions", function () {
        var m = new Matrix4x4(  0,  1,  2,  3,
                                4,  5,  6,  7,
                                8,  9, 10, 11,
                               12, 13, 14, 15);
            mconversion = m.columnOrder();

        equal(mconversion.length, m.dimensions(), "Matrix conversion size check");
        deepEqual(mconversion,
            [ 0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15] ,
            "Matrix conversion");
    });

});