(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        if (document.querySelector("body")) setTimeout((function() {
            document.querySelector("body").classList.add("_loaded");
        }), 200);
    }));
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".acces-preloader__button")) {
            preloader.classList.add("_hide");
            sessionStorage.setItem("preloader", true);
            wrapper.classList.add("_visible");
        }
        if (targetElement.closest(".controls__button_left")) move_pacman_left();
        if (targetElement.closest(".controls__button_top")) move_pacman_up();
        if (targetElement.closest(".controls__button_right")) move_pacman_right();
        if (targetElement.closest(".controls__button_bottom")) move_pacman_bottom();
    }));
    const grid = document.querySelector(".game__grid");
    const width = 27;
    const layout = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
    const squares = [];
    function create_board() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement("div");
            grid.appendChild(square);
            squares.push(square);
            if (0 == layout[i]) squares[i].classList.add("pac-dot"); else if (1 == layout[i]) squares[i].classList.add("wall"); else if (2 == layout[i]) squares[i].classList.add("ghost-lair"); else if (3 == layout[i]) squares[i].classList.add("power-pellet");
        }
    }
    create_board();
    let pacmanCurrentIndex = 418;
    squares[pacmanCurrentIndex].classList.add("pac-man");
    function move_pacman_left() {
        squares[pacmanCurrentIndex].classList.remove("pac-man");
        if (pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex - 1].classList.contains("wall") && !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")) pacmanCurrentIndex -= 1;
        squares[pacmanCurrentIndex].classList.add("pac-man");
        satrt_sheck_functions();
    }
    function satrt_sheck_functions() {
        pac_dot_eating();
        power_pellet_eating();
        check_game_over();
    }
    function move_pacman_up() {
        squares[pacmanCurrentIndex].classList.remove("pac-man");
        if (pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex - width].classList.contains("wall") && !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")) pacmanCurrentIndex -= width;
        squares[pacmanCurrentIndex].classList.add("pac-man");
        satrt_sheck_functions();
    }
    function move_pacman_right() {
        squares[pacmanCurrentIndex].classList.remove("pac-man");
        if (pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex + 1].classList.contains("wall") && !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")) pacmanCurrentIndex += 1;
        squares[pacmanCurrentIndex].classList.add("pac-man");
        satrt_sheck_functions();
    }
    function move_pacman_bottom() {
        squares[pacmanCurrentIndex].classList.remove("pac-man");
        if (pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex + width].classList.contains("wall") && !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")) pacmanCurrentIndex += width;
        squares[pacmanCurrentIndex].classList.add("pac-man");
        satrt_sheck_functions();
    }
    function move_pacman(e) {
        squares[pacmanCurrentIndex].classList.remove("pac-man");
        console.log(e.keyCode);
        switch (e.keyCode) {
          case 37:
            if (pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex - 1].classList.contains("wall") && !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")) pacmanCurrentIndex -= 1;
            break;

          case 38:
            if (pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex - width].classList.contains("wall") && !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")) pacmanCurrentIndex -= width;
            break;

          case 39:
            if (pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex + 1].classList.contains("wall") && !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")) pacmanCurrentIndex += 1;
            break;

          case 40:
            if (pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex + width].classList.contains("wall") && !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")) pacmanCurrentIndex += width;
            break;
        }
        squares[pacmanCurrentIndex].classList.add("pac-man");
        pac_dot_eating();
        power_pellet_eating();
        check_game_over();
        console.log(pacmanCurrentIndex);
    }
    document.addEventListener("keyup", move_pacman);
    function pac_dot_eating() {
        if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) squares[pacmanCurrentIndex].classList.remove("pac-dot");
    }
    function power_pellet_eating() {
        if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
            ghosts.forEach((el => el.isScared = true));
            setTimeout((() => {
                un_scared_ghosts();
            }), 1e4);
            squares[pacmanCurrentIndex].classList.remove("power-pellet");
        }
    }
    function un_scared_ghosts() {
        ghosts.forEach((el => el.isScared = false));
    }
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
            this.isScared = false;
        }
    }
    let ghosts = [ new Ghost("blinky", 252, 250), new Ghost("pinky", 29, 400), new Ghost("inky", 500, 300), new Ghost("clyde", 535, 500) ];
    ghosts.forEach((el => {
        squares[el.currentIndex].classList.add(el.className);
        squares[el.currentIndex].classList.add("ghost");
    }));
    ghosts.forEach((el => move_ghost(el)));
    function move_ghost(ghost) {
        const directions = [ -1, +1, width, -width ];
        let direction = directions[Math.floor(Math.random() * (directions.length - 0) + 0)];
        ghost.timerId = setInterval((function() {
            if (!squares[ghost.currentIndex + direction].classList.contains("wall") && !squares[ghost.currentIndex + direction].classList.contains("ghost")) {
                squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                ghost.currentIndex += direction;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
            } else direction = directions[Math.floor(Math.random() * (directions.length - 0) + 0)];
            if (ghost.isScared) squares[ghost.currentIndex].classList.add("scared-ghost");
            if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
                squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                ghost.currentIndex = ghost.startIndex;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
            }
        }), ghost.speed);
    }
    function check_game_over() {
        if (squares[pacmanCurrentIndex].classList.contains("ghost") && !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) ghosts.forEach((el => clearInterval(el.timerId)));
    }
    window["FLS"] = true;
    isWebp();
})();