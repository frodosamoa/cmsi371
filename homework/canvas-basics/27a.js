(function () {
    // declare all variables
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");
        
    // this is a function for dotted lines, which was taken from:
    // http://vetruvet.blogspot.com/2010/10/drawing-dashed-lines-on-html5-canvas.html
    // thanks Valera!

    CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen) {
        if (dashLen == undefined) dashLen = 2;
    
        this.beginPath();
        this.moveTo(x1, y1);
    
        var dX = x2 - x1;
        var dY = y2 - y1;
        var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
        var dashX = dX / dashes;
        var dashY = dY / dashes;
    
        var q = 0;
        while (q++ < dashes) {
            x1 += dashX;
            y1 += dashY;
            this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
        }
        
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
    
        this.stroke();
        this.closePath();
    } 
   
    // declare the origin and the length of the side of the cube            
    var x               = 300,
        y               = 300,
        side            = 140; 
    
    // let's draw the cube!   
    renderingContext.beginPath();
    renderingContext.strokeStyle = "green";
    renderingContext.moveTo(x,y);
    renderingContext.lineTo(x+side,y);
    renderingContext.lineTo(x+side,y+side);
    renderingContext.lineTo(x,y+side);
    renderingContext.lineTo(x,y);
    renderingContext.lineTo(x+(side/2),y-(side/4));
    renderingContext.lineTo(x+(side/2)+side,y-(side/4));
    renderingContext.lineTo(x+(side/2)+side,y-(side/4)+side);
    renderingContext.lineTo(x+side,y+side);
    renderingContext.moveTo(x+side,y);
    renderingContext.lineTo(x+(side/2)+side,y-(side/4));
    renderingContext.stroke();

    // put in the dotted lines
    renderingContext.dashedLine(x,y+side,x+(side/2),y+side-(side/4), 4);
    renderingContext.dashedLine(x+(side/2),y+side-(side/4),x+(side/2),y-(side/4), 4);
    renderingContext.dashedLine(x+(side/2),y+side-(side/4),x+(side/2)+side,y-(side/4)+side, 4);    
    renderingContext.closePath();
}());