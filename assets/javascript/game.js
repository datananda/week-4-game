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
                    $("#enemy-container").append($(this));
                }
            });
            console.log('User character:');
            console.log(this.userCharacter);
        }
        else if (!$(".character[id='defender']").length) {
            this.defender = clickedChar;
            charDiv.attr("id", "defender");
            this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
            $("#defender-container").append(charDiv);
            console.log('Defender:');
            console.log(this.defender);
        }
        console.log('Enemies:');
        console.log(this.enemies);
    },
    attack: function () {
        if ($(".character[id='defender']").length) {
            console.log(`You attacked ${this.defender.name} for ${this.userCharacter.attackPower} damage.`);
            console.log(`${this.defender.name} attacked you back for ${this.defender.counterPower} damage.`);
            this.defender.healthPoints -= this.userCharacter.attackPower;
            this.userCharacter.healthPoints -= this.defender.counterPower;
            this.userCharacter.attackPower += this.userCharacter.attackPower;
            if (!this.userCharacter.checkAlive()) {
                console.log("You're dead");
                $("#btn-restart").removeClass();
            }
            else if (!this.defender.checkAlive()) {
                console.log("You're victorious");
                // TODO: remove current defender and select a new one
                $("#defender").removeAttr("id").addClass("hidden");
                this.selectingCharacters = true;
            }
        }
    },
    resetGame: function () {
        this.userCharacter = '';
        this.defender = '';
        this.enemies = [character0, character1, character2, character3];
        this.selectingCharacters = true;
        $(".character").removeAttr("id");
        $(".character").removeClass().addClass("character");
        for (let i = 0; i < characters.length; i++) {
            $(".starting-container").append($(`.character[value=${i}]`));
        }
        $("#btn-restart").addClass("hidden");
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

$("#btn-restart").on("click", function () {
    console.log("clicked restart button");
    game.resetGame();
})