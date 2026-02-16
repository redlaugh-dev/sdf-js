var drawContext;
const IMAGE_WIDTH = 4096; 
const IMAGE_HEIGHT = 4096;


window.onload = function() {
    const canvas = this.document.getElementById('cnv');
    drawContext = canvas.getContext('2d');

    const image = new Image(IMAGE_WIDTH,IMAGE_HEIGHT);
    image.onload = drawImage;
    image.src = "test.png"
    image.crossOrigin = "anonymous";
    
}

function drawImage() {
    drawContext.drawImage(this,0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
    imageData = drawContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    imageData2 = [...imageData.data];

    distanceField(imageData2, IMAGE_WIDTH, IMAGE_HEIGHT);
    tones(imageData2, IMAGE_WIDTH, IMAGE_HEIGHT, 0, 255, 0, 127);

    invert(imageData.data, IMAGE_WIDTH, IMAGE_HEIGHT);
    distanceField(imageData.data, IMAGE_WIDTH, IMAGE_HEIGHT);
    tones(imageData.data, IMAGE_WIDTH, IMAGE_HEIGHT, 255, 0, 0, 127);
    math(imageData.data, imageData2, IMAGE_WIDTH, IMAGE_HEIGHT);
    drawContext.putImageData(imageData, 0, 0);
}

function invert(imageData, width, height) {
    for (let i = 0; i < width * height * 4; i+=4) {
        imageData[i] = 255 - imageData[i];
        imageData[i + 1] = 255 - imageData[i + 1];
        imageData[i + 2] = 255 - imageData[i + 2];
    }
}


function distanceField(imageData, width, height) {
    const array = new Array(width * height);
    for (let i = 0; i < array.length; i++) {
        if(imageData[i * 4] == 255) {
            array[i] = 0;
        }
        else {
            array[i] = 9999;
        }
    }
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if(array[y * width + x] != 0) 
            array[y * width + x] = Math.min(array[(y - 1) * width + x - 1] + 2, array[(y - 1) * width + x] + 1,
                array[(y - 1) * width + x + 1] + 2, array[y * width + x - 1] + 1
            );
        }
    }
    for (let y = height - 2; y > 0; y--) {
        for (let x = width - 2; x > 0; x--) {
            if(array[y * width + x] != 0) 
            array[y * width + x] = Math.min(array[y * width + x + 1] + 1, array[(y + 1) * width + x - 1] + 2,
                array[(y + 1) * width + x] + 1, array[(y + 1) * width + x + 1] + 2, array[y * width + x]
            );
        }
    }
    for (let i = 0; i < array.length; i++) {
        let bright = 255 - array[i];
        if(bright < 0){
            bright = 0;
        }
        imageData[i * 4] = bright;
        imageData[i * 4 + 1] = bright;
        imageData[i * 4 + 2] = bright;
    }
}

function tones(imageData, width, height, inputMin, inputMax, outputMin, outputMax) {
    for (let i = 0; i < width * height * 4; i+=4) {
        const newValue = (imageData[i] - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
        imageData[i] = newValue;
        imageData[i + 1] = newValue;
        imageData[i + 2] = newValue;
    }
}

function math(imageData1, imageData2, width, height) {
    for (let i = 0; i < width * height * 4; i+=4) {
        const newValue = imageData1[i] + imageData2[i];
        imageData1[i] = newValue;
        imageData1[i + 1] = newValue;
        imageData1[i + 2] = newValue;
    }
}
