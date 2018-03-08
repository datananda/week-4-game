function Character(name, healthPoints, attackPower, counterPower) {
    this.name = name;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.counterPower = counterPower;
    this.isEnemy = false;
    this.isDefender = false;
    this.attack = function () {
        console.log("attacking");
    }
    this.counter = function () {
        console.log("counter");
    }
    this.checkHealth = function () {
        if (this.healthPoints > 0) {
            console.log("healthy");
        }
        else {
            console.log("dead");
        }
    }
    this.takeHit = function () {
        console.log("i got hit");
    }
}

let character0 = new Character("Character 1", 90, 4, 20);
let character1 = new Character("Character 2", 100, 6, 25);
let character2 = new Character("Character 3", 110, 8, 30);
let character3 = new Character("Character 4", 120, 10, 35);

let characters = [character0, character1, character2, character3];

$(".character").on("click", function() {
    console.log(characters[$(this).attr("id").slice(-1)]);
});