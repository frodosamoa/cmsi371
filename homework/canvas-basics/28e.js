(function () {
    //declare all the variables
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width
        offset = 70,
        linearGradient = renderingContext.createLinearGradient(0, 0, 0, canvas.height);
     
    // draw the sky and ground!
    linearGradient.addColorStop(0, "rgba(0,0,0,1)");
    linearGradient.addColorStop(1, "rgba(0,0,150,1)");
    renderingContext.fillStyle = linearGradient;      
    renderingContext.fillRect(0,0,width,height);
    renderingContext.fillStyle = "rgb(45,45,45)";
    renderingContext.fillRect(0,415,width,height-415);

    // add some random stars!
    renderingContext.fillStyle = "rgb(255,255,255)";
    for (var i = 0; i < 10; i++) {
        randomX = Math.floor(Math.random()*width);
        randomY = Math.floor(Math.random()*height/2.5);
        renderingContext.fillRect(randomX, randomY, 1, 1);
    }

    // let's draw these buildings!
    // these buildings's height is randomized along with the intensity of the lights 
    for (var i = 0; i < 7; i++) {
        renderingContext.fillStyle = "rgb(0,0,0)";   
        var randomHeight = (Math.random()*height*0.5)+(height/4);
        renderingContext.fillRect(i*offset+20, height-randomHeight, 55, randomHeight);
        
        for (var j = 0; j < 2; j++) {
            for (var k = 0; k < randomHeight; k+=20) {
                var randomColor = Math.floor(Math.random()*4);

                // JD: Even for 1-line clauses, it is more readable to
                //     (a) always use braces and (b) start the clauses
                //     on new lines:
                //
                // if (condition) {
                //     statement;
                // } else if (condition) {
                //     statement;
                // } else if (condition) {
                //     statement;
                // } else {
                //     statement;
                // }
                //
                if (randomColor == 0) renderingContext.fillStyle = "rgb(255,255,0)";
                else if (randomColor == 1) renderingContext.fillStyle = "rgb(153,153,0)";
                else if (randomColor == 2) renderingContext.fillStyle = "rgb(33,33,0)";
                else renderingContext.fillStyle = "rgb(0,0,0)";

                // JD: This guy is screaming for better spacing and
                //     multiline formatting!
                renderingContext.fillRect((i*offset+20)+8+j*25, height-randomHeight+8+k, 15, 15);
            }
        } 
    }
}());