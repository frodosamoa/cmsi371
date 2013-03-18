(function () {
    // declare all variables, including the height and width of the canvas
    // and distance between the polka-dots and the offset between the following line
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        distance = 73,
        offset = 0,
        i,
        j,
        x,
        y,
        radius,
        startAngle,
        endAngle,
        counterClockwise;
        
    // make the brown background
    renderingContext.fillStyle = "#663300";      
    renderingContext.fillRect(0, 0, 512, 512);
    
    // begin the path and set the color of the circles to pink!   
    renderingContext.beginPath(); 
    renderingContext.fillStyle = "pink";
    
    // these nested for loops draw the circles
    for (i = 0; i < 8; i += 1) {            // the i represents how many "columns" of circles there will be
        for (j = 0; j < 8; j += 1) {        // the j represents how many "rows" of circles there will be
            x = i * distance + offset;      // the offset is so that the circles don't simply look like a grid
            y = (j * distance;              // the offset is changed depending on if it is on an even or odd row number
            radius = 15;
            startAngle = 0;
            endAngle = Math.PI*2;
            counterClockwise = true;

            if (j%2 == 0) {
                offset = 0;
            } else { 
                offset = distance/2;
            }
            
            renderingContext.beginPath();
            renderingContext.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            renderingContext.fill();
        }
    }

    // fill in the circles!
    renderingContext.fill();

}());