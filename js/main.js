var canvas = $("#canvasWrapper");
var side = $("#countDownWrapper");
canvas.width($(window).width()*0.7).height($(window).height());
side.width($(window).width()*0.29).height($(window).height());

var end = 'April 01 2017 08:00:00 GMT+0530';
getRemainingTime = function(date){
    var t = Date.parse(date) - Date.parse(new Date());
    var seconds = Math.floor((t/1000)%60);
    var minutes = Math.floor((t/1000/60)%60);
    var hours = Math.floor((t/(1000*60*60)%24));
    var days = Math.floor((t/(1000*60*60*24)));
    var months = Math.floor(days/30);
    days = days - months*30;
    return {
        'total':t,
        'months':months,
        'days':days,
        'hours':hours,
        'minutes':minutes,
        'seconds':seconds
    }
};
var monthsCnt = $("#months span");
var daysCnt = $("#days span");
var hoursCnt = $("#remTime #hrs");
var minutesCnt = $("#remTime #min");
var secondsCnt = $("#remTime #sec");

var a = setInterval(function(){
    var data = getRemainingTime(end);
    monthsCnt.html(data.months);
    daysCnt.html(data.days);
    hoursCnt.html(data.hours);
    minutesCnt.html(data.minutes);
    secondsCnt.html(data.seconds);
},1000);



//// 1. Define Space and Form
var colors = {
    a1: "#ff2d57", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
    b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var space = new CanvasSpace("demo", "#111").display();
var form = new Form(space);


//// 2. Create Elements
var pts = [];
var lines = [];
var counter = 0;
var minPts = 50;


function populationControl() {

    // reduce population when there are too many, and as time passes
    if (pts.length > 500) pts.shift();
    if (counter++ % 20 == 0 && pts.length >= minPts) pts.shift();

    // increase population when there are too few
    if (pts.length < minPts) {
        for (var i = pts.length; i < minPts; i++) {
            pts.push(new Vector(space.size.x * Math.random(), space.size.y * Math.random()));
        }
    }
}

function connect() {

    lines = [];
    pts.forEach(function (a) {
        pts.forEach(function (b) {
            // connect if distance is less than 100
            if (a.distance(b) < 100) lines.push(new Pair(a).to(b));
        });
    });
}


//// 3. Visualize, Animate, Interact
space.add({
    animate: function (time, fps, context) {

        form.stroke("rgba(255,255,255,.5)");
        form.lines(lines);

        form.stroke(false);
        form.fill(colors.a1);
        form.points(pts, 1, true);

        connect();
        populationControl();

    },
    onMouseAction: function (type, x, y, evt) {

        if (type == "move") {
            if (Util.chance(0.01)) {
                pts.push(new Vector(x, y));
            }
        }
    }
});


// 4. Start playing
space.bindMouse();
space.play();