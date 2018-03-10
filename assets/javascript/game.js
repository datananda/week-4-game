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
    opponent: '',
    enemies: [character0, character1, character2, character3],
    pickCharacters: function (charDiv) {
        let clickedChar = characters[charDiv.attr("value")];
        console.log('You clicked on:', clickedChar);
        if (!this.userCharacter) {
            this.userCharacter = clickedChar;
            charDiv.attr("id", "user-character");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $(".character:not([id])").each(function () {
                $(this).addClass("enemy");
                $("#select-opponent").append($(this));
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
            $(".enemy:not([id])").each(function () {
                $("#enemy-container").append($(this));
            });
            $("#opponent-container").append(charDiv);
            $("#selection-container").addClass("d-none");
            $("#play-container").removeClass("d-none");
            $("#attack-outcome").text('');
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
        $(".character").removeAttr("id").removeClass().addClass("col-auto character");
        for (let i = 0; i < characters.length; i++) {
            console.log($(`.character[value=${i}]`));
            $("#select-character > .col").append($(`.character[value=${i}]`));
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
    game.resetGame();
})