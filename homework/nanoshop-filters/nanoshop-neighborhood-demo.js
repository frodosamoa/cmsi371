/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
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
    $("#apply-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                //NanoshopNeighborhood.averager     //commented out for easy switching
                //NanoshopNeighborhood.darkener
                //NanoshopNeighborhood.desaturater
                NanoshopNeighborhood.rgbinverter
            ),
            0, 0
        );
    });


}());