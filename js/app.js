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
    if (sessionStorage.getItem("points")) points.textContent = sessionStorage.getItem("points"); else sessionStorage.setItem("points", 500);
    if (document.querySelector(".game_one")) sessionStorage.setItem("shield", 1); else if (document.querySelector(".game_two")) sessionStorage.setItem("shield", 2); else if (document.querySelector(".game_three")) sessionStorage.setItem("shield", 3);
    if (document.querySelector(".main_levels")) {
        if (sessionStorage.getItem("game-one")) document.querySelector(".main__button_two").classList.add("_visible");
        if (sessionStorage.getItem("game-two")) document.querySelector(".main__button_three").classList.add("_visible");
    }
    if (document.querySelector(".bonus")) {
        document.querySelector(".bonus__button_liner").classList.add("_active");
        sessionStorage.setItem("active-level", 1);
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".acces-preloader__button")) {
            sessionStorage.setItem("preloader", true);
            location.href = "index.html";
            setTimeout((() => {
                preloader.classList.add("_hide");
                wrapper.classList.add("_visible");
            }), 50);
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
            if (current_point < 5e3 && current_lifes < 5) {
                points.classList.add("_no-money");
                setTimeout((() => {
                    points.classList.remove("_no-money");
                }), 1e3);
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
        if (targetElement.closest(".info__shield img")) get_active_shild();
        if (targetElement.closest(".bonus__button_liner")) {
            if (document.querySelector(".bonus__button_mid").classList.contains("_active")) document.querySelector(".bonus__button_mid").classList.remove("_active"); else if (document.querySelector(".bonus__button_high").classList.contains("_active")) document.querySelector(".bonus__button_high").classList.remove("_active");
            document.querySelector(".bonus__button_liner").classList.add("_active");
            sessionStorage.setItem("active-level", 1);
        }
        if (targetElement.closest(".bonus__button_mid")) {
            if (document.querySelector(".bonus__button_liner").classList.contains("_active")) document.querySelector(".bonus__button_liner").classList.remove("_active"); else if (document.querySelector(".bonus__button_high").classList.contains("_active")) document.querySelector(".bonus__button_high").classList.remove("_active");
            document.querySelector(".bonus__button_mid").classList.add("_active");
            sessionStorage.setItem("active-level", 2);
        }
        if (targetElement.closest(".bonus__button_high")) {
            if (document.querySelector(".bonus__button_liner").classList.contains("_active")) document.querySelector(".bonus__button_liner").classList.remove("_active"); else if (document.querySelector(".bonus__button_mid").classList.contains("_active")) document.querySelector(".bonus__button_mid").classList.remove("_active");
            document.querySelector(".bonus__button_high").classList.add("_active");
            sessionStorage.setItem("active-level", 3);
        }
        if (targetElement.closest(".bonus__sand")) {
            create_balls();
            draw_balls();
            balls.forEach((el => move_balls(el)));
            minus_points_for_sand_ball();
            document.querySelector(".bonus__sand").classList.add("_not-active");
            points.classList.add("_minus-money");
            setTimeout((() => {
                document.querySelector(".bonus__sand").classList.remove("_not-active");
                points.classList.remove("_minus-money");
            }), 5e3);
        }
    }));
    function show_message_buy_lifes() {
        let message = document.createElement("div");
        message.classList.add("header__message");
        message.textContent = "You have maximum lifes - 5";
        document.querySelector(".header__lifes").append(message);
        setTimeout((() => {
            message.remove();
        }), 1500);
    }
    function get_active_shild() {
        let count_shield = +sessionStorage.getItem("shield");
        if (count_shield > 0) {
            add_shield_pacman();
            count_shield--;
            sessionStorage.setItem("shield", count_shield);
            document.querySelector(".info__try").textContent = `X${count_shield}`;
            if (0 == count_shield) document.querySelector(".info__shield").classList.add("_not-active");
            setTimeout((() => {
                remove_shield_pacman();
            }), 5e3);
        }
    }
    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: Power1.easeOut
        }
    });
    if (document.querySelector(".main__images_left") && document.querySelector(".main__images_right")) {
        tl.fromTo(".main__item_center", {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1
        });
        tl.fromTo(".header", {
            y: -100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1
        }, "<");
        tl.fromTo(".main__images_left", {
            y: -500
        }, {
            y: 0,
            ease: "elastic.out(1, 0.4",
            duration: 2
        });
        tl.fromTo(".main__images_right", {
            y: -500
        }, {
            y: 0,
            ease: "elastic.out(1, 0.4",
            duration: 2
        }, "<");
        tl.fromTo(".main__flower_left", {
            scale: 0,
            x: 100,
            rotation: "180deg"
        }, {
            scale: 1,
            x: 0,
            rotation: 0,
            duration: .3
        });
        tl.fromTo(".main__flower_right", {
            scale: 0,
            x: -100,
            rotation: "-180deg"
        }, {
            scale: 1,
            x: 0,
            rotation: 0,
            duration: .3
        });
    }
    const mini_field = document.querySelector(".bonus__field");
    let mini_layout = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8 ];
    const mini_squares = [];
    function create_mini_game_board() {
        for (let i = 0; i < mini_layout.length; i++) {
            const square = document.createElement("div");
            mini_field.appendChild(square);
            mini_squares.push(square);
            if (0 == mini_layout[i]) mini_squares[i].classList.add("ball-white"); else if (2 == mini_layout[i]) mini_squares[i].classList.add("multiply-25"); else if (3 == mini_layout[i]) mini_squares[i].classList.add("multiply-5"); else if (4 == mini_layout[i]) mini_squares[i].classList.add("multiply-0-5"); else if (5 == mini_layout[i]) mini_squares[i].classList.add("multiply-1-5"); else if (6 == mini_layout[i]) mini_squares[i].classList.add("multiply-1-75"); else if (7 == mini_layout[i]) mini_squares[i].classList.add("multiply-10"); else if (8 == mini_layout[i]) mini_squares[i].classList.add("multiply-3");
        }
    }
    if (document.querySelector(".bonus")) create_mini_game_board();
    function minus_points_for_sand_ball() {
        if (1 == sessionStorage.getItem("active-level")) {
            let points_storrage = sessionStorage.getItem("points");
            points.textContent = +points_storrage - 100;
            sessionStorage.setItem("points", points.innerHTML);
        } else if (2 == sessionStorage.getItem("active-level")) {
            let points_storrage = sessionStorage.getItem("points");
            points.textContent = +points_storrage - 250;
            sessionStorage.setItem("points", points.innerHTML);
        } else if (3 == sessionStorage.getItem("active-level")) {
            let points_storrage = sessionStorage.getItem("points");
            points.textContent = +points_storrage - 500;
            sessionStorage.setItem("points", points.innerHTML);
        }
    }
    class Ball {
        constructor(startIndex, speed) {
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
        }
    }
    function get_random_num(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    let balls;
    function create_balls() {
        if (1 == sessionStorage.getItem("active-level")) balls = [ new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)), new Ball(get_random_num(5, 23), get_random_num(100, 350)) ]; else if (2 == sessionStorage.getItem("active-level")) balls = [ new Ball(get_random_num(5, 23), get_random_num(150, 350)), new Ball(get_random_num(5, 23), get_random_num(150, 350)), new Ball(get_random_num(5, 23), get_random_num(150, 350)), new Ball(get_random_num(5, 23), get_random_num(150, 350)) ]; else if (3 == sessionStorage.getItem("active-level")) balls = [ new Ball(get_random_num(5, 23), get_random_num(200, 350)), new Ball(get_random_num(5, 23), get_random_num(200, 350)) ];
    }
    function draw_balls() {
        if (1 == sessionStorage.getItem("active-level")) {
            mini_squares[balls[0].currentIndex].classList.add("balls");
            setTimeout((() => {
                mini_squares[balls[1].currentIndex].classList.add("balls");
            }), 1e3);
            setTimeout((() => {
                mini_squares[balls[2].currentIndex].classList.add("balls");
            }), 2e3);
            setTimeout((() => {
                mini_squares[balls[3].currentIndex].classList.add("balls");
            }), 3e3);
            setTimeout((() => {
                mini_squares[balls[4].currentIndex].classList.add("balls");
            }), 4e3);
            setTimeout((() => {
                mini_squares[balls[5].currentIndex].classList.add("balls");
            }), 5e3);
            setTimeout((() => {
                mini_squares[balls[6].currentIndex].classList.add("balls");
            }), 6e3);
            setTimeout((() => {
                mini_squares[balls[7].currentIndex].classList.add("balls");
            }), 7e3);
        } else if (1 == sessionStorage.getItem("active-level")) {
            mini_squares[balls[0].currentIndex].classList.add("balls");
            setTimeout((() => {
                mini_squares[balls[1].currentIndex].classList.add("balls");
            }), 1e3);
            setTimeout((() => {
                mini_squares[balls[2].currentIndex].classList.add("balls");
            }), 2e3);
            setTimeout((() => {
                mini_squares[balls[3].currentIndex].classList.add("balls");
            }), 3e3);
        } else if (3 == sessionStorage.getItem("active-level")) {
            mini_squares[balls[0].currentIndex].classList.add("balls");
            setTimeout((() => {
                mini_squares[balls[1].currentIndex].classList.add("balls");
            }), 1e3);
        }
    }
    function move_balls(ball) {
        const directions = [ +1, -1 ];
        ball.timerId = setInterval((function() {
            mini_squares[ball.currentIndex].classList.remove("balls");
            if (!mini_squares[ball.currentIndex + width].classList.contains("ball-white")) {
                let current_direction = width + 2;
                ball.currentIndex += current_direction;
                mini_squares[ball.currentIndex].classList.add("balls");
            } else {
                let current_direction = directions[Math.floor(Math.random() * (2 - 0) + 0)];
                ball.currentIndex += current_direction;
                mini_squares[ball.currentIndex].classList.add("balls");
            }
            check_mini_game_over(ball);
        }), ball.speed);
    }
    function check_mini_game_over(ball) {
        if (mini_squares[ball.currentIndex + width].classList.contains("multiply-25")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_25", add_bonus_balls(25));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-5")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_5", add_bonus_balls(5));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-0-5")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_05", add_bonus_balls(.5));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-1-5")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_15", add_bonus_balls(1.5));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-1-75")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_17", add_bonus_balls(1.75));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-10")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_10", add_bonus_balls(10));
        } else if (mini_squares[ball.currentIndex + width].classList.contains("multiply-3")) {
            clearInterval(ball.timerId);
            mini_squares[ball.currentIndex].classList.add("_hide");
            get_points_ball(".bonus__box_3", add_bonus_balls(3));
        }
    }
    function add_bonus_balls(count) {
        if (1 == sessionStorage.getItem("active-level")) {
            points.textContent = +points.innerHTML + Math.floor(10 * count);
            sessionStorage.setItem("points", points.innerHTML);
            return Math.floor(10 * count);
        } else if (2 == sessionStorage.getItem("active-level")) {
            points.textContent = +points.innerHTML + Math.floor(25 * count);
            sessionStorage.setItem("points", points.innerHTML);
            return Math.floor(25 * count);
        } else if (3 == sessionStorage.getItem("active-level")) {
            points.textContent = +points.innerHTML + Math.floor(50 * count);
            sessionStorage.setItem("points", points.innerHTML);
            return Math.floor(50 * count);
        }
    }
    function get_points_ball(block, points) {
        let point = document.createElement("div");
        point.classList.add("bonus__text");
        point.textContent = `+${points}`;
        document.querySelector(block).append(point);
        setTimeout((() => {
            point.remove();
        }), 1e3);
    }
    const grid = document.querySelector(".game__grid");
    const width = 27;
    let layout;
    var shield = false;
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
        squares[pacmanCurrentIndex].classList.add("pac-man");
        squares[pacmanCurrentIndex].classList.add("_pac-right");
    }
    function start_check_functions() {
        pac_dot_eating();
        power_pellet_eating();
        check_game_over();
        check_for_win();
    }
    function add_shield_pacman() {
        shield = true;
    }
    function remove_shield_pacman() {
        shield = false;
        squares[pacmanCurrentIndex].classList.remove("_shield");
    }
    function remove_pacman() {
        if (squares[pacmanCurrentIndex].classList.contains("_pac-up")) {
            squares[pacmanCurrentIndex].classList.remove("_pac-up");
            squares[pacmanCurrentIndex].classList.remove("pac-man");
        } else if (squares[pacmanCurrentIndex].classList.contains("_pac-right")) {
            squares[pacmanCurrentIndex].classList.remove("_pac-right");
            squares[pacmanCurrentIndex].classList.remove("pac-man");
        } else if (squares[pacmanCurrentIndex].classList.contains("_pac-down")) {
            squares[pacmanCurrentIndex].classList.remove("_pac-down");
            squares[pacmanCurrentIndex].classList.remove("pac-man");
        } else if (squares[pacmanCurrentIndex].classList.contains("_pac-left")) {
            squares[pacmanCurrentIndex].classList.remove("_pac-left");
            squares[pacmanCurrentIndex].classList.remove("pac-man");
        }
        if (shield) squares[pacmanCurrentIndex].classList.remove("_shield");
    }
    function move_pacman_left() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex - 1].classList.contains("wall") && !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")) pacmanCurrentIndex -= 1;
            squares[pacmanCurrentIndex].classList.add("_pac-left");
            squares[pacmanCurrentIndex].classList.add("pac-man");
            if (shield) squares[pacmanCurrentIndex].classList.add("_shield");
            start_check_functions();
        }), 250);
    }
    function move_pacman_up() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex - width].classList.contains("wall") && !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")) pacmanCurrentIndex -= width;
            squares[pacmanCurrentIndex].classList.add("_pac-up");
            squares[pacmanCurrentIndex].classList.add("pac-man");
            if (shield) squares[pacmanCurrentIndex].classList.add("_shield");
            start_check_functions();
        }), 250);
    }
    function move_pacman_right() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex + 1].classList.contains("wall") && !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")) pacmanCurrentIndex += 1;
            squares[pacmanCurrentIndex].classList.add("_pac-right");
            squares[pacmanCurrentIndex].classList.add("pac-man");
            if (shield) squares[pacmanCurrentIndex].classList.add("_shield");
            start_check_functions();
        }), 250);
    }
    function move_pacman_bottom() {
        move_timer = setInterval((() => {
            remove_pacman();
            if (pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex + width].classList.contains("wall") && !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")) pacmanCurrentIndex += width;
            squares[pacmanCurrentIndex].classList.add("_pac-down");
            squares[pacmanCurrentIndex].classList.add("pac-man");
            if (shield) squares[pacmanCurrentIndex].classList.add("_shield");
            start_check_functions();
        }), 250);
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
            show_what_pac_eating("stone-orange.svg", 30);
            squares[pacmanCurrentIndex].classList.remove("pac-big-dot");
        }
    }
    function show_what_pac_eating(name, count) {
        let dinner = document.createElement("div");
        dinner.classList.add("controls__bonus-item");
        let dinner_image = document.createElement("div");
        dinner_image.classList.add("controls__image");
        let dinner_image_inner = document.createElement("img");
        dinner_image_inner.setAttribute("src", `img/game/${name}`);
        let dinner_count = document.createElement("div");
        dinner_count.classList.add("controls__count");
        dinner_count.textContent = `+${count}`;
        dinner_image.append(dinner_image_inner);
        dinner.append(dinner_image, dinner_count);
        document.querySelector(".game__controls").append(dinner);
        setTimeout((() => {
            dinner.remove();
        }), 2500);
    }
    function power_pellet_eating() {
        if (squares[pacmanCurrentIndex].classList.contains("power-banan") || squares[pacmanCurrentIndex].classList.contains("power-cherry") || squares[pacmanCurrentIndex].classList.contains("power-lemon") || squares[pacmanCurrentIndex].classList.contains("power-slotmashine")) {
            let score = document.querySelector(".header__count");
            score.classList.add("_anim");
            setTimeout((() => {
                score.classList.remove("_anim");
            }), 1500);
            ghosts.forEach((el => el.isScared = true));
            setTimeout((() => {
                un_scared_ghosts();
            }), 5e3);
            if (squares[pacmanCurrentIndex].classList.contains("power-banan")) {
                squares[pacmanCurrentIndex].classList.remove("power-banan");
                score.textContent = +score.innerHTML + 150;
                sessionStorage.setItem("points", score.innerHTML);
                show_what_pac_eating("banan.png", 150);
            } else if (squares[pacmanCurrentIndex].classList.contains("power-cherry")) {
                score.textContent = +score.innerHTML + 200;
                sessionStorage.setItem("points", score.innerHTML);
                show_what_pac_eating("cherry.svg", 200);
                squares[pacmanCurrentIndex].classList.remove("power-cherry");
            } else if (squares[pacmanCurrentIndex].classList.contains("power-lemon")) {
                squares[pacmanCurrentIndex].classList.remove("power-lemon");
                score.textContent = +score.innerHTML + 100;
                sessionStorage.setItem("points", score.innerHTML);
                show_what_pac_eating("lemon.png", 100);
            } else if (squares[pacmanCurrentIndex].classList.contains("power-slotmashine")) {
                score.textContent = +score.innerHTML + 250;
                sessionStorage.setItem("points", score.innerHTML);
                show_what_pac_eating("slotmashine.png", 250);
                squares[pacmanCurrentIndex].classList.remove("power-slotmashine");
            }
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
    if (document.querySelector(".game_one")) ghosts = [ new Ghost("blinky", 252, 250), new Ghost("pinky", 29, 400) ]; else if (document.querySelector(".game_two")) ghosts = [ new Ghost("blinky", 252, 250), new Ghost("pinky", 29, 400), new Ghost("inky", 500, 300) ]; else if (document.querySelector(".game_three")) ghosts = [ new Ghost("blinky", 252, 100), new Ghost("pinky", 29, 250), new Ghost("inky", 500, 200), new Ghost("clyde", 535, 250), new Ghost("clyde", 260, 250) ];
    if (document.querySelector(".game")) {
        ghosts.forEach((el => {
            squares[el.currentIndex].classList.add(el.className);
            squares[el.currentIndex].classList.add("ghost");
        }));
        setTimeout((() => {
            ghosts.forEach((el => move_ghost(el)));
        }), 2e3);
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
            if (ghost.isScared && squares[ghost.currentIndex].classList.contains("_pac-left") || ghost.isScared && squares[ghost.currentIndex].classList.contains("_pac-right") || ghost.isScared && squares[ghost.currentIndex].classList.contains("_pac-up") || ghost.isScared && squares[ghost.currentIndex].classList.contains("_pac-down")) {
                if (squares[ghost.currentIndex].classList.contains("_left")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_left"); else if (squares[ghost.currentIndex].classList.contains("_right")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_right"); else if (squares[ghost.currentIndex].classList.contains("_up")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_up"); else if (squares[ghost.currentIndex].classList.contains("_down")) squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost", "_down");
                ghost.currentIndex = ghost.startIndex;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost", "_left");
            }
            check_game_over();
        }), ghost.speed);
    }
    function check_game_over() {
        if (squares[pacmanCurrentIndex].classList.contains("ghost") && !squares[pacmanCurrentIndex].classList.contains("scared-ghost") && !squares[pacmanCurrentIndex].classList.contains("_shield")) {
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
                squares[418].classList.add("pac-man");
                squares[418].classList.add("_pac-right");
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
            if (document.querySelector(".game_one")) sessionStorage.setItem("game-one", true); else if (document.querySelector(".game_two")) sessionStorage.setItem("game-two", true);
        }
    }
    window["FLS"] = true;
    isWebp();
})();