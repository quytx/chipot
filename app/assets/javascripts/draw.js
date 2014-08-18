createSketchpad = function() {
    var sketchpad = Raphael.sketchpad("editor", {
        width: 640,
        height: 480,
        editing: true
    });
    return sketchpad;
}

startDrawing = function(pad) {
    $('#undo-button').on('click', function(e){
        pad.undo();
    });

    $('#clear-button').on('click', function(e){
        pad.clear();
    });

    $('#done-button').on('click', function(e){
        $('.metro').show();
        $('.draw').hide();
    });

    $('#black-button').on('click', function(e){
        pad.pen().color('#000000');
    });

    $('#blue-button').on('click', function(e){
        pad.pen().color('#0000FF');
    });

    $('#green-button').on('click', function(e){
        pad.pen().color('#00FF00');
    });

    $('#red-button').on('click', function(e){
        pad.pen().color('#FF0000');
    });
}