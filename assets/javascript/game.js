/*---------------------------
    GLOBAL VARIABLES
---------------------------*/
let startingHP = [90, 100, 110, 120];
let startingAttackPower = [4, 6, 8, 10];
let character0 = new Character("Donald Trump", "US", 90, 4, 20);
let character1 = new Character("Vladimir Putin", "RU", 100, 6, 25);
let character2 = new Character("Kim Jong Un", "KP", 110, 8, 30);
let character3 = new Character("Xi Jinping", "CN", 120, 10, 35);
const characters = [character0, character1, character2, character3];

let game = {
    userCharacter: '',
    opponent: '',
    enemies: [character0, character1, character2, character3],
    startGame: function () {
        characters.forEach(function(elem, i) {
            elem.healthPoints = startingHP[i];
            elem.attackPower = startingAttackPower[i];
            elem.baseAttackPower = startingAttackPower[i];
            $(`img:eq(${i})`).attr("src",`assets/images/${elem.name.toLowerCase()}.png`);
            $(`img:eq(${i})`).attr("alt",`cartoon of ${elem.name}`);
            $(`.health:eq(${i})`).text(elem.healthPoints);  
            $(`.figure-caption:eq(${i})`).text(elem.name);
            $(`.flag-icon:eq(${i})`).addClass(`flag-icon-${elem.country.toLowerCase()}`);
        });
    },
    pickCharacters: function (charDiv) {
        // PICK USER CHARACTER
        let clickedChar = characters[charDiv.attr("value")];
        if (!this.userCharacter) {
            this.userCharacter = clickedChar;
            charDiv.attr("id", "user-character");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $(".character:not([id])").each(function (i) {
                $(this).addClass("enemy");
                $(`#select-opponent .col-7:nth-child(${i + 1})`).append($(this));
            });
            $("#select-character").addClass("d-none");
            $("#select-opponent").removeClass("d-none");
            $("#character-container").append(charDiv);
        }
        // PICK OPPONENT
        else if (!this.opponent) {
            this.opponent = clickedChar;
            charDiv.attr("id", "opponent");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $(".enemy:not([id])").each(function (i) {
                $(`#enemy-container .col-3:nth-child(${i + 1})`).append($(this));
            });
            $("#opponent-container").append(charDiv);
            $("#selection-container").addClass("d-none");
            $("#play-container").removeClass("d-none");
            $("#attack-outcome").text('');
            $("#attack-outcome").removeClass("bg-secondary bg-success");
            formatCircleType();
        }
    },
    attack: function () {
        if (!$(".character[id='opponent']").length) {
            $("#attack-outcome").removeClass("bg-success").addClass("bg-secondary");
            $("#attack-outcome").text("No enemy here.\nSelect the enemy you will fight next.");
        }
        else {
            let attackSummary = `You attacked ${this.opponent.name} for ${this.userCharacter.attackPower} damage.\n${this.opponent.name} attacked you back for ${this.opponent.counterPower} damage.`;
            this.opponent.healthPoints -= this.userCharacter.attackPower;
            $(`#opponent .health`).text(this.opponent.healthPoints);
            this.userCharacter.healthPoints -= this.opponent.counterPower;
            $(`#user-character .health`).text(this.userCharacter.healthPoints);
            this.userCharacter.attackPower += this.userCharacter.baseAttackPower;
            // USER CHARACTER KILLED
            if (!this.userCharacter.checkAlive()) {
                $("#attack-outcome").removeClass("bg-danger bg-success").addClass("bg-secondary");
                $("#attack-outcome").text(`You've been defeated by ${this.opponent.name}.\nGame Over!`);
                $("#btn-attack").addClass("d-none");
                $("#btn-reset").removeClass("d-none");
            }
            // OPPONENT KILLED
            else if (!this.opponent.checkAlive()) {
                $("#attack-outcome").removeClass("bg-danger bg-secondary").addClass("bg-success");
                $("#attack-outcome").text(`You have defeated ${this.opponent.name}.\nSelect the enemy you will fight next.`);
                $("#opponent").removeAttr("id").addClass("d-none");
                this.opponent = '';
            }
            else {
                $("#attack-outcome").removeClass("bg-success bg-secondary").addClass("bg-danger");
                $("#attack-outcome").text(attackSummary);
            }
        }
    },
    resetGame: function () {
        this.userCharacter = '';
        this.opponent = '';
        this.enemies = [character0, character1, character2, character3];
        $("#attack-outcome").text('');
        $(".character").removeAttr("id").removeClass("enemy d-none");
        for (let i = 0; i < characters.length; i++) {
            $(`#select-character .col-7:eq(${i})`).append($(`.character[value=${i}]`));
        }
        $("#btn-reset").addClass("d-none");
        $("#btn-attack").removeClass("d-none");
        $("#select-opponent").addClass("d-none");
        $("#play-container").addClass("d-none");
        $("#selection-container").removeClass("d-none");
        $("#select-character").removeClass("d-none");
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
    game.startGame();
    formatCircleType();
});