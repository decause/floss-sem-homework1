// Enums
var Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    Z: 90,
    X: 88,
    R: 82
}

var su = null;
var sources = [
    ["sounds/title.mp3", "audio/mp3"],
    ["sounds/title.ogg", "audio/ogg"]
    ];

    var Tools = {
        current: 4, // Default tool
        /* - */
        MOVE: 0,
        ZOOM_IN: 1,
        ZOOM_OUT: 2,
        DEMOLISH: 3,
        SELECT: 4,
        BUILD: 5
    }

window.onload = function () {

    var canvas = document.getElementById('gameCanvas');
    var game = document.getElementById('game');

    // Initialize the game object
    var g = new Game(canvas, game, 500, 500);

    if (!g.started) {
        return;
    }

    // Play the background music if sound is supported
    if (soundIsSupported()) {
        su.play(sources, 0, 156000, globalVolume, false);
    }

    var pointer = {
        DOWN: 'mousedown',
        UP: 'mouseup',
        MOVE: 'mousemove'
    };

    if (Modernizr.touch){
        pointer.DOWN = 'touchstart';
        pointer.UP = 'touchend';
        pointer.MOVE = 'touchmove';
    }

    // Set up the event listeners
    window.addEventListener('resize', function() { g.doResize(); }, false);
    canvas.addEventListener(pointer.DOWN, function(e) { g.handleMouseDown(e); }, false);
    canvas.addEventListener(pointer.MOVE, function(e) { g.handleDrag(e); }, false);
    document.body.addEventListener(pointer.UP, function(e) { g.handleMouseUp(e); }, false);

    if (Modernizr.touch){
        // Detect gestures
        document.body.addEventListener('gestureend', function(e) { g.handleGestureEnd(e); }, false);
    } else {
        document.body.addEventListener('keydown', function(e) { g.handleKeyDown(e); }, false);

        // Detect mousewheel scrolling
        document.body.addEventListener('mousewheel', function(e) { g.handleScroll(e); }, false);
        document.body.addEventListener('DOMMouseScroll', function(e) { g.handleScroll(e); }, false);
    }

    // Listen for GUI events
    var ui = document.getElementById('ui');
    ui.addEventListener(pointer.UP, function(e) {
        console.log(e.target.getAttribute('id'));
        console.log(e.target);
        switch(e.target.getAttribute('id')) {
            case 'panel-toggle':
                var panelContainer = document.getElementById('panel-container');
                var classes = panelContainer.getAttribute('class');

                if (classes != null && classes.length > 0) {
                    panelContainer.setAttribute('class', '');
                    document.getElementById('panel-toggle').innerHTML = 'Cancel';
                } else {
                    panelContainer.setAttribute('class', 'hidden');
                    document.getElementById('panel-toggle').innerHTML = 'Build';
                }
                break;
            case 'select':
                selectTool(Tools.SELECT, document.getElementById('select'));
                break;
            case 'move':
                selectTool(Tools.MOVE, document.getElementById('move'));
                break;
            case 'zoomIn':
                selectTool(Tools.ZOOM_IN, document.getElementById('zoomIn'));
                break;
            case 'zoomOut':
                selectTool(Tools.ZOOM_OUT, document.getElementById('zoomOut'));
                break;
            case 'rotate':
                g.rotateGrid();
                g.draw();
                break;
            case 'demolish':
                selectTool(Tools.DEMOLISH, document.getElementById('demolish'));
                break;
            default:
                if ((e.target.tagName === 'LI' || e.target.parentNode.tagName === 'LI')) {
                    var t = (e.target.tagName === 'LI') ? e.target : e.target.parentNode;
                    var props = t.getAttribute("id");
                    console.log('props ' + props);
                    switch(props){
                        case 'tile1':
                            var obj = new tile1();
                            break;
                        case 'tile2':
                            var obj = new tile2();
                            break;
                        case 'tile3':
                            var obj = new tile3();
                            break;
                    }
                    g.buildHelper.current = obj;
                    Tools.current = Tools.BUILD;
                    break;

                }
                // He didn't click on any option and actually click on an empty section of the UI, fallback to the canvas.
                e.srcElement = canvas;
                e.target = canvas;
                e.toElement = canvas;

                g.handleMouseDown(e);

                break;
        }
    }, false);
}

function soundIsSupported() {
    var a = new Audio();
    var failures = 0;


    for (var i = 0; i < sources.length; i++) {
        if (a.canPlayType(sources[i][1]) !== "maybe") {
            failures++;
        }
    }

    if (failures !== sources.length) {
        su = new SoundUtil();
            return true;
    } else {
        return false;
    }
}

function selectTool(tool, elem) {

    // Remove the "active" class from any element inside the div#tools ul
    for (var i = 0, x = elem.parentNode.childNodes.length; i < x; i++) {
        if (elem.parentNode.childNodes[i].tagName == "LI") {
            elem.parentNode.childNodes[i].className = null;
        }
    }

    elem.className += "active";

    switch(tool) {
        case Tools.SELECT:
            Tools.current = Tools.SELECT;
            break;
        case Tools.MOVE:
            Tools.current = Tools.MOVE;
            break;
        case Tools.ZOOM_IN:
            Tools.current = Tools.ZOOM_IN;
            break;
        case Tools.ZOOM_OUT:
            Tools.current = Tools.ZOOM_OUT;
            break;
        case Tools.DEMOLISH:
            Tools.current = Tools.DEMOLISH;
            break;
    }

}
