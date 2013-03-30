var Matrix4x4 = (function () {
    // Define the constructor.
    var matrix4x4 = function () {
        this.elements = arguments.length ?
            [].slice.call(arguments) :

            [1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1];
    };

        var checkDimensions = function(m1, m2) {
            if(m1.dimensions() !== m2. dimensions()) {
                throw "Matrices have different dimensions"
            }
        };

    matrix4x4.getTranslationMatrix = function (tx, ty, tz) {
        return new Matrix4x4(
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        );
    };

    matrix4x4.getScaleMatrix = function (sx, sy, sz) {
        return new Matrix4x4(
            sx,  0,  0, 0,
             0, sy,  0, 0,
             0,  0, sz, 0,
             0,  0,  0, 1
        );
    };

    matrix4x4.getRotationMatrix = function (angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z)),
            s = Math.sin(angle * Math.PI / 180.0),
            c = Math.cos(angle * Math.PI / 180.0),
            oneMinusC = 1.0 - c,

            // We can't calculate this until we have normalized
            // the axis vector of rotation.
            x2, // "2" for "squared."
            y2,
            z2,
            xy,
            yz,
            xz,
            xs,
            ys,
            zs;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // *Now* we can calculate the other terms.
        x2 = x * x;
        y2 = y * y;
        z2 = z * z;
        xy = x * y;
        yz = y * z;
        xz = x * z;
        xs = x * s;
        ys = y * s;
        zs = z * s;

        // GL expects its matrices in column major order.
        return new Matrix4x4(
            (x2 * oneMinusC) + c, (xy * oneMinusC) - zs, (xz * oneMinusC) + ys, 0.0,
            (xy * oneMinusC) + zs, (y2 * oneMinusC) + c, (yz * oneMinusC) - xs, 0.0,
            (xz * oneMinusC) - ys, (yz * oneMinusC) + xs, (z2 * oneMinusC) + c, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    };

    matrix4x4.getOrthoMatrix = function (left, right, bottom, top, near, far) {
        var width = right - left,
            height = top - botom,
            depth = far - near;

            // This is statement check to see if the viewing volume is symmetric.
            // If it is it returns the matrix as the first Matrix instead of the second.
            if (r === -l && t === -b) {
                return new Matrix4x4 (
                        1.0 / right,       0.0,          0.0,                   0.0,
                                0.0, 1.0 / top,          0.0,                   0.0,
                                0.0,       0.0, -2.0 / depth, -(far + near) / depth,
                                0.0,       0.0,          0.0,                   0.0);
            } else {
                return new Matrix4x4 (
                        2.0 / width,          0.0,          0.0,  -(right + left) / width,
                                0.0, 2.0 / height,          0.0, -(top + bottom) / height,
                                0.0,          0.0, -2.0 / depth,    -(far + near) / depth,
                                0.0,          0.0,          0.0,                      0.0);                
            }
    };

    matrix4x4.getFrustumMatrix = function (left, right, bottom, top, near, far) {
        var width = right - left,
            height = top - botom,
            depth = far - near;

        // This is statement check to see if the viewing volume is symmetric.
        // If it is it returns the matrix as the first Matrix instead of the second.
        if (r === -l && t === -b) {
            return new Matrix4x4 (
                near / right,        0.0,                   0.0,                          0.0,
                         0.0, near / top,                   0.0,                          0.0,
                         0.0,        0.0, -(far + near) / depth,  (-2.0 * near * far) / depth,
                         0.0,        0.0,                  -1.0,                          0.0;
        } else {
            return new Matrix4x4 (
                2.0 * near / width,                 0.0,  (right + left) / width,                            0,
                               0.0, 2.0 * near / height, (top + bottom) / height,                            0,
                               0.0,                 0.0,   -(far + near) / depth,  (-2.0 * near * far) / depth,
                               0.0,                 0.0,                    -1.0,                          0.0;
        }
    }

    // Basic methods.
    matrix4x4.prototype.dimensions = function () {
        return this.elements.length;
    };

    matrix4x4.prototype.elements = function () {
        return this.elements;
    };

    matrix4x4.prototype.rows = function () {
        return this.elements.length / 4;
    }

    matrix4x4.prototype.columns = function () {
        return this.elements.length / 4;
    }

    matrix4x4.prototype.elementAt = function (index) {
        if (index < 0 || index > 15) {
            throw "Index out of bounds";
        }
        return this.elements[index];
    };

    matrix4x4.prototype.rowAt = function (index) {
        if (index < 0 || index > 3) {
            throw "Index out of bounds";
        }

        return [this.elements[0 + (index * 4)],
                this.elements[1 + (index * 4)],
                this.elements[2 + (index * 4)],
                this.elements[3 + (index * 4)]];
    };

    matrix4x4.prototype.columnAt = function (index) {
        if (index < 0 || index > 3) {
            throw "Index out of bounds";
        }

        return [this.elements[index],
                this.elements[index + 4],
                this.elements[index + 8],
                this.elements[index + 12]];
    };

    // Addition and subtraction.
    matrix4x4.prototype.add = function (m) {
        var result = new matrix4x4(),
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, m);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] + m.elements[i];
        }

        return result;
    };

    matrix4x4.prototype.subtract = function (m) {
        var result = new matrix4x4(),
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, m);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] - m.elements[i];
        }

        return result;
    };

    // Matrix multiplication. We do not need to check if the first matrix's width
    // is the same as the second's matrix's height since we are only dealing with
    // 4x4 matrices.
    matrix4x4.prototype.multiply = function (m) {
        var result = new Matrix4x4(),
            i,
            j,
            k,
            sum;

        // Dimensionality check.
        checkDimensions(this, m);

        for (i = 0; i < this.rows(); i += 1) {
            for (j = 0; j < m.columns(); j += 1) {
                sum = 0;
                for (k = 0; k < this.rows(); k += 1) {
                    sum += this.elementAt((i * 4) + k) * m.elementAt((k * 4) + j); 
                }
                console.log(sum);
                result.elements[(i * 4) + j] = sum;
            }
        }
        
        return result;
    };

    matrix4x4.prototype.convertToWebGL = function () {
        return this.columnAt(0).concat(
               this.columnAt(1).concat(
               this.columnAt(2).concat(
               this.columnAt(3))));
    };

    return matrix4x4;
})();
