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
                // } else if (key == keys.K) {
                //     continue
                // }
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


function main() {
    $("#startButton").prop("disabled", true);

    let enemies = []
    for (let i = 0; i < 3; i++) {
        $("#game").append(`<div id="enemy${i}"></div>`);
        let enemy = {
            name: i,
            witdh: $(`#enemy${i}`).css("width"),
            height: $(`#enemy${i}`).css("height"),
            posX: $(`#enemy${i}`).css("left"),
            posY: parseInt(Math.random() * (parseInt($("#game").css("height")) - parseInt($(`#enemy${i}`).css("height")))),
            vel: parseInt(Math.random() * 5 + 7)
        };
        enemies.push(enemy)
    }

    $("#game").append("<div id='player'></div>");

    const game = {};
    game.clock = setInterval(loop, 30);
    game.playerMoviment = 10;
    game.keysPress = [];

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

        for (enemy of enemies) {
            enemyMoviments(enemy);
        }
    }
}