(function () {
    // declare all variables
    var canvas           = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height           = canvas.height,
        width            = canvas.width,
        radialGradient   = renderingContext.createRadialGradient(210, 210, 1, 230, 230, 350),
        x                = 180,
        y                = 100,
        height           = 150,
        distanceBetween  = 150,
        xShifted         = x + distanceBetween,
        change;
    
    // draw the big smiley circle, with a black border
    renderingContext.beginPath();
    renderingContext.fillStyle = "#FFFF33";
    renderingContext.strokeStyle = "black";
    renderingContext.lineWidth = 2;
    renderingContext.arc((width / 2), (height / 2), 250, 0, Math.PI*2, true);
    renderingContext.closePath();
    renderingContext.fill();
    renderingContext.stroke();
    
    // let's draw the eyes!
    // declare all the variables necessary for the eyes, point of origin, height, distance between the two
    // the same of line of code is used for each eye which is located in the for loop
    renderingContext.beginPath();
    renderingContext.fillStyle = "rgb(0, 0, 0)";

    for (var i = 0; i < 2; i += 1) {
        change = (i == 0) ? x : xShifted;
        renderingContext.moveTo(change, y);
        renderingContext.bezierCurveTo(change + (height / 5.5), y,
                                       change + (height / 5.5), y + height, change, y + height);
        renderingContext.bezierCurveTo(change - (height / 5.5), y + height,
                                       change - (height / 5.5), y, change, y);
    }

    renderingContext.closePath();
    renderingContext.fill();
   
    // let's draw the mouth!
    // first, the "lips", which is simply two half ovals
    // the first half oval is black
    renderingContext.beginPath();
    renderingContext.moveTo(118, 355);
    renderingContext.bezierCurveTo(135, 450, 370, 450, 387, 355);
    renderingContext.closePath();
    renderingContext.fill();
    
    //the second half oval is yellow and stacked on top of it
    renderingContext.beginPath();
    renderingContext.fillStyle = "#FFFF33";
    renderingContext.moveTo(125, 350);
    renderingContext.bezierCurveTo(135, 435, 370, 435, 380, 350);
    renderingContext.closePath();
    renderingContext.fill();

    // then the left corner of the mouth
    // translate the the canvas to make rotation easier
    renderingContext.beginPath();
    renderingContext.fillStyle = "rgb(0, 0, 0)";
    renderingContext.save()
    renderingContext.translate(140, 350);
    renderingContext.rotate((64 * Math.PI) / 180);
    renderingContext.moveTo(0, 0);
    renderingContext.bezierCurveTo(8, 0, 8, 40, 0, 40);
    renderingContext.bezierCurveTo(-8, 40, -8, 0, 0, 0);    
    renderingContext.restore();
    renderingContext.closePath();
    renderingContext.fill();

    // then the right corner of the mouth
    // translate the the canvas to make rotation easier
    renderingContext.beginPath();
    renderingContext.save();
    renderingContext.translate(365, 350);
    renderingContext.rotate((296 * Math.PI) / 180);
    renderingContext.moveTo(0, 0);
    renderingContext.bezierCurveTo(8, 0, 8, 40, 0, 40);
    renderingContext.bezierCurveTo(-8, 40, -8, 0, 0, 0);
    renderingContext.restore();    
    renderingContext.closePath();
    renderingContext.fill();
      
    // here the radial gradient to make it look 3D
    renderingContext.beginPath();
    renderingContext.fillStyle = radialGradient;
    renderingContext.translate(0, 0);
    radialGradient.addColorStop(0, "rgba(255, 255, 255, 0.0)");
    radialGradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    renderingContext.arc(256, 256, 250, 0, Math.PI*2, true);
    renderingContext.closePath();
    renderingContext.fill();

    // bloodstain?
    // JD: LOL I see what you are gunning for there :)
}());