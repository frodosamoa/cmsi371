(function () {
    //declare all the variables
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width
        offset = 70,
        linearGradient = renderingContext.createLinearGradient(0, 0, 0, canvas.height);
        randomColor,
        randomHeight,
        i,
        k,
        k;

     
    // draw the sky and ground!
    linearGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    linearGradient.addColorStop(1, "rgba(0, 0, 150, 1)");
    renderingContext.fillStyle = linearGradient;      
    renderingContext.fillRect(0, 0, width, height);
    renderingContext.fillStyle = "rgb(45, 45, 45)";
    renderingContext.fillRect(0, 415, width, (height - 415);

    // add some random stars!
    renderingContext.fillStyle = "rgb(255,255,255)";
    for (i = 0; i < 10; i += 1) {
        randomX = Math.floor(Math.random() * width);
        randomY = Math.floor(Math.random() * height/2.5);
        renderingContext.fillRect(randomX, randomY, 1, 1);
    }

    // let's draw these buildings!
    // these buildings's height is randomized along with the intensity of the lights 
    for (i = 0; i < 7; i += 1) {
        renderingContext.fillStyle = "rgb(0,0,0)";   
        randomHeight = (Math.random()*height*0.5)+(height/4);
        renderingContext.fillRect(i*offset+20, height-randomHeight, 55, randomHeight);
        
        for (j = 0; j < 2; j += 1) {
            for (k = 0; k < randomHeight; k += 20) {
                randomColor = Math.floor(Math.random()*4);

                if (randomColor == 0) {
                    renderingContext.fillStyle = "rgb(255,255,0)";
                } else if (randomColor == 1) {
                    renderingContext.fillStyle = "rgb(153,153,0)";
                } else if (randomColor == 2) {
                    renderingContext.fillStyle = "rgb(33,33,0)";
                } else {
                    renderingContext.fillStyle = "rgb(0,0,0)";
                }

                renderingContext.fillRect((i * offset + 20) + 8 + j * 25,
                                           height - randomHeight + 8 + k, 15, 15);
            }
        } 
    }
}());