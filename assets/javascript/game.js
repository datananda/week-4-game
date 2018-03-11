/*---------------------------
    GLOBAL VARIABLES
---------------------------*/
let character0 = new Character("Donald Trump", "US", 90, 4, 20);
let character1 = new Character("Vladimir Putin", "RU", 100, 6, 25);
let character2 = new Character("Kim Jong Un", "KP", 110, 8, 30);
let character3 = new Character("Xi Jinping", "CN", 120, 10, 35);
const characters = [character0, character1, character2, character3];


/* <div class="character" value="0">
<figure class="figure">
    <figcaption class="figure-caption">Donald Trump</figcaption>
    <img src="assets/images/trump.png" class="figure-img img-fluid rounded-circle border" alt="cartoon of Donald Trump">
</figure>
<div class="char-stats position-absolute d-flex justify-content-between w-75">
    <div class="health border bg-light">120</div>
    <span class="flag-icon flag-icon-us border"></span>
</div>
</div> */

let game = {
    userCharacter: '',
    opponent: '',
    enemies: [character0, character1, character2, character3],
    startGame: function () {
        characters.forEach(function(elem, i) {
            $(`img:eq(${i})`).attr("src",`assets/images/${elem.name.toLowerCase()}.png`);
            $(`img:eq(${i})`).attr("alt",`cartoon of ${elem.name}`);
            $(`.health:eq(${i})`).text(elem.healthPoints);  
            $(`.figure-caption:eq(${i})`).text(elem.name);
            $(`.flag-icon:eq(${i})`).addClass(`flag-icon-${elem.country.toLowerCase()}`);
        });
    },
    pickCharacters: function (charDiv) {
        let clickedChar = characters[charDiv.attr("value")];
        console.log('You clicked on:', clickedChar);
        if (!this.userCharacter) {
            this.userCharacter = clickedChar;
            charDiv.attr("id", "user-character");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $(".character:not([id])").each(function (i) {
                console.log("Moving enemy:", $(this));
                $(this).addClass("enemy");
                $(`#select-opponent .col-6:nth-child(${i + 1})`).append($(this));
            });
            $("#select-character").addClass("d-none");
            $("#select-opponent").removeClass("d-none");
            $("#character-container").append(charDiv);
            console.log('User character:', this.userCharacter);
        }
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
            formatCircleType();
            console.log('Opponent:', this.opponent);
        }
        console.log('Enemies:', this.enemies);
    },
    attack: function () {
        if (!$(".character[id='opponent']").length) {
            $("#attack-outcome").text("No enemy here. Select the enemy you will fight next.");
        }
        else {
            let attackSummary = `You attacked ${this.opponent.name} for ${this.userCharacter.attackPower} damage.\n${this.opponent.name} attacked you back for ${this.opponent.counterPower} damage.`;
            this.opponent.healthPoints -= this.userCharacter.attackPower;
            this.userCharacter.healthPoints -= this.opponent.counterPower;
            this.userCharacter.attackPower += this.userCharacter.attackPower;
            if (!this.userCharacter.checkAlive()) {
                console.log("You're dead");
                $("#attack-outcome").text(`You've been defeated by ${this.opponent.name}. Game Over!`);
                $("#btn-attack").addClass("d-none");
                $("#btn-reset").removeClass("d-none");
            }
            else if (!this.opponent.checkAlive()) {
                console.log("You're victorious");
                $("#attack-outcome").text(`You have defeated ${this.opponent.name}. Select the enemy you will fight next.`);
                $("#opponent").removeAttr("id").addClass("d-none");
                this.opponent = '';
            }
            else {
                $("#attack-outcome").text(attackSummary);
            }
            // TODO: update HP on user char and opponent in the DOM
        }
    },
    resetGame: function () {
        this.userCharacter = '';
        this.opponent = '';
        this.enemies = [character0, character1, character2, character3];
        $("#attack-outcome").text('');
        $(".character").removeAttr("id").removeClass("enemy");
        for (let i = 0; i < characters.length; i++) {
            console.log($(`.character[value=${i}]`));
            $(`#select-character .col-6:nth-child(${i + 1})`).append($(`.character[value=${i}]`));
        }
        $("#btn-reset").addClass("d-none");
        $("#btn-attack").removeClass("d-none");
        $("#select-opponent").addClass("d-none");
        $("#play-container").addClass("d-none");
        $("#selection-container").removeClass("d-none");
        $("#select-character").removeClass("d-none");
        // TODO: need to reset all character HP & attack power & update numbers in the DOM
    }
}

/*---------------------------
    CONSTRUCTORS & FUNCTIONS
---------------------------*/
function Character(name, country, healthPoints, attackPower, counterPower) {
    this.name = name;
    this.country = country;
    this.healthPoints = healthPoints;
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
        console.log(captionRadius[i])
        circleType[i] = new CircleType(elem).radius(captionRadius[i]);
    });
}

/*---------------------------
    MAIN PROCESS
---------------------------*/
$(window).on("resize", function () {
    console.log("updating radius");
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
    console.log( "ready!" );
    game.startGame();
    formatCircleType();
});