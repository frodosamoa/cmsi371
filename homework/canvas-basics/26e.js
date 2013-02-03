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

    // JD: Per JavaScript semantics, all of these variables are actually "live"
    //     for the entire function, and so, even if they are only used within
    //     these loops, declaring them at the top (spaced out separately if you
    //     like, so that it is clear that they are used only in a particular
    //     section of the code) reflects their scope more accurately.
    for (var i = 0; i < 8; i++) {
        // JD: += 1 is preferred in JavaScript over ++.
        for (var j = 0; j < 8; j++) {
            var x = i*distance + offset;
            var y = j*distance;
            var radius = 15;
            var startAngle = 0;
            var endAngle = Math.PI*2;
            var counterClockwise = true;

            // JD: This way of formatting your if statement can lead to
            //     misunderstanding; ideally, always stick with:
            //
            // if (condition) {
            //     statement(s);
            // } else {
            //     statement(s);
            // }
            //
            if (j%2 == 0) offset = 0;
            else offset = distance/2;

            // JD: Your polka dots are separate entities---you should
            //     beginPath and fill *every time* before and after
            //     every arc.
            //
            //     This may have looked right in one browser, but try
            //     it in some others  :)  What I describe above (which
            //     matches your intent anyway) is the solution that works
            //     across the board.
            //renderingContext.beginPath();
            renderingContext.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            //renderingContext.fill();
        }
    }

    // fill in the circles!
    renderingContext.fill();

}());