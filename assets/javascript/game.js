/*---------------------------
    GLOBAL VARIABLES
---------------------------*/
let names = ["Donald Trump", "Vladimir Putin", "Kim Jong Un", "Xi Jinping"];
let countries = ["US","RU","KP","CN"];
let startingHP = [120, 180, 100, 150];
let startingAttackPower = [8, 8, 30, 20];
let startingCounter = [15, 25, 5, 20];
let characters = [];

let game = {
    userCharacter: '',
    opponent: '',
    enemies: [],
    startGame: function () {
        // UPDATE THE DOM WITH CHARACTER INFO
        characters.forEach(function(elem, i) {
            $(`img:eq(${i})`).attr("src",`assets/images/${elem.name.toLowerCase()}.png`);
            $(`img:eq(${i})`).attr("alt",`cartoon of ${elem.name}`);
            $(`.health:eq(${i})`).text(elem.healthPoints);  
            $(`.figure-caption:eq(${i})`).text(elem.name);
            $(`.flag-icon:eq(${i})`).addClass(`flag-icon-${elem.country.toLowerCase()}`);
            game.enemies.push(elem);
        });
    },
    pickCharacters: function (charDiv) {
        let clickedChar = characters[charDiv.attr("value")];
        this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
        // PICK USER CHARACTER
        if (!this.userCharacter) {
            this.userCharacter = clickedChar;
            charDiv.attr("id", "user-character");
            $(".character:not([id])").each(function (i) {
                $(this).addClass("enemy");
                $(`#select-opponent .col-7:nth-child(${i + 1})`).append($(this));
            });
            $("#select-character, #select-opponent").toggleClass("d-none");
            $("#character-container").append(charDiv);
        }
        // PICK OPPONENT
        else if (!this.opponent) {
            this.opponent = clickedChar;
            charDiv.attr("id", "opponent");
            $(".enemy:not([id])").each(function (i) {
                $(`#enemy-container .col-3:nth-child(${i + 1})`).append($(this));
            });
            $("#selection-container").addClass("d-none");
            $("#play-container").removeClass("d-none");
            $("#attack-outcome").text('');
            $("#attack-outcome").removeClass("bg-secondary bg-success");
            $("#opponent-container").append(charDiv);
            formatCircleType();
        }
    },
    attack: function () {
        if (!$(".character[id='opponent']").length) {
            $("#attack-outcome").removeClass("bg-success").addClass("bg-secondary");
            $("#attack-outcome").text("No enemy here.\nSelect the enemy you will fight next.");
        }
        else {
            this.opponent.healthPoints -= this.userCharacter.attackPower;
            $(`#opponent .health`).text(this.opponent.healthPoints);
            this.userCharacter.healthPoints -= this.opponent.counterPower;
            $(`#user-character .health`).text(this.userCharacter.healthPoints);
            // USER CHARACTER KILLED
            if (!this.userCharacter.checkAlive()) {
                $("#attack-outcome").removeClass("bg-danger bg-success").addClass("bg-secondary");
                $("#attack-outcome").text(`You've been defeated by ${this.opponent.name}.\nGame Over!`);
                $("#btn-attack, #btn-reset").toggleClass("d-none");
            }
            // OPPONENT KILLED
            else if (!this.opponent.checkAlive()) {
                // TODO: CHECK IF GAME OVER
                $("#attack-outcome").removeClass("bg-danger bg-secondary").addClass("bg-success");
                $("#opponent").removeAttr("id").addClass("d-none");
                if (this.enemies.length > 0) {
                    $("#attack-outcome").text(`You have defeated ${this.opponent.name}.\nSelect the enemy you will fight next.`);
                }
                else {
                    $("#attack-outcome").text('You are the victorious and supreme leader of the world.\nGame Over.');
                    $("#btn-attack, #btn-reset").toggleClass("d-none");
                }
                this.opponent = '';
            }
            // ATTACK DIDN'T KILL ANYONE
            else {
                $("#attack-outcome").removeClass("bg-success bg-secondary").addClass("bg-danger");
                $("#attack-outcome").text(`You attacked ${this.opponent.name} for ${this.userCharacter.attackPower} damage.\n${this.opponent.name} attacked you back for ${this.opponent.counterPower} damage.`);
            }
            this.userCharacter.attackPower += this.userCharacter.baseAttackPower;
        }
    },
    resetGame: function () {
        characters.forEach(function(elem, i) {
            elem.healthPoints = startingHP[i];
            elem.attackPower = startingAttackPower[i];
            elem.baseAttackPower = startingAttackPower[i];
        });
        this.userCharacter = '';
        this.opponent = '';
        this.enemies = [];
        $("#attack-outcome").text('');
        $(".character").removeAttr("id").removeClass("enemy d-none");
        for (let i = 0; i < characters.length; i++) {
            $(`#select-character .col-7:eq(${i})`).append($(`.character[value=${i}]`));
        }
        $("#btn-reset, #btn-attack, #select-opponent, #play-container, #selection-container, #select-character").toggleClass("d-none");
        $("#attack-outcome").removeClass("bg-secondary bg-success");
        this.startGame();
        formatCircleType();
    }
}

/*---------------------------
    CONSTRUCTORS & FUNCTIONS
---------------------------*/
function Character(name, country, healthPoints, attackPower, counterPower) {
    this.name = name;
    this.country = country;
    this.healthPoints = healthPoints;
    this.baseAttackPower = attackPower;
    this.attackPower = attackPower;
    this.counterPower = counterPower;
    this.checkAlive = function () {
        if (this.healthPoints > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

function formatCircleType() {
    let captionRadius = [];
    let textTop = document.getElementsByClassName("figure-caption");
    let circleType = [];

    $("img").each(function (i) {
        captionRadius[i] = 4 * $(this).width() / 5;
    });

    [].forEach.call(textTop, function (elem, i) {
        circleType[i] = new CircleType(elem).radius(captionRadius[i]);
    });
}

/*---------------------------
    MAIN PROCESS
---------------------------*/
$(window).on("resize", function () {
    formatCircleType();
}).resize();

$(".character").on("click", function () {
    game.pickCharacters($(this));
});

$("#btn-attack").on("click", function () {
    game.attack();
})

$("#btn-reset").on("click", function () {
    game.resetGame();
})

$( document ).ready(function() {
    // INITIALIZE CHARACTERS
    names.forEach(function(elem, i) {
        characters.push(new Character(names[i], countries[i], startingHP[i], startingAttackPower[i], startingCounter[i]));
    });
    game.startGame();
    formatCircleType();
});