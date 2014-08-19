createSketchpad = function() {
    var sketchpad = Raphael.sketchpad("editor", {
        width: 640,
        height: 480,
        editing: true
    });
    return sketchpad;
}

startDrawing = function(pad) {
    $('#undo-button').on('click', function(e) {
        pad.undo();
    });

    $('#clear-button').on('click', function(e) {
        pad.clear();
    });

    $('#done-button').on('click', function(e) {
        $('.metro').show();
        $('.draw').hide();
    });

    $('#black-button').on('click', function(e) {
        pad.pen().color('#000000');
    });

    $('#blue-button').on('click', function(e) {
        pad.pen().color('#0000FF');
    });

    $('#green-button').on('click', function(e) {
        pad.pen().color('#00FF00');
    });

    $('#red-button').on('click', function(e) {
        pad.pen().color('#FF0000');
    });

    $('#save-button').on('click', function(e) {
        // Canvas2Image.saveAsPNG(document.getElementById("myCanvas"));
        var e = document.getElementById("editor");
        var newCanvas = document.getElementById('newCanvas');
        canvg(newCanvas, e.firstChild.outerHTML);

        // add background image
        var imgURL = $('#street-view-image').attr("src");
        var layer2 = document.getElementById('layer2'), context = layer2.getContext('2d');
        base_image = new Image();
        base_image.src = imgURL;
        console.log(imgURL);
        base_image.crossOrigin = "Anonymous";
        base_image.onload = function(){
            context.drawImage(base_image, 0, 0);
            context.drawImage(newCanvas, 0, 0);
        }

        $('.metro').show();
        $('.draw').hide();
        $('#saveImage').show();
        $('#layer2').show();    
    });
}