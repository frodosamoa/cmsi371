(function () {
    // declare all variables, including the height and width of the canvas
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width;
    
    // start the path and style the color   
    renderingContext.beginPath(); 
    renderingContext.strokeStyle = "#99FF99"; 
    
    // use a for loop to automate drawing lines 30 pixels apart from both axes
    // JD: Ideally, even loop variables should be declared in the
    //     var statement up top.
    for (var i = 0; i < width; i+=30) {
        renderingContext.moveTo(i,0);
        renderingContext.lineTo(i, height);
        renderingContext.moveTo(0, i);
        renderingContext.lineTo(width, i);
    }
    
    // stroke it in!
    renderingContext.stroke();

}());