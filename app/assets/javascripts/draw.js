createSketchpad = function() {
    var sketchpad = Raphael.sketchpad("editor", {
        width: 640,
        height: 480,
        editing: true
    });
    return sketchpad;
}