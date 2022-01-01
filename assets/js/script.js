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


function resetEnemy(enemy) {
    enemy.posY = parseInt(Math.random() * (parseInt($("#game").css("height")) - parseInt($(enemy.name).css("height"))));
    enemy.vel = parseInt(Math.random() * 5 + 7)
    $(enemy.name).css("left", enemy.posX);
    $(enemy.name).css("top", enemy.posY);
}


function enemyMoviments(enemy) {
    let posX = parseInt($(enemy.name).css("left"))

    $(enemy.name).css("top", enemy.posY);
    $(enemy.name).css("left", posX - enemy.vel);
    if (posX <= 0) {
        resetEnemy(enemy)
    }
}


function drawBlast() {
    const blastSound = document.getElementById("blastSound");
    blastSound.play()
    blastSound.volume = 0.2
    let posX = parseInt($("#player").css("left"))
    let posY = parseInt($("#player").css("top"))
    $("#game").append('<div id="blast"></div>')
    $("#blast").css({
        "left": posX + 128,
        "top": posY + (128 / 3)
    })
}


function blastMoviment(game) {
    let posX = parseInt($("#blast").css("left"));
    $("#blast").css("left", posX + 20);

    if (posX >= (parseInt($("#game").css("width")) - 64)) {
        $("#blast").remove();
        game.shootState = false;
    }
}


function scoreUpdate(game, point = 1) {
    let score = parseInt($("#score").text());
    $("#score").text(score + point);
    game.score = score;
}


function energyBarUpdate(game) {
    let energy = parseInt($("#energyBar").css("width"));
    $("#energyBar").css("width", energy - 24);

    if (energy === 0) {
        game.running = false;
    }
}


function shockWave(x, y) {
    $("#game").append(`<div id="shockWave"></div>`);
    $("#shockWave").css({
        "left": x,
        "top": y,
    });

    let timeShockWave = window.setInterval(removeShockWaveFoo, 500);

    function removeShockWaveFoo() {
        $("#shockWave").remove();
        window.clearInterval(timeShockWave);
    }
}


function collisionHandler(game, enemy) {
    const collisionSound = document.getElementById("collisionSound");
    let playerCollision = $("#player").collision($(enemy.name));
    let blastCollision = $("#blast").collision($(enemy.name));

    if (playerCollision.length != 0) {
        collisionSound.play()
        collisionSound.volume = 0.2
        energyBarUpdate(game);
        resetEnemy(enemy);
        shockWave(parseInt($("#player").css("left")), parseInt($("#player").css("top")));
    } else if (blastCollision.length != 0) {
        collisionSound.play()
        collisionSound.volume = 0.2
        scoreUpdate(game, 100);
        resetEnemy(enemy);
        shockWave(parseInt($("#blast").css("left")), parseInt($("#blast").css("top")) - 50);
        $("#blast").remove();
        game.shootState = false;
        enemy.vel++;
    }
}


function gameOver(game, backgroundMusic) {
    backgroundMusic.pause();
    $("#player").remove()

    for (enemy of game.enemies) {
        $(enemy.name).remove()
    }

    $("#hud").remove()

    window.clearInterval(game.clock)

    $("#game").append(
        `<div id="gameOverCard" class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">GAME OVER</h5>
                <p class="card-text">Don't forget it to check it out the project source code on <a
                        href="https://github.com/DeivissonLisboa/gundam-universe-game" target="_blank">Github</a>!
                </p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Score: ${game.score}</li>
                <li class="list-group-item">
                    <button id="restartButton" type="button" class="btn btn-dark" onclick="main()">Restart</button>
                </li>
            </ul>
        </div>`
    );

}


function main() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.addEventListener("ended", () => { backgroundMusic.currentTime = 0; backgroundMusic.play() }, false);
    backgroundMusic.play();
    backgroundMusic.volume = 0.1;

    const game = {};
    const keys = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        K: 75
    };

    if ($("#gameOverCard")) {
        $("#gameOverCard").remove()
    }
    $("#startButton").prop("disabled", true);
    $("#game").append("<div id='player'></div>");
    $("#game").append(
        `<div id="hud" class="row">
            <div class="col">
                <h4>ENERGY</h4>
                <div class="energyHud"></div>
                <div id="energyBar"></div>
            </div>
            <div class="col text-right">
                <h4>SCORE</h4>
                <h5 id="score">0</h5>
            </div>
        </div>`
    )

    game.running = true
    game.clock = setInterval(loop, 30);
    game.playerMoviment = 10;
    game.keysPress = [];

    game.enemies = [];
    for (let i = 0; i < 3; i++) {
        let enemyName = "#enemy" + i
        $("#game").append(`<div id="enemy${i}"></div>`);
        $(`${enemyName}`).css({
            "position": "absolute",
            "width": "162px",
            "height": "122px",
            "top": "calc(50% - (122px / 2))",
            "left": "calc(100% - 162px)",
            "background-image": "url('/assets/imgs/enemy2.png')",
        });
        let enemy = {
            name: enemyName,
            witdh: $(`${enemyName}`).css("width"),
            height: $(`${enemyName}`).css("height"),
            posX: $(`${enemyName}`).css("left"),
            posY: parseInt(Math.random() * (parseInt($("#game").css("height")) - parseInt($(`${enemyName}`).css("height")))),
            vel: parseInt(Math.random() * 5 + 7)
        };
        game.enemies.push(enemy);
    }

    game.shootState = false;
    game.score = 0



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
            collisionHandler(game, enemy);
        }

        if (game.shootState) {
            blastMoviment(game);
        }

        if (!game.running) {
            gameOver(game, backgroundMusic)
        } else {
            scoreUpdate(game)
        }
    }
}