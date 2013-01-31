(function () {
    // declare all variables, including the height and width of the canvas
    // and distance between the polka-dots and the offset between the following line
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        distance = 73,
        offset = 0;
        
    // make the brown background
    renderingContext.fillStyle = "#663300";      
    renderingContext.fillRect(0, 0, 512, 512);
    
    // begin the path and set the color of the circles to pink!   
    renderingContext.beginPath(); 
    renderingContext.fillStyle = "pink";
    
    // these nested for loops draw the circles
    // the i represents how many "columns" of circles there will be
    // the j represents how many "rows" of circles there will be
    // the offset is so that the circles don't simply look like a grid
    // the offset is changed depending on if it is on an even or odd row number 
    for (var i = 0; i < 8; i++){
        for (var j = 0; j < 8; j++) {
            var x = i*distance + offset;
            var y = j*distance;
            var radius = 15;
            var startAngle = 0;
            var endAngle = Math.PI*2;
            var counterClockwise = true;
            
            if (j%2 == 0) offset = 0;
            else offset = distance/2;

            renderingContext.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        }
    }

    // fill in the circles!
    renderingContext.fill();

}());