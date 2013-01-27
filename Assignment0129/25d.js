(function () {
    //declare all the variable, including an origin
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        origin = { x:100, y:50 };
    
    // make the hexagon, using the origin as an "anchor"  
    renderingContext.beginPath();     
    renderingContext.moveTo(origin.x, origin.y);
    renderingContext.lineTo(origin.x+100, origin.y);
    renderingContext.lineTo(origin.x+158, origin.y+81);
    renderingContext.lineTo(origin.x+100, origin.y+162);
    renderingContext.lineTo(origin.x, origin.y+162);
    renderingContext.lineTo(origin.x-58, origin.y+81);
    renderingContext.lineTo(origin.x, origin.y);
    
    // style the hexagon
    renderingContext.fillStyle = "brown";
    renderingContext.fill();

}());