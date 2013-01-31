(function () {
    //declare all the variables
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");
     
    // makes the blue square 
    renderingContext.fillStyle = "blue";      
    renderingContext.fillRect(100, 100, 100, 100);
}());