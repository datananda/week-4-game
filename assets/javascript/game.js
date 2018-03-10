/*---------------------------
    GLOBAL VARIABLES
---------------------------*/
let character0 = new Character("Cat", 90, 4, 20);
let character1 = new Character("Mouse", 100, 6, 25);
let character2 = new Character("Racoon", 110, 8, 30);
let character3 = new Character("Dog", 120, 10, 35);
const characters = [character0, character1, character2, character3];

let game = {
    userCharacter: '',
    defender: '',
    enemies: [character0, character1, character2, character3],
    pickCharacters: function (charDiv) {
        let clickedChar = characters[charDiv.attr("value")];
        console.log('You clicked on:');
        console.log(clickedChar);
        if (!$(".character[id='user-character']").length) {
            this.userCharacter = clickedChar;
            charDiv.attr("id", "user-character");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $(".character").each(function () {
                if (!$(this).attr("id")) {
                    $(this).addClass("enemy");
                    $("#defender-container").append($(this));
                }
            });
            $("h2").replaceWith(toH3($("h2")).text("Your Character"));
            $("#defender-container").parent().before($("<h2>").addClass("col-12").text("Pick Your Opponent"));
            console.log('User character:');
            console.log(this.userCharacter);
        }
        else if (!$(".character[id='defender']").length) {
            this.defender = clickedChar;
            charDiv.attr("id", "defender");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $("#defender-container").append($("#defender"));
            $(".enemy").each(function () {
                if (!$(this).attr("id")) {
                    $("#enemy-container").append($(this));
                }
            });
            $("h2").replaceWith(toH3($("h2")).text("Your Opponent"));
            $("h4").removeClass("d-none");
            $("h3").parent().parent().removeClass().addClass("col-4");
            $("#btn-attack").removeClass("d-none");
            console.log('Defender:');
            console.log(this.defender);
        }
        console.log('Enemies:');
        console.log(this.enemies);
    },
    attack: function () {
        if (!$(".character[id='defender']").length) {
            $("#attack-outcome").text("No enemy here. Select the enemy you will fight next.");
        }
        else {
            if ($("#btn-reset").hasClass("d-none")) {
                let attackSummary = `You attacked ${this.defender.name} for ${this.userCharacter.attackPower} damage.\n${this.defender.name} attacked you back for ${this.defender.counterPower} damage.`;
                this.defender.healthPoints -= this.userCharacter.attackPower;
                this.userCharacter.healthPoints -= this.defender.counterPower;
                this.userCharacter.attackPower += this.userCharacter.attackPower;
                if (!this.userCharacter.checkAlive()) {
                    console.log("You're dead");
                    $("#attack-outcome").text(`You've been defeated by ${this.defender.name}. Game Over!`);
                    $("#btn-attack").addClass("d-none");
                    $("#btn-reset").removeClass("d-none");
                }
                else if (!this.defender.checkAlive()) {
                    console.log("You're victorious");
                    $("#attack-outcome").text(`You have defeated ${this.defender.name}. Select the enemy you will fight next.`);
                    $("#defender").removeAttr("id").addClass("d-none");
                }
                else {
                    $("#attack-outcome").text(attackSummary);
                }
            }
        }
    },
    resetGame: function () {
        this.userCharacter = '';
        this.defender = '';
        this.enemies = [character0, character1, character2, character3];
        $("#attack-outcome").text('');
        $(".character").removeAttr("id");
        $(".character").removeClass().addClass("character");
        for (let i = 0; i < characters.length; i++) {
            $("#starting-container").append($(`.character[value=${i}]`));
        }
        $("#btn-reset").addClass("d-none");
        // TODO: replace the whole body with a copy taken at initialization
        // TODO: need to reset all character HP & attack power
    }
}

/*---------------------------
    CONSTRUCTORS & FUNCTIONS
---------------------------*/
function Character(name, healthPoints, attackPower, counterPower) {
    this.name = name;
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

function toH3(obj) {
    return $("<h3>").addClass(obj.attr("class"));
}

/*---------------------------
    MAIN PROCESS
---------------------------*/
$(".character").on("click", function () {
    game.pickCharacters($(this));
});

$("#btn-attack").on("click", function () {
    game.attack();
})

$("#btn-reset").on("click", function () {
    console.log("clicked reset button");
    game.resetGame();
})