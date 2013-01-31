(function () {
    //declare all the variables
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        offset = 70,
        linearGradient1 = renderingContext.createLinearGradient(0, 0, 0, height),
        linearGradient2 = renderingContext.createLinearGradient(0, 0, 0, height),
        linearGradient3 = renderingContext.createLinearGradient(0, 200, 0, height);
    
    // draw the sky!
    linearGradient1.addColorStop(0, "rgba(0,0,0,1)");
    linearGradient1.addColorStop(1, "rgba(0,200,0,1)");
    renderingContext.fillStyle = linearGradient1;      
    renderingContext.fillRect(0,0,width,height);
    
    //draw the sun!
    renderingContext.beginPath();
    var x = width/2;
    var y = height/2-50;
    var radius = 75;
    var startAngle = 0;
    var endAngle = Math.PI*2;
    var counterClockwise = true;
    renderingContext.fillStyle = "rgb(255,100,51)";   
    renderingContext.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    renderingContext.closePath();
    renderingContext.fill();
     
    // draw the ocean!
    linearGradient2.addColorStop(0, "rgba(0,0,200,1)");
    linearGradient2.addColorStop(1, "rgba(0,0,0,1)");
    renderingContext.fillStyle = linearGradient2;      
    renderingContext.fillRect(0,300,width,height-300);
    
    //draw the sun's relflection
    renderingContext.beginPath();
    linearGradient3.addColorStop(0, "rgba(250,100,51,1)");
    linearGradient3.addColorStop(1, "rgba(0,0,0,1)"); 
    renderingContext.fillStyle = linearGradient3;   
    renderingContext.moveTo(width/2-radius,height)
    renderingContext.bezierCurveTo(width/2-radius,300,width/2+radius,300,width/2+radius,height);
    renderingContext.closePath();
    renderingContext.fill();

}());