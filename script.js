let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");

const weapons = [
    {
        name: "stick",
        power: 5
    },
        {
        name: "dagger",
        power: 30
    },
        {
        name: "claw hammer",
        power: 50
    },
        {
        name: "sword",
        power: 100
    },
];

monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
        {
        name: "fanged beast",
        level: 8,
        health: 60
    },
        {
        name: "Dragon",
        level: 20,
        health: 300
    },
]


const locations = [
    {
        name: "town square",
        "button text" : ["Go to store", "Go to cave", "Fight dragon"],
        "button functions" : [goStore, goCave, fightDragon],
        text: "You are in the town square. \nYou see a sign that says \"store\".\n"
    },
    {
        name: "store",
        "button text" : ["Buy 10 Health(10 gold)", "Buy weapon(30 gold)","Go to Town Square"],
        "button functions" : [buy10Health, buyWeapon, goToTownSquare],
        text: "You entered the store."
    },
    {
        name: "cave",
        "button text" : ["Fight Slime", "Fight Fanged Beast","Go to Town Square"],
        "button functions" : [fightSlime, fightFangedBeast, goToTownSquare],
        text: "You entered the cave. \nYou see some monsters.\n"
    },
    {
        name: "fight",
        "button text" : ["Attack", "Dodge", "Run"],
        "button functions" : [attack, dodge, goToTownSquare],
        text: "You are fighting a monster!"
    },
    {
        name: "kill monster",
        "button text" : ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
        "button functions" : [goToTownSquare, goToTownSquare, easterEgg],
        text: "You killed a monster! \nYou gain experience and gold.\n"
    },
    {
        name: "lose",
        "button text" : ["Replay?", "Replay?", "Replay?"],
        "button functions" : [restart, restart, restart],
        text: "You died.\n"
    },
    {
        name: "win game",
        "button text" : ["Replay?", "Replay?", "Replay?"],
        "button functions" : [restart, restart, restart],
        text: "You saved the town! \nYou are now the dragon repeller!\n"
    },
    {
        name: "easter egg",
        "button text" : ["2", "8", "Go to Town Square"],
        "button functions" : [pickTwo, pickEight, goToTownSquare],
        text: "You found a secret game! \nPick a number above. Ten numbers will be chosen randomly between 0 and 10. If the number you choose matches one of the other numbers, you win! \n"
    }

];

// Initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Functions

function update(locations) {
    monsterStats.style.display = "none";
    button1.innerText = locations["button text"][0];
    button2.innerText = locations["button text"][1];
    button3.innerText = locations["button text"][2];
    text.innerText = locations.text,
    button1.onclick = locations["button functions"][0];
    button2.onclick = locations["button functions"][1];
    button3.onclick = locations["button functions"][2];
}

function goToTownSquare() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}



function buy10Health() {
    if (gold >= 10 ) {
        
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;

    } else {
        text.innerText = "You do not have enough gold to buy health.\n";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30){
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You bought a " + newWeapon + "!\n";
            inventory.push(newWeapon);
            text.innerText += "In your inventory you have: " + inventory.join(", ") + "\n";
        } else {
            text.innerText = "You do not have enough gold to buy a new weapon.\n";
        }
    } else {
        text.innerText = "You already have the strongest weapon.\n"
        button2.innerText = "Sell weapon for 15 gold.\n"
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1 ) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.pop();
        text.innerText = "You sold a " + currentWeapon + ".\n";
        text.innerText += "In your inventory you have: " + inventory.join(", ") + "\n";

    } else {
        text.innerText = "You cannot sell your only weapon.\n"
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightFangedBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}


function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText =monsterHealth; 
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks!\n";
    text.innerText += "You attack it with your " + weapons[currentWeapon].name + "!\n";
    if (isMonsterHit()){
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random()*xp) + 1;
        monsterHealthText.innerText = monsterHealth;
    } else {
        text.innerText += "You Missed.\n"
    }

    if (areYouHit()){
        health -= getMonsterAttackValue(monsters[fighting].level);
        healthText.innerText = health;
    } else {
        text.innerText += monsters[fighting].name + "'s attack missed.\n"
    }
    
    
    if (health <= 0){
        lose();
    }
    else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster() ;
    }

    if (Math.random() <= .05 && inventory.length !== 1) {
        text.innerText += "Your " + inventory.pop() + " breaks!\n";
        currentWeapon--;
    }
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function areYouHit() {
    return Math.random() > .2;
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - Math.floor(Math.random () * xp);
    console.log(hit);
    return hit;
}

function dodge() {
    text.innerText = "You dodged the attack from " + monsters[fighting].name + ".\n";
}

function lose () {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function defeatMonster () {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);

}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;
    goToTownSquare();
}

function easterEgg() {
    update(locations[7]);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11))
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers: \n"
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText+= "You Won 20 Gold!!!\n"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText +="You lose! Lose ten health. lol.";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}

function pickEight () {
    pick(8);
}

function pickTwo () {
    pick(2);
}