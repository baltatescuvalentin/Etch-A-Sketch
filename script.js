window.onload = () => {
    buildCanvas(1);
};

var slider = document.querySelector('#slider');
var canvas = document.getElementById('canvas');
var sliderText = document.querySelector('#slider_value');
var clearBtn = document.getElementById('clear_btn');
var sliderValue = 0;
var colorBtn = document.getElementById('color_btn');
var placeholderColorBtn = document.querySelector('.color_btn');
var shadingBtn = document.getElementById('shading_btn');
var eraseBtn = document.getElementById('erase_btn');
var rainbowBtn = document.getElementById('rainbow_btn');
var lightenBtn = document.getElementById('lighten_btn');
var minWidth = 0;
var globalColor = "#000000";
var gridItems, gridItemLength;
var action = 0;

function updateSlider(e) {
    sliderValue = e.target.value;
    action = 0;
    sliderText.textContent = `${sliderValue} x ${sliderValue}`;
}

function buildCanvas(sliderValue) {

    var width = document.getElementById('canvas').style.width;
    var height = document.getElementById('canvas').style.height;
    var h = window.getComputedStyle(document.getElementById("canvas"), null);
    var h2 = h.getPropertyValue('height');
    console.log(h2);
    var h3 = minWidth ? '300' : h2.slice(0, 3);
    console.log(h3);
    dimension = parseInt(h3) / parseInt(sliderValue);
    canvas.style.gridTemplateColumns = `repeat(${sliderValue}, ${dimension}px`;
    canvas.style.gridTemplateRows = `repeat(${sliderValue}, ${dimension}px`;

    for(let i = 0; i < (sliderValue*sliderValue); i++) {
        var square = document.createElement('div');
        square.classList.add('grid-item');
        square.onclick = function() {
            draw(this, action);
        };
        canvas.appendChild(square);
    }

    gridItems = document.getElementsByClassName('grid-item');
    gridItemLength = gridItems.length;
}

function emptyCanvas(myNode) {
    for(let i = 0; i < myNode.children.length; i++) {
        myNode.children[i].style.backgroundColor = "#FFFFFF";
      }
}

function makeCanvas(e) {
    emptyCanvas(canvas);
    updateSlider(e);
    buildCanvas(sliderValue);
}

function changeColor(e) {
    globalColor = e.target.value;
    placeholderColorBtn.style.background = globalColor;
    action = 0;
}

function getRGB(rgb) {
    return rgb = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


// not correct formula
// function lighten(r, g, b, correction) {
//     var red = Math.min(255, r + 255*correction);
//     var green = Math.min(255, g + 255*correction);
//     var blue = Math.min(255, b + 255*correction);

//     return [parseInt(red), parseInt(blue), parseInt(green)];
// }

function lighten(col, amt) {
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return '#' + (g | (b << 8) | (r << 16)).toString(16);

}


function darken(r, g, b, correction) {
    var red = (1 - correction) * r;
    var green = (1 - correction) * g;
    var blue = (1 - correction) * b;

    return [parseInt(red), parseInt(blue), parseInt(green)];
}

function draw(e, action) {

    if(action == 0) {
        e.style.backgroundColor = globalColor;
        var rgb = getRGB(e.style.backgroundColor.toString());
    }
    else if(action == 1) {
        e.style.backgroundColor = "#ffffff";
    }
    else if(action == 2) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        e.style.backgroundColor = "#" + randomColor;
    }
    else if(action == 3) {
        var rgb = getRGB(e.style.backgroundColor.toString());
        var [r, g, b] = darken(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]), 0.15);
        var hex = rgbToHex(r, g, b);
        e.style.backgroundColor = hex;
    }
    else if(action == 4) {
        // var rgb = getRGB(e.style.backgroundColor.toString());
        // var [r, g, b] = lighten(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]), 0.2);
        // var hex = rgbToHex(r, g, b);
        var rgb = getRGB(e.style.backgroundColor.toString());
        var hexCode = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));

        var hex = lighten(hexCode, 20);
        e.style.backgroundColor = hex;
    }
}



slider.addEventListener('input', updateSlider);
slider.addEventListener('input', makeCanvas);
clearBtn.addEventListener('click', () => emptyCanvas(canvas));
colorBtn.addEventListener('input', changeColor);
eraseBtn.addEventListener('click', () => {
    action = 1;
});
rainbowBtn.addEventListener('click', () => {
    action = 2;
});
shadingBtn.addEventListener('click', () => {
    action = 3;
});
lightenBtn.addEventListener('click', () => {
    action = 4;
});

window.onresize(() => {
    minWidth = window.innerHeight < 720;
})