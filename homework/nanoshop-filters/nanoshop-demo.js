/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */
(function () {
    var canvas = $("#picture")[0],
        renderingContext = canvas.getContext("2d"),
        gradient;

    // I draw 9 different squares here with varying levels of
    // rgb values to demonstrate the filters.
    renderingContext.fillStyle = "rgb(255, 0,127)";
    renderingContext.fillRect(6, 6, 160, 160);
    renderingContext.fillStyle = "rgb(127, 255, 0)";
    renderingContext.fillRect(172, 6, 160, 160);
    renderingContext.fillStyle = "rgb(0, 127, 255)";
    renderingContext.fillRect(338, 6, 160, 160);    

    renderingContext.fillStyle = "rgb(127, 127, 0)";
    renderingContext.fillRect(6, 172, 160, 160);
    renderingContext.fillStyle = "rgb(0, 127, 127)";
    renderingContext.fillRect(172, 172, 160, 160);
    renderingContext.fillStyle = "rgb(127, 0, 127)";
    renderingContext.fillRect(338, 172, 160, 160);

    renderingContext.fillStyle = "rgb(63, 0, 127)";
    renderingContext.fillRect(6, 338, 160, 160);
    renderingContext.fillStyle = "rgb(127, 63, 0)";
    renderingContext.fillRect(172, 338, 160, 160);
    renderingContext.fillStyle = "rgb(0, 127, 63)";
    renderingContext.fillRect(338, 338, 160, 160);

    // Set a little event handler to apply the filter.
    $("#apply-darkener-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // This is a basic "darkener."
                function (r, g, b, a) {
                    return [r * 0.5, g * 0.5, b * 0.5, a];
                }
            ),
            0, 0
        );
    });    

    // JD: Generally nice work, but the expectation was for you to place
    //     your filter code in the Nanoshop object, as requested in the
    //     assignment and done in NanoshopNeighborhood.
    $("#apply-lightener-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // This is a basic "lightener."
                function (r, g, b, a) {
                    return [r * 2, g * 2, b * 2, a];
                }
            ),
            0, 0
        );
    });

    $("#apply-rotateleft-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // This "rotates" the rgb values by placing each values one spot to its left.
                function (r, g, b, a) {
                    return [g, b, r, a];
                }
            ),
            0, 0
        );
    });

    $("#apply-rotateright-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // This "rotates" the rgb values by placing each values one spot to its right.
                function (r, g, b, a) {
                    return [b, r, g, a];
                }
            ),
            0, 0
        );
    });

}());