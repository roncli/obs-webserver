var games = [],
    updated = false,
    wheel,

    update = function() {
        var ctx = wheel.ctx;

        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#191935";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(990, 475);
        ctx.lineTo(990, 525);
        ctx.lineTo(960, 500);
        ctx.lineTo(990, 475);
        ctx.stroke();
        ctx.fill();
    },

    finished = function() {
        for (let index = 1; index < wheel.segments.length; index++) {
            wheel.segments[index].lineWidth = 0;
            if (wheel.segments[index].text !== wheel.getIndicatedSegment().text) {
                wheel.segments[index].fillStyle = "#000000";
                wheel.segments[index].text = "";
                wheel.segments[index].imgData = new Image();
            }
        }
        wheel.draw();
        update();
    };

document.addEventListener("DOMContentLoaded", function(ev) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (x.readyState === 4 && x.status === 200) {
            var y = new XMLHttpRequest();

            y.onreadystatechange = function() {
                if (y.readyState === 4 && y.status === 200) {
                    start(JSON.parse(x.responseText), JSON.parse(y.responseText));
                }
            };
            y.open("GET", "api/steam", true);
            y.send();
        }
    };
    x.open("GET", "api/astats", true);
    x.send();
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function start(achievements, gameList) {
    var totalSize = 0;

    achievements.forEach(function(achievement) {
        const game = gameList.find((game) => +game.appId === achievement.id);

        if (game && [517530, 450220, 314680, 366080, 205790, 367540, 2430, 35420, 443940, 570].indexOf(achievement.id) === -1 && game.playtimeTwoWeeks === 0) {
            if (achievement.percent < 100) {
                games.push({
                    name: game.name,
                    header: "/api/proxy?url=http://cdn.akamai.steamstatic.com/steam/apps/" + game.appId + "/header.jpg",
                    size: 100 - achievement.percent
                });
                totalSize += 100 - achievement.percent;
            }
        }
    });

    games = shuffle(games);

    setTimeout(function() {
        wheel = new Winwheel({
            canvasId: "wheel",
            numSegments: games.length,
            outerRadius: 460,
            pointerAngle: 90,
            textAlignment: "outer",
            drawMode: "segmentImage",
            drawText: true,
            imageDirection: "E",
            imageOverlay: true,
            strokeStyle: "#ffffff",
            segments: games.map(function(game) {
                return {
                    text: game.name,
                    image: game.header,
                    size: 360 * game.size / totalSize,
                    textFontFamily: "Archivo Narrow",
                    textStrokeStyle: "#ffffff",
                    textLineWidth: 1
                };
            }),
            animation: {
                type: "spinToStop",
                duration: 15,
                spins: 5,
                easing: Power3.easeInOut,
                callbackFinished: "finished()",
                callbackAfter: "update()"
            }
        });

        setTimeout(function() {
            var img = new Image();
            img.src = wheel.ctx.canvas.toDataURL();

            wheel.drawMode = "image";
            wheel.wheelImage = img;

            updated = true;
            wheel.draw();

            wheel.startAnimation();
        }, 5000);
    }, 5000);
}
