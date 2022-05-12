// CONFIGURAÇÕES ------------------------------------------
const screenSize = {
  width: 400,
  height: 400,
  thickness: 10,
};
let time = 100;
let levelFactor = 0.05;
// TELA DO JOGO -------------------------------------------
const body = document.querySelector("body");
const snakeGame = document.createElement("div");
snakeGame.classList.add("snake-game");
body.appendChild(snakeGame);
snakeGame.style.width = `${screenSize.width}px`;
snakeGame.style.height = `${screenSize.height}px`;
snakeGame.style.border = `${screenSize.thickness}px solid #fff`;
// Pontuação
const scoreH1 = document.createElement("h1");
scoreH1.classList.add("score");
scoreH1.innerText = "Score: ";
snakeGame.appendChild(scoreH1);
const ScoreSpan = document.createElement("span");
ScoreSpan.innerText = "0";
scoreH1.appendChild(ScoreSpan);
const scoreNow = document.querySelector(".score span");

// RATO -------------------------------------------------
let ratPosition = { x: "", y: "" };

// Cria os ratos em lugares aleatórios
const rat = document.createElement("div");
rat.classList.add("rat");
snakeGame.appendChild(rat);
rat.style.width = `${screenSize.thickness}px`;
rat.style.height = `${screenSize.thickness}px`;
randomPosition();

// Função que cria uma posição variavel
function myPosition(min, max, multiple) {
  return Math.round((Math.random() * (max - min)) / multiple) * multiple + min;
}

function randomPosition() {
  ratPosition = {
    x: myPosition(
      0,
      screenSize.width - 3 * screenSize.thickness,
      screenSize.thickness,
    ), // gerar um número de 0 a 470 de 10 em 10
    y: myPosition(
      0,
      screenSize.height - 3 * screenSize.thickness,
      screenSize.thickness,
    ), // gerar um número de 0 a 470 de 10 em 10
  };
  rat.style.left = `${ratPosition.x}px`;
  rat.style.top = `${ratPosition.y}px`;
}

// COBRA ----------------------------------------------
let snakePosition = [{ x: screenSize.width / 2, y: screenSize.height / 2 }];
let snakeSize = 1;
let dirSnakeMove;
let intervalMove;
// Cria os ratos em lugares aleatórios
const snake = document.createElement("div");
snake.classList.add("snake", "head");
snakeGame.appendChild(snake);
snake.style.width = `${screenSize.thickness}px`;
snake.style.height = `${screenSize.thickness}px`;
snake.style.left = `${snakePosition[0].x}px`;
snake.style.top = `${snakePosition[0].y}px`;

// cria o evento da movimentação da cobra
window.addEventListener("keydown", keyMoveSnake);

// função da movimentação pelo teclado
function keyMoveSnake({ key }) {
  switch (key) {
    case "ArrowUp":
      if (dirSnakeMove !== "ArrowDown") {
        dirSnakeMove = "ArrowUp";
        autoMoveSnake("ArrowUp");
      }
      break;

    case "ArrowDown":
      if (dirSnakeMove !== "ArrowUp") {
        dirSnakeMove = "ArrowDown";
        autoMoveSnake("ArrowDown");
      }
      break;

    case "ArrowLeft":
      if (dirSnakeMove !== "ArrowRight") {
        dirSnakeMove = "ArrowLeft";
        autoMoveSnake("ArrowLeft");
      }
      break;

    case "ArrowRight":
      if (dirSnakeMove !== "ArrowLeft") {
        dirSnakeMove = "ArrowRight";
        autoMoveSnake("ArrowRight");
      }
      break;
  }
}

// Caso a cobra capture o rato
function capture(direction) {
  if (
    snakePosition[0].x === ratPosition.x &&
    snakePosition[0].y === ratPosition.y
  ) {
    scoreNow.innerText = snakeSize * 10;
    snakeSize++;
    randomPosition();
    growSnake(direction);
    setLevel(levelFactor);
  }
}

// Crescimento da cobra caso capture rato
function growSnake(side) {
  const bodySnake = document.createElement("div");
  bodySnake.classList.add("snake");
  snakeGame.appendChild(bodySnake);
  bodySnake.style.width = `${screenSize.thickness}px`;
  bodySnake.style.height = `${screenSize.thickness}px`;

  let objectPosition = {};
  const last = snakePosition[snakePosition.length - 1];
  const penult = snakePosition[snakePosition.length - 2];

  if (
    penult ? last.y == penult.y && last.x < penult.x : side === "ArrowRight"
  ) {
    objectPosition = {
      x: last.x - screenSize.thickness,
      y: last.y,
    };
  } else if (
    penult ? last.y == penult.y && last.x > penult.x : side === "ArrowLeft"
  ) {
    objectPosition = {
      x: last.x + screenSize.thickness,
      y: last.y,
    };
  } else if (
    penult ? last.y > penult.y && last.x == penult.x : side === "ArrowUp"
  ) {
    objectPosition = {
      x: last.x,
      y: last.y + screenSize.thickness,
    };
  } else if (
    penult ? last.y < penult.y && last.x == penult.x : side === "ArrowDown"
  ) {
    objectPosition = {
      x: last.x,
      y: last.y - screenSize.thickness,
    };
  }

  snakePosition.push(objectPosition);
  bodySnake.style.left = `${snakePosition[snakePosition.length - 1].x}px`;
  bodySnake.style.top = `${snakePosition[snakePosition.length - 1].y}px`;
}

// Toda vez que movimentar atualizar posição
function refreshSnakePosition() {
  if (snakeSize > 1) {
    const bSnake = document.querySelectorAll(".snake");
    for (let i = snakePosition.length - 1; i >= 1; i--) {
      snakePosition[i].x = snakePosition[i - 1].x;
      snakePosition[i].y = snakePosition[i - 1].y;
      bSnake[i].style.left = `${snakePosition[i].x}px`;
      bSnake[i].style.top = `${snakePosition[i].y}px`;
    }
  }
}

// Colocar a movimentação da cobra automática
function autoMoveSnake(direction) {
  clearInterval(intervalMove);
  switch (direction) {
    case "ArrowUp":
      intervalMove = setInterval(() => {
        const collision = verifyCollision();
        if (!collision) {
          refreshSnakePosition();
          snakePosition[0].y -= screenSize.thickness;
          snake.style.top = `${snakePosition[0].y}px`;
          capture(direction);
        }
      }, time);
      break;

    case "ArrowDown":
      intervalMove = setInterval(() => {
        const collision = verifyCollision();
        if (!collision) {
          refreshSnakePosition();
          snakePosition[0].y += screenSize.thickness;
          snake.style.top = `${snakePosition[0].y}px`;
          capture(direction);
        }
      }, time);
      break;

    case "ArrowLeft":
      intervalMove = setInterval(() => {
        const collision = verifyCollision();
        if (!collision) {
          refreshSnakePosition();
          snakePosition[0].x -= screenSize.thickness;
          snake.style.left = `${snakePosition[0].x}px`;
          capture(direction);
        }
      }, time);
      break;

    case "ArrowRight":
      intervalMove = setInterval(() => {
        const collision = verifyCollision();
        if (!collision) {
          refreshSnakePosition();
          snakePosition[0].x += screenSize.thickness;
          snake.style.left = `${snakePosition[0].x}px`;
          capture(direction);
        }
      }, time);
      break;
  }
}

// eventos de colisão
function verifyCollision() {
  // colisão com paredes
  const collisionWall =
    snakePosition[0].x > screenSize.width - 3 * screenSize.thickness ||
    snakePosition[0].x < 0 ||
    snakePosition[0].y > screenSize.height - 3 * screenSize.thickness ||
    snakePosition[0].y < 0;

  // auto colisão
  const selfCollision = snakePosition.filter(({ x, y }, index) => {
    return index > 0 && x === snakePosition[0].x && y === snakePosition[0].y;
  });

  if (collisionWall || selfCollision.length > 0) {
    clearInterval(intervalMove);
    window.removeEventListener("keydown", keyMoveSnake);
    window.addEventListener("keydown", ({ key }) => {
      if (key === " ") {
        window.location.reload();
      }
    });

    const gameOver = document.createElement("h2");
    gameOver.classList.add("game-over");
    gameOver.innerText = "Game Over";
    const pressStart = document.createElement("h3");
    pressStart.classList.add("press-start");
    pressStart.innerText = "Press Space...";
    snakeGame.appendChild(gameOver);
    snakeGame.appendChild(pressStart);

    return true;
  }
}

// aumento gradativo de dificudade
function setLevel(factor) {
  time = time - time * ((snakeSize / time) * levelFactor);
}
