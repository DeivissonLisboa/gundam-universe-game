function backgroudScroll() {
    let posX = parseInt($("#game").css("background-position"));
    $("#game").css("background-position", posX - 5);
}


function playerMoviment(game, keys) {
    let posX = parseInt($("#player").css("left"));
    let posY = parseInt($("#player").css("top"));

    for (let i = 0; i < game.keysPress.length; i++) {
        let key = game.keysPress[i];
        if (key) {
            if (i === keys.W) {
                if (posY - game.playerMoviment >= 0) {
                    $("#player").css("top", posY - game.playerMoviment);
                }
            } else if (i === keys.A) {
                if (posX - game.playerMoviment >= 0) {
                    $("#player").css("left", posX - game.playerMoviment);
                }
            } else if (i === keys.S) {
                if (posY + game.playerMoviment + 128 <= parseInt($("#game").css("height"))) {
                    $("#player").css("top", posY + game.playerMoviment);
                }
            } else if (i === keys.D) {
                if (posX + game.playerMoviment + 128 <= parseInt($("#game").css("width"))) {
                    $("#player").css("left", posX + game.playerMoviment);
                }
            } else if (i === keys.K && !game.shootState) {
                game.shootState = true
                drawBlast()
            }
        }
    }
}


function enemyMoviments(enemy) {
    let posX = parseInt($(`#enemy${enemy.name}`).css("left"))

    $(`#enemy${enemy.name}`).css("top", enemy.posY);
    $(`#enemy${enemy.name}`).css("left", posX - enemy.vel);
    if (posX <= 0) {
        enemy.posY = parseInt(Math.random() * (parseInt($("#game").css("height")) - parseInt($(`#enemy${enemy.name}`).css("height"))));
        enemy.vel = parseInt(Math.random() * 5 + 7)
        $(`#enemy${enemy.name}`).css("left", enemy.posX);
        $(`#enemy${enemy.name}`).css("top", enemy.posY);
    }
}


function drawBlast() {
    let posX = parseInt($("#player").css("left"))
    let posY = parseInt($("#player").css("top"))
    $("#game").append('<div id="blast"></div>')
    $("#blast").css({
        "left": posX + 128,
        "top": posY + (128 / 3)
    })
}

function blastMoviment(game) {
    let posX = parseInt($("#blast").css("left"))
    $("#blast").css("left", posX + 20)

    if (posX >= (parseInt($("#game").css("width")) - 64)) {
        $("#blast").remove()
        game.shootState = false
    }
}


function scoreUpdate() {
    let score = parseInt($("#score").text())
    $("#score").text(score + 100)
}


function collisionHandler() {
    return
}


function main() {
    $("#startButton").prop("disabled", true); $("#game").append("<div id='player'></div>");

    const game = {};
    game.clock = setInterval(loop, 30);
    game.playerMoviment = 10;
    game.keysPress = [];

    game.enemies = []
    for (let i = 0; i < 3; i++) {
        $("#game").append(`<div id="enemy${i}"></div>`);
        $(`#enemy${i}`).css({
            "position": "absolute",
            "width": "162px",
            "height": "122px",
            "top": "calc(50% - (122px / 2))",
            "left": "calc(100% - 162px)",
            "background-image": "url('/assets/imgs/enemy2.png')",
        });
        let enemy = {
            name: i,
            witdh: $(`#enemy${i}`).css("width"),
            height: $(`#enemy${i}`).css("height"),
            posX: $(`#enemy${i}`).css("left"),
            posY: parseInt(Math.random() * (parseInt($("#game").css("height")) - parseInt($(`#enemy${i}`).css("height")))),
            vel: parseInt(Math.random() * 5 + 7)
        };
        game.enemies.push(enemy)
    }

    game.shootState = false;

    const keys = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        K: 75
    };

    $(document).keydown(function (e) {
        game.keysPress[e.keyCode] = true;
    });

    $(document).keyup(function (e) {
        game.keysPress[e.keyCode] = false;
    });


    function loop() {
        backgroudScroll();
        playerMoviment(game, keys);

        for (enemy of game.enemies) {
            enemyMoviments(enemy);
        }

        if (game.shootState) {
            blastMoviment(game)
        }

        collisionHandler()
    }
}