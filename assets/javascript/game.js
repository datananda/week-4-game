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

let character0 = new Character("Cat", 90, 4, 20);
let character1 = new Character("Mouse", 100, 6, 25);
let character2 = new Character("Racoon", 110, 8, 30);
let character3 = new Character("Dog", 120, 10, 35);
let characters = [character0, character1, character2, character3];

let game = {
    userCharacter: '',
    defender: '',
    enemies: [character0, character1, character2, character3],
    gameOver: false,
    selectingCharacters: true,
    pickCharacters: function(charDiv) {
        let clickedChar = characters[charDiv.attr("value")];
        if (this.selectingCharacters) {
            if (game.userCharacter === '') {
                this.userCharacter = clickedChar;
                charDiv.attr("class","user-character");
                charDiv.css("border","5px solid green");
                this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
                $(".enemy").each(function() {
                    $("#enemy-container").append($(this));
                });
                console.log('User character:');
                console.log(this.userCharacter);
            }
            else if (game.defender === '') {
                this.defender = clickedChar;
                charDiv.attr("class","defender");
                charDiv.css("border","5px solid red");
                this.selectingCharacters = false;
                this.enemies.splice(this.enemies.indexOf(clickedChar), 1);
                $("#defender-container").append(charDiv);
                console.log('Defender:');
                console.log(this.defender);
            }
            
            console.log('Enemies:');
            console.log(this.enemies);
        }
    },
    attack: function() {
        if (!this.selectingCharacters) {
            console.log(`You attacked ${this.defender.name} for ${this.userCharacter.attackPower} damage.`);
            console.log(`${this.defender.name} attacked you back for ${this.defender.counterPower} damage.`);
            this.defender.healthPoints -= this.userCharacter.attackPower;
            this.userCharacter.healthPoints -= this.defender.counterPower;
            this.userCharacter.attackPower += this.userCharacter.attackPower;
            if (!this.userCharacter.checkAlive()) {
                console.log("You dead");
                // TODO: start new game
            }
            else if (!this.defender.checkAlive()) {
                console.log("You victorious");
                // TODO: remove current defender and select a new one
                this.selectingCharacters = true;
            }
        }
    }
}

$(".enemy").on("click", function() {
    game.pickCharacters($(this));
});

$("#btn-attack").on("click", function() {
    game.attack();
})