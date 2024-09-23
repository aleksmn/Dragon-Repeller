const button1 = document.getElementById('button-1');
const button2 = document.getElementById('button-2');
const button3 = document.getElementById('button-3');

const text = document.getElementById('text');

// Исправить и добавить Text
const xpText = document.getElementById('xp');
const healthText = document.getElementById('health');
const goldText = document.getElementById('gold');

const monsterStats = document.getElementById('monster-stats');
console.log(monsterStats);
const monsterName = document.getElementById('monster-name');
const monsterHealthText = document.getElementById('monster-health');

const image = document.getElementById('image');

let health = 100;
let maxHealth = 300;
let gold = 50;
let xp = 0;


// показывает, с каким монстром идет драка
let fighting;
let monsterHealth;

const weapons = [
    { name: "stick", power: 5 },
    { name: "dagger", power: 30 },
    { name: "claw hammer", power: 50 },
    { name: "sword", power: 100 }
];

const locations = [
    {
        name: "town square",
        buttonText: ["Go to store", "Go to cave", "Fight Dragon"],
        buttonFunctions: [goStore, goCave, fightDragon],
        text: "You are in the town square.",
        img: "town-square.webp"
    },
    {
        name: "store",
        buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        buttonFunctions: [buyHealth, buyWeapon, goToTownSquare],
        text: "You enter the store.",
        img: "store.jpg"
    },
    {
        name: "cave",
        buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"],
        buttonFunctions: [fightSlime, fightFangedBeast, goToTownSquare],
        text: "You enter the cave. You see some monsters.",
        img: "cave.avif"
    },
    {
        name: "fight",
        buttonText: ["Attack", "Dodge", "Run"],
        buttonFunctions: [attack, dodge, goToTownSquare],
        text: "You are fighting a monster."
    },
    {
        name: "killMonster",
        buttonText: ["Go to town square", "Go to town square", "Go to town square"],
        buttonFunctions: [goToTownSquare, goToTownSquare, goToTownSquare],
        text: "You have defeated the monster, you gained some gold and experience.",
        img: "wictory.jpg"
    },
    {
        name: "gameOver",
        buttonText: ["Restart", "Restart", "Restart"],
        buttonFunctions: [restart, restart, restart],
        text: "You died. Game Over. Click restart to replay.",
        img: "game-over.jpg"
    },
    {
        name: "win",
        buttonText: ["Restart", "Restart", "Restart"],
        buttonFunctions: [restart, restart, restart],
        text: "You have defeated the dragon. You completed the game. Thanks for playing.",
        img: "win.jpg"
    }
];

const monsters = [
    { name: "slime", level: 2, health: 15, img: "monster-slime.webp" },
    { name: "fanged beast", level: 8, health: 60, img: "fanged-beast.jpg" },
    { name: "dragon", level: 20, health: 300, img: "dragon.jpg" }
];

let currentWeaponIndex = 0;

let inventory = ["stick"];

let weaponName = weapons[currentWeaponIndex].name;

function update(location) {
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];
    button3.innerText = location.buttonText[2];
    button1.onclick = location.buttonFunctions[0];
    button2.onclick = location.buttonFunctions[1];
    button3.onclick = location.buttonFunctions[2];
    text.textContent = location.text;
    monsterStats.style.display = "none";
    image.style.backgroundImage = `url(images/${location.img})`;
}

function goStore() {
    update(locations[1]);
}

function goToTownSquare() {
    update(locations[0]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        if (health >= maxHealth) {
            health = maxHealth;
            text.textContent = "You are at full health.";
        }
        else {
            health = health + 10;
            gold = gold - 10;
        }
        healthText.textContent = health;
        goldText.textContent = gold;
    }

    else {
        text.textContent = "You don't have enough gold to buy more health.";
    }
}

function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if (gold >= 30) {
            gold = gold - 30;
            goldText.textContent = gold;
            currentWeaponIndex++;
            text.textContent = `You have bought a new weapon: ${weapons[currentWeaponIndex].name}. `;
            inventory.push(weapons[currentWeaponIndex].name);
            text.textContent += "In your inventory you have: " + inventory;
        }

        else {
            text.textContent = "You don't have enough gold to buy new weapon.";
        }
    }

    else {
        text.textContent = "You already have the best weapon.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        text.textContent = `You sold a ${inventory[0]}. `;
        inventory.shift();
        gold = gold + 15;
        goldText.textContent = gold;
        text.textContent += "In your inventory you have: " + inventory;
    }

    else {
        text.textContent = "You can't sell your only weapon.";
    }
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.textContent = monsters[fighting].name;
    monsterHealthText.textContent = monsters[fighting].health;
    console.log(`../images/${monsters[fighting].img}`)
    console.log(monsters[fighting].img)
    image.style.backgroundImage = `url(images/${monsters[fighting].img})`;

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

function attack() {
    text.textContent = `The ${monsters[fighting].name} attacks. You are attacked with ${weapons[currentWeaponIndex].name}.`;
    health -= getMonsterAttackValue(monsters[fighting].level);
    console.log(health);
    healthText.textContent = health;
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1
    monsterHealthText.textContent = monsterHealth;
    if (monsterHealth <= 0) {
        defeatTheMonster();
    }
    if (health <= 0) {
        update(locations[5]);
    }
    if (monsters[fighting].name == "dragon" && monsterHealth <= 0) {
        text.textContent = "You have defeated the dragon. You completed the game. Thanks for playing."
        update(locations[6]);
    }
    if (Math.random() > 0.9 && currentWeaponIndex > 0) {
        text.textContent = `Your ${weapons[currentWeaponIndex].name} is broken.`
        inventory.pop();
        currentWeaponIndex--;
        if (inventory.length == 0) {
            inventory = ["stick"];
            currentWeaponIndex = 0;
        }
    }
}

function defeatTheMonster() {
        text.textContent = `You have defeated the ${monsters[fighting].name}! You have gained ${monsters[fighting].level * 6} gold and ${monsters[fighting].level} xp.`;
        gold += monsters[fighting].level * 6;
        goldText.textContent = gold;
        xp += monsters[fighting].level;
        xpText.textContent = xp;
        update(locations[4]);
}

function restart() {
    update(locations[0]);
    health = 100;
    xp = 0;
    gold = 50;
    currentWeaponIndex = 0;
    inventory = ["stick"];
    healthText.textContent = health;
    xpText.textContent = xp;
    goldText.textContent = gold;
}

function getMonsterAttackValue(level) {
    const hit = level * 5 - (Math.floor(Math.random() * xp) + 1);
    return hit > 0 ? hit : 0
}
function dodge() { 
    text.textContent = `You dodge the attack from the ${monsters[fighting].name}.`;
}


button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;