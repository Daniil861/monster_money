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
    const lifes = document.querySelectorAll(".info__heart");
    let move_timer;
    let points = document.querySelector(".header__count");
    if (!sessionStorage.getItem("lifes")) sessionStorage.setItem("lifes", 3); else if (5 == sessionStorage.getItem("lifes") && document.querySelector(".header__lifes")) document.querySelector(".header__lifes").classList.add("_not-active");
    if (sessionStorage.getItem("points")) points.textContent = sessionStorage.getItem("points"); else sessionStorage.setItem("points", 15e3);
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".acces-preloader__button")) {
            preloader.classList.add("_hide");
            sessionStorage.setItem("preloader", true);
            wrapper.classList.add("_visible");
        }
        if (targetElement.closest(".header__button")) {
            let current_point = sessionStorage.getItem("points");
            let current_lifes = +sessionStorage.getItem("lifes");
            document.querySelector(".header__button").classList.add("_not-active");
            setTimeout((() => {
                document.querySelector(".header__button").classList.remove("_not-active");
            }), 1500);
            if (current_point >= 5e3 && current_lifes < 5) {
                sessionStorage.setItem("lifes", current_lifes + 1);
                points.textContent = current_point - 5e3;
                sessionStorage.setItem("points", points.innerHTML);
                if (current_lifes >= 4) document.querySelector(".header__lifes").classList.add("_not-active");
            }
            if (5 == current_lifes) show_message_buy_lifes();
        }
        if (targetElement.closest(".controls__button_left")) {
            clearInterval(move_timer);
            move_pacman_left();
        }
        if (targetElement.closest(".controls__button_top")) {
            clearInterval(move_timer);
            move_pacman_up();
        }
        if (targetElement.closest(".controls__button_right")) {
            clearInterval(move_timer);
            move_pacman_right();
        }
        if (targetElement.closest(".controls__button_bottom")) {
            clearInterval(move_timer);
            move_pacman_bottom();
        }
    }));
    function show_message_buy_lifes() {
        let message = document.createElement("div");
        message.classList.add("header__message");
        message.textContent = "Max lifes is open - 5";
        document.querySelector(".header__lifes").append(message);
        setTimeout((() => {
            message.remove();
        }), 1500);
    }
    const grid = document.querySelector(".game__grid");
    const width = 27;
    document.querySelector(".pac-man");
    let layout;
    if (document.querySelector(".game_one")) layout = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 7, 7, 7, 7, 7, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]; else if (document.querySelector(".game_two")) layout = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 8, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 7, 7, 7, 7, 7, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 9, 0, 0, 0, 1, 0, 0, 0, 0, 9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]; else if (document.querySelector(".game_three")) layout = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 8, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 7, 7, 7, 7, 7, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 7, 7, 7, 7, 1, 0, 1, 0, 0, 0, 0, 0, 0, 9, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 9, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
    const squares = [];
    function create_board() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement("div");
            grid.appendChild(square);
            squares.push(square);
            if (0 == layout[i]) squares[i].classList.add("pac-dot"); else if (1 == layout[i]) squares[i].classList.add("wall"); else if (2 == layout[i]) squares[i].classList.add("ghost-lair"); else if (3 == layout[i]) squares[i].classList.add("power-banan"); else if (5 == layout[i]) squares[i].classList.add("power-cherry"); else if (6 == layout[i]) squares[i].classList.add("pac-big-dot"); else if (8 == layout[i]) squares[i].classList.add("power-lemon"); else if (9 == layout[i]) squares[i].classList.add("power-slotmashine");
        }
    }
    let pacmanCurrentIndex = 418;
    if (document.querySelector(".game")) {
        create_board();
        sessionStorage.setItem("game-lifes", sessionStorage.getItem("lifes"));
        squares[pacmanCurrentIndex].classList.add("pac-man-right");
    }
    function satrt_sheck_functions() {
        pac_dot_eating();
        power_pellet_eating();
        check_game_over();
        check_for_win();
    }
    function remove_pacman() {
        if (squares[pacmanCurrentIndex].classList.contains("pac-man-up")) squares[pacmanCurrentIndex].classList.remove("pac-man-up"); else if (squares[pacmanCurrentIndex].classList.contains("pac-man-right")) squares[pacmanCurrentIndex].classList.remove("pac-man-right"); else if (squares[pacmanCurrentIndex].classList.contains("pac-man-down")) squares[pacmanCurrentIndex].classList.remove("pac-man-down"); else if (squares[pacmanCurrentIndex].classList.contains("pac-man-left")) squares[pacmanCurrentIndex].classList.remove("pac-man-left");
    }
    function move_pacman_left() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex - 1].classList.contains("wall") && !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")) pacmanCurrentIndex -= 1;
            squares[pacmanCurrentIndex].classList.add("pac-man-left");
            satrt_sheck_functions();
        }), 500);
    }
    function move_pacman_up() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex - width].classList.contains("wall") && !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")) pacmanCurrentIndex -= width;
            squares[pacmanCurrentIndex].classList.add("pac-man-up");
            satrt_sheck_functions();
        }), 500);
    }
    function move_pacman_right() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex + 1].classList.contains("wall") && !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")) pacmanCurrentIndex += 1;
            squares[pacmanCurrentIndex].classList.add("pac-man-right");
            satrt_sheck_functions();
        }), 500);
    }
    function move_pacman_bottom() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex + width].classList.contains("wall") && !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")) pacmanCurrentIndex += width;
            squares[pacmanCurrentIndex].classList.add("pac-man-down");
            satrt_sheck_functions();
        }), 500);
    }
    function pac_dot_eating() {
        if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
            let score = document.querySelector(".header__count");
            score.textContent = +score.innerHTML + 10;
            sessionStorage.setItem("points", score.innerHTML);
            squares[pacmanCurrentIndex].classList.remove("pac-dot");
        } else if (squares[pacmanCurrentIndex].classList.contains("pac-big-dot")) {
            let score = document.querySelector(".header__count");
            score.textContent = +score.innerHTML + 30;
            sessionStorage.setItem("points", score.innerHTML);
            squares[pacmanCurrentIndex].classList.remove("pac-big-dot");
        }
    }
    function power_pellet_eating() {
        if (squares[pacmanCurrentIndex].classList.contains("power-banan") || squares[pacmanCurrentIndex].classList.contains("power-cherry") || squares[pacmanCurrentIndex].classList.contains("power-lemon")) {
            let score = document.querySelector(".header__count");
            score.textContent = +score.innerHTML + 100;
            sessionStorage.setItem("points", score.innerHTML);
            ghosts.forEach((el => el.isScared = true));
            setTimeout((() => {
                un_scared_ghosts();
            }), 1e4);
            if (squares[pacmanCurrentIndex].classList.contains("power-banan")) squares[pacmanCurrentIndex].classList.remove("power-banan"); else if (squares[pacmanCurrentIndex].classList.contains("power-cherry")) squares[pacmanCurrentIndex].classList.remove("power-cherry"); else if (squares[pacmanCurrentIndex].classList.contains("power-lemon")) squares[pacmanCurrentIndex].classList.remove("power-lemon");
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
    let ghosts;
    if (document.querySelector(".game_one")) ghosts = [ new Ghost("blinky", 252, 300), new Ghost("pinky", 29, 400) ]; else if (document.querySelector(".game_two")) ghosts = [ new Ghost("blinky", 252, 250), new Ghost("pinky", 29, 400), new Ghost("inky", 500, 300) ]; else if (document.querySelector(".game_three")) ghosts = [ new Ghost("blinky", 252, 250), new Ghost("pinky", 29, 350), new Ghost("inky", 500, 250), new Ghost("clyde", 535, 250) ];
    if (document.querySelector(".game")) {
        ghosts.forEach((el => {
            squares[el.currentIndex].classList.add(el.className);
            squares[el.currentIndex].classList.add("ghost");
        }));
        ghosts.forEach((el => move_ghost(el)));
        if (sessionStorage.getItem("lifes") > 3) document.querySelector(".info__hearts").classList.add("_small");
        if (3 == sessionStorage.getItem("lifes")) lifes.forEach(((el, index) => {
            if (index <= 2) el.classList.add("_visible");
        })); else if (4 == sessionStorage.getItem("lifes")) lifes.forEach(((el, index) => {
            if (index <= 3) el.classList.add("_visible");
        }));
        if (5 == sessionStorage.getItem("lifes")) lifes.forEach(((el, index) => {
            if (index <= 4) el.classList.add("_visible");
        }));
    }
    function move_ghost(ghost) {
        const directions = [ -1, +1, width, -width ];
        let direction = directions[Math.floor(Math.random() * (directions.length - 0) + 0)];
        squares[ghost.currentIndex].classList.remove("ghost");
        if (squares[ghost.currentIndex].classList.contains("blinky")) squares[ghost.currentIndex].classList.remove("blinky");
        if (squares[ghost.currentIndex].classList.contains("pinky")) squares[ghost.currentIndex].classList.remove("pinky");
        if (squares[ghost.currentIndex].classList.contains("inky")) squares[ghost.currentIndex].classList.remove("inky");
        if (squares[ghost.currentIndex].classList.contains("clyde")) squares[ghost.currentIndex].classList.remove("clyde");
        ghost.timerId = setInterval((function() {
            if (!squares[ghost.currentIndex + direction].classList.contains("wall") && !squares[ghost.currentIndex + direction].classList.contains("ghost")) {
                if (squares[ghost.currentIndex].classList.contains("_left")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_left"); else if (squares[ghost.currentIndex].classList.contains("_right")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_right"); else if (squares[ghost.currentIndex].classList.contains("_up")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_up"); else if (squares[ghost.currentIndex].classList.contains("_down")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_down");
                let current_direction = direction;
                ghost.currentIndex += current_direction;
                if (-1 == current_direction) squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_left"); else if (+1 == current_direction) squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_right"); else if (current_direction == -width) squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_up"); else if (current_direction == width) squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_down");
            } else direction = directions[Math.floor(Math.random() * (directions.length - 0) + 0)];
            if (ghost.isScared) squares[ghost.currentIndex].classList.add("scared-ghost");
            if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man-left") || squares[ghost.currentIndex].classList.contains("pac-man-right") || squares[ghost.currentIndex].classList.contains("pac-man-up") && squares[ghost.currentIndex].classList.contains("pac-man-down")) {
                if (squares[ghost.currentIndex].classList.contains("_left")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_left"); else if (squares[ghost.currentIndex].classList.contains("_right")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_right"); else if (squares[ghost.currentIndex].classList.contains("_up")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_up"); else if (squares[ghost.currentIndex].classList.contains("_down")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_down");
                ghost.currentIndex = ghost.startIndex;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_left");
            }
            check_game_over();
        }), ghost.speed);
    }
    function check_game_over() {
        if (squares[pacmanCurrentIndex].classList.contains("ghost") && !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
            ghosts.forEach((el => clearInterval(el.timerId)));
            remove_pacman();
            clearInterval(move_timer);
            document.querySelector(".controls__buttons").classList.add("_not-active");
            let current_lifes = +sessionStorage.getItem("game-lifes");
            if (current_lifes <= 0) document.querySelector(".loose").classList.add("_active");
            current_lifes--;
            document.querySelectorAll(".info__heart").forEach(((el, index) => {
                if (index == current_lifes) el.classList.add("_hide");
            }));
            sessionStorage.setItem("game-lifes", current_lifes);
            setTimeout((() => {
                squares[418].classList.add("pac-man-right");
                pacmanCurrentIndex = 418;
                document.querySelector(".controls__buttons").classList.remove("_not-active");
            }), 1e3);
            setTimeout((() => {
                ghosts.forEach((el => move_ghost(el)));
            }), 3e3);
        }
    }
    function check_for_win() {
        let big_stones = document.querySelectorAll(".pac-big-dot");
        let bananas = document.querySelectorAll(".power-banan");
        let cherrys = document.querySelectorAll(".power-cherry");
        let lemons = document.querySelectorAll(".power-lemon");
        let slotmashines = document.querySelectorAll(".power-slotmashine");
        if (0 == big_stones.length && 0 == bananas.length && 0 == cherrys.length && 0 == lemons.length && 0 == slotmashines.length) {
            ghosts.forEach((el => clearInterval(el.timerId)));
            document.querySelector(".play").classList.add("_active");
        }
    }
    window["FLS"] = true;
    isWebp();
})();