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

    matrix4x4.ortho = function () {

    };

    matrix4x4.frustum = function () {

    };

    // Basic methods.
    matrix4x4.prototype.dimensions = function () {
        return this.elements.length;
    };

    matrix4x4.prototype.elements = function () {
        return this.elements;
    };

    matrix4x4.prototype.elementAt = function (row, column) {
        if ((row < 0 || row > 4) || (column < 0 || column > 4)) {
            throw "Index out of bounds";
        }
        return this.elements[(row * 4) + column];
    };

    matrix4x4.prototype.setElementAt = function (row, column, value) {
        if ((row < 0 || row > 4) || (column < 0 || column > 4)) {
            throw "Index out of bounds";
        }
        this.elements[(row * 4) + column] = value;
    };

    matrix4x4.prototype.row = function (index) {
        if (index < 0 || index > 3) {
            throw "Index out of bounds";
        }

        return [this.elements[0 + (index * 4)],
                this.elements[1 + (index * 4)],
                this.elements[2 + (index * 4)],
                this.elements[3 + (index * 4)]];
    };

    matrix4x4.prototype.column = function (index) {
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
    
    Function.prototype.construct = function (aArgs) {
        var fConstructor = this, fNewConstr = function () { fConstructor.apply(this, aArgs); };
        fNewConstr.prototype = fConstructor.prototype;
        return new fNewConstr();
    };
    // Matrix multiplication. We do not need to check if the first matrix's width
    // is the same as the second's matrix's height since we are only dealing with
    // 4x4 matrices.
    matrix4x4.prototype.multiply = function (m) {
        var result,
            elements = [],
            i,
            j,
            k,
            matrixDimension = 4,
            sum;

        for (i = 0; i < matrixDimension; i += 1) {
            for (j = 0; j < matrixDimension; j += 1) {
                sum = 0;
                for (k = 0; k < matrixDimension; k += 1) {
                    sum += this.elementAt(i, k) * m.elementAt(k, j);
                }
                elements.push(sum);
            }
        }

        result = new matrix4x4.apply(this, elements);
        return result;
    };

    return matrix4x4;
})();
