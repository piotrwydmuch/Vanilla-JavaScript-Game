let monsterMovementExtremlyFast = document.getElementById('extremelyFastSpeed');
let gameSettings = Array.from(document.getElementsByClassName('game_setting'));
const monsterSpeedSettings = Array.from(document.getElementsByClassName('monsterSpeed'));
let grid_items = Array.from(document.getElementsByClassName("grid_item"));
let playerHPvalue = document.getElementById('health_points_value');
let monsterMovementNormal = document.getElementById('normalSpeed');
let playerMPvalue = document.getElementById('mana_points_value');
const pauseGameBtn = document.getElementById("pause_game_btn");
let monsterMovementFast = document.getElementById('fastSpeed');
let levelProgress = document.getElementById('level_progress');
let sheepInfinity = document.getElementById('sheep_respawn');
let levelCounter = document.getElementById('level_counter');
let goldCounter = document.getElementById("money_counter");
let preyCounter = document.getElementById('prey_counter');
let playerHP = document.getElementById('health_points');
let playerMP = document.getElementById('mana_points');
const rightWallID = [9, 18, 27, 36, 45, 54, 63, 72, 81];
const leftWallID = [1, 10, 19, 28, 37, 46, 55, 64, 73];
let active_field = grid_items[4]; //start position
let currentWeapon = 'None';
let randomSheepAmount = 2;
let monsterSpeed = 1500;
let playerIsLive = true;
let direction;
let random_field;
let pointsCounter;
let coinsAmmout;

const Player = {
    maxHp: 100,
    dmg: 20,
}

const Monster = {
    name: 'Sheep',
    maxHp: 100,
    exp: 20,
    dmg: 10,
    img: './images/sheep.png',
}

const setRandomTrees = (x) => {
    for (let i=1; i <= x; i++) {
        rand_tree = grid_items[Math.floor(Math.random() * grid_items.length)];
        if (!rand_tree.classList.contains("active_field")) { //it can't be start position
            rand_tree.classList.add("tree");
        }
    }
}


// const savePlayerBestLevel = () => {
//     const playerRecord = JSON.parse(localStorage.getItem("BestLevel"));
//     localStorage.setItem("BestLevel", JSON.stringify(levelCounter.innerHTML));
//     if (playerRecord.best_level_counter < levelCounter.innerHTML) {
//         const playerBestLevel = {best_level_counter: levelCounter.innerHTML}
//         localStorage.setItem("BestLevel", JSON.stringify(playerBestLevel));
//     }
// }

// const savePlayerMoneyRecord = () => {
//     const playerRecord = JSON.parse(localStorage.getItem("MoneyRecord"));
//     if (playerRecord.best_money_record < goldCounter.innerHTML) {
//         const playerMoneyRecord = {best_money_record: goldCounter.innerHTML}
//         localStorage.setItem("MoneyRecord", JSON.stringify(playerMoneyRecord));
//     }
// }

// const savePlayerPointsRecord = () => {
//     const playerRecord = JSON.parse(localStorage.getItem("PointsRecord"));
//     if (playerRecord.best_points_record < pointsCounter.innerHTML) {
//         const playerPointsRecord = {best_points_record: pointsCounter.innerHTML}
//         localStorage.setItem("PointsRecord", JSON.stringify(playerPointsRecord));
//     }
// }


const setRandomSheep = (x) => {
    for (let i=1; i <= x; i++) { 
        random_field = grid_items[Math.floor(Math.random() * grid_items.length)];
        if (!random_field.classList.contains("tree") && !random_field.classList.contains("active_field")) { //new field can't bee tree
            random_field.classList.add("point_field");
            random_field.setAttribute("data-health", Monster.maxHp);
            let random_sheep_id = Math.floor(Math.random() * 999);
            random_field.setAttribute("data-id", random_sheep_id);

            let preyAmount = document.getElementsByClassName('point_field').length;
            preyCounter.innerHTML = String(preyAmount);            
        }
    }
}

// Set center field as active (starting game)
(() => {
    active_field.classList.add('active_field');
    active_field.setAttribute("data-direction", "bottom");
    setRandomTrees(10); //NUMBER OF TREES AT START
    setRandomSheep(5); //NUMBER OF MONSTERS AT START
        
})();

const levelProgression = () => {
    levelProgress.value = levelProgress.value + Monster.exp;
    if (levelProgress.value >= levelProgress.max) {
        levelCounter.innerHTML = Number(levelCounter.innerHTML) + 1;
        levelProgress.value = 0;
        //savePlayerBestLevel();
    }
}

//Game Settings (monster generator)
gameSettings.forEach(e => {
    e.addEventListener('change', function() {
        if (sheepInfinity.checked) {
            localStorage.setItem('randomSheepAmount', 3);
        } else {
            localStorage.setItem('randomSheepAmount', 0);
        }

        //local storage settings (bugs, need fix)
        randomSheepAmount = Number(localStorage.getItem('randomSheepAmount'));

        
    })
})

monsterSpeedSettings.map(setting => {
    setting.addEventListener("change", () => {
        if (monsterMovementExtremlyFast.checked) {
            monsterSpeed = 250;
        } else if (monsterMovementFast.checked) {
            monsterSpeed = 700;
        } else if (monsterSpeed.checked) {
            monsterSpeed = 1500;
        }
    })
})

// Points giver (x - points can be scored by targeting or enter active field)
const pointScored = (scoredType) => { 
    if (scoredType.classList.contains('point_field')) {
        scoredType.classList.remove('point_field');
        // If sheep was a target
        if (scoredType.classList.contains('target')) {
            grid_items.forEach(e => e.classList.remove('target'));
        }

        scoredType.classList.add('loot_field');
        dropLoot(scoredType);
        levelProgression();


        pointsCounter = document.getElementById("points_counter");
        pointsCounter.innerHTML = Number(pointsCounter.innerHTML) + 1;
        //savePlayerPointsRecord();
        setRandomSheep(randomSheepAmount); //HOW MANY SHEEPS RESPAWN WHEN U GET POINT
        
        preyCounter.innerHTML = Number(preyCounter.innerHTML) - 1;
        let preyAmount = document.getElementsByClassName('point_field').length;
        preyCounter.innerHTML = String(preyAmount);
    }
}

//Set target (by cursor click)
grid_items.forEach(e => {
    e.addEventListener("click", function() {
        if (!this.classList.contains('target') && this.classList.contains('point_field')) {
            grid_items.forEach(e => e.classList.remove('target'))
            this.classList.add('target');
            //attackTarget();
        }
        else {
            grid_items.forEach(e => e.classList.remove('target'))
        }
        // let target_field = document.getElementsByClassName('target')[0];
        // target_field.classList.remove('target');
        // this.classList.add('target');
        // console.log(target_field);
    });
});


const attackTarget = () => {
    let target = document.getElementsByClassName('target')[0];
    setTimeout(function(){ 
        target.dataset.health = String(Number(target.dataset.health) - 40);
        if (target.dataset.health > 0) {
            attackTarget();
            target.classList.add('spell_field');
            setTimeout(function() {
                target.classList.remove('spell_field');
            }, 200)
        } else if (target.dataset.health < 0) {
            pointScored(target); 
            checkGameIsOver();
        }
    }, 1200);
}

const checkGameIsOver = () => {
    if (!grid_items.find(e => e.classList.contains("point_field"))) {
        setTimeout(function(){ 
            alert(`U won!`, location.reload());
        }, 500);
    }
}

//Player can move
//Set active field function (by arrow key)
document.addEventListener("keydown", function arrowEvent(e) {
    let current_field_id = Number(active_field.id.split('_')[1]);

    if (playerIsLive) {
        if (!e.ctrlKey && e.keyCode === 40) {
            next_id = current_field_id + 9;
            direction = "bottom";
            // block vertical site moving when playing
            // e.preventDefault();
        } else if (!e.ctrlKey && e.keyCode === 37) {
            next_id = current_field_id - 1;
            if (leftWallID.includes(current_field_id)) {
                next_id = current_field_id;
            } else {
                direction = "left";
            }
            // block vertical site moving when playing
            // e.preventDefault();
        } else if (!e.ctrlKey && e.keyCode === 39) {
            next_id = current_field_id + 1;
            if (rightWallID.includes(current_field_id)) {
                next_id = current_field_id;
            } else {
                direction = "right";
            }
            // block vertical site moving when playing
            // e.preventDefault();
        } else if (!e.ctrlKey && e.keyCode === 38) {
            next_id = current_field_id - 9;
            direction = "top";
            // block vertical site moving when playing
            // e.preventDefault();
        } else {
            return;
        }
    }

    //Changing direction when stading next to wall
    //active_field.setAttribute("data-direction", direction);

    let nextField = document.getElementById(`field_${next_id}`);
    //game container
    if (next_id <= grid_items.length 
        && next_id >= 1 
        // && (active_field)
        && !nextField.classList.contains('tree')
        && !nextField.classList.contains('point_field')){
            active_field.classList.remove('active_field');
            active_field.removeAttribute('data-direction');
            nextField.classList.add('active_field');
            nextField.setAttribute("data-direction", direction);
            //nextField.setAttribute("data-direction", direction);
            active_field = document.getElementsByClassName('active_field')[0];
            takeLoot(nextField);
    };
    pointScored(active_field);
    checkGameIsOver();

})


//Player can rotate when standing
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.keyCode == 40) {
      direction = "bottom";
      active_field.setAttribute("data-direction", `${direction}_stand`);      
    }
    else if (event.ctrlKey && event.keyCode == 37) {
        direction = "left";
        active_field.setAttribute("data-direction", `${direction}_stand`);
    }
    else if (event.ctrlKey && event.keyCode == 39) {
        direction = "right";
        active_field.setAttribute("data-direction", `${direction}_stand`);
    }
    else if (event.ctrlKey && event.keyCode == 38) {
        direction = "top";
        active_field.setAttribute("data-direction", `${direction}_stand`);
    } 
  });

//spell (Q) settings
document.addEventListener("keypress", function spellEvent(e) {
    let spell_direction = active_field.dataset.direction;
    let current_field_id = Number(active_field.id.split('_')[1]);
    let spell_field;
    let AOEspellField;
    let nextSpellField;
    let nextAOESpellField;
    if (e.keyCode == 113) { // Q key
        if (spell_direction == "bottom" || spell_direction == "bottom_stand") {
            spell_field = current_field_id + 9;
        } else if (spell_direction == "top" || spell_direction == "top_stand") {
            spell_field = current_field_id - 9;
        } else if (spell_direction == "left" || spell_direction == "left_stand") {
            spell_field = current_field_id - 1;
        } else if (spell_direction == "right" || spell_direction == "right_stand") {
            spell_field = current_field_id + 1;
        }
        nextSpellField = document.getElementById(`field_${spell_field}`);  
            // weapon
        if (currentWeapon == 'None' && playerMP.value >= 2) {
            nextSpellField.setAttribute('data-weapon', 'none');
            playerMP.value = playerMP.value - 2;
            playerMPvalue.innerHTML = playerMP.value;
        } else if (currentWeapon == 'electric_wand_item' && playerMP.value >= 3) {
            nextSpellField.setAttribute('data-weapon', 'electric');
            Player.dmg = "60";
            playerMP.value = playerMP.value - 3;
            playerMPvalue.innerHTML = playerMP.value;
        } else if (currentWeapon == 'fire_wand_item' && playerMP.value >= 4) {
            nextSpellField.setAttribute('data-weapon', 'fire');
            Player.dmg = "40";
            playerMP.value = playerMP.value - 4;
            playerMPvalue.innerHTML = playerMP.value;
        } else {
            return;
        }
        nextSpellField.classList.add('spell_field');
        setTimeout(function() {
            nextSpellField.classList.remove('spell_field');
        }, 200)
        if (nextSpellField.classList.contains('point_field')) {
            nextSpellField.dataset.health = String(Number(nextSpellField.dataset.health) - Player.dmg);
            if (nextSpellField.dataset.health <= 0) {
                pointScored(nextSpellField); //if target have less than 0 hp, points are given
                checkGameIsOver();
            }
        }

    }  else if (e.keyCode == 119) { // W key
        if (spell_direction == "bottom" || spell_direction == "bottom_stand") {
            AOEspellField = [current_field_id + 9, current_field_id + 17, current_field_id + 18, current_field_id + 19];
        } else if (spell_direction == "top" || spell_direction == "top_stand") {
            AOEspellField = [current_field_id - 9, current_field_id - 17, current_field_id - 18, current_field_id - 19];
        } else if (spell_direction == "left" || spell_direction == "left_stand") {
            AOEspellField = [current_field_id - 1, current_field_id - 2, current_field_id - 11, current_field_id + 7];
        } else if (spell_direction == "right" || spell_direction == "right_stand") {
            AOEspellField = [current_field_id + 1, current_field_id + 2, current_field_id + 11, current_field_id - 7];
        }  
        nextAOESpellField = AOEspellField.map(field => {
            let nextSpellField = document.getElementById(`field_${field}`);
            // weapon
            if (currentWeapon == 'None' && playerMP.value >= 6) {
                nextSpellField.setAttribute('data-weapon', 'none');
                playerMP.value = playerMP.value - 1.5;
                playerMPvalue.innerHTML = playerMP.value;
            } else if (currentWeapon == 'electric_wand_item' && playerMP.value >= 8) {
                nextSpellField.setAttribute('data-weapon', 'electric');
                playerMP.value = playerMP.value - 2;
                playerMPvalue.innerHTML = playerMP.value;
                Player.dmg = "60";
            } else if (currentWeapon == 'fire_wand_item' && playerMP.value >= 10) {
                playerMP.value = playerMP.value - 2.5;
                playerMPvalue.innerHTML = playerMP.value;
                nextSpellField.setAttribute('data-weapon', 'fire');
                Player.dmg = "40";
            } else {
                return;
            }
            nextSpellField.classList.add('spell_field');
            setTimeout(function() {
                nextSpellField.classList.remove('spell_field');
            }, 200)
            
            if (nextSpellField.classList.contains('point_field')) {
                nextSpellField.dataset.health = String(Number(nextSpellField.dataset.health) - Player.dmg);
                if (nextSpellField.dataset.health <= 0) {
                    pointScored(nextSpellField); //if target have less than 0 hp, points are given
                    checkGameIsOver();
                }
            }
        })
    } else {
        return;
    }
});

(() => {
    setInterval(() => {
        if (playerMP.value < 100) {
            playerMP.value = playerMP.value + 5;
            playerMPvalue.innerHTML = playerMP.value;
        }
    }, 2000);
    setInterval(() => {
        if (playerHP.value < 100) {
            playerHP.value = playerHP.value + 2;
            playerHPvalue.innerHTML = playerHP.value;
        }
    }, 3000);
})()


//loot is droped when prey dies
const dropLoot = (lootField) => {
    let possibleCoinLoot = [1,2,3,4,5,6,7,8,10];
    let newCoinLoot = possibleCoinLoot[Math.floor(Math.random() * possibleCoinLoot.length)];
    if (lootField.dataset.coins) { //when loot drops on the same field, it will be add
        lootField.dataset.coins = String(Number(lootField.dataset.coins) + Number(newCoinLoot));
        lootField.innerHTML = `${lootField.dataset.coins}`;
    } else {
        lootField.setAttribute('data-coins', newCoinLoot);
        lootField.innerHTML = `${newCoinLoot}`;
    }
}

//collecting money
const takeLoot = (lootField) => {
    if (lootField.classList.contains('loot_field')) {
        coinsAmmout = lootField.dataset.coins;
        goldCounter.innerHTML = Number(goldCounter.innerHTML) + Number(coinsAmmout);
        lootField.classList.remove('loot_field');
        lootField.innerHTML = '';
        //savePlayerMoneyRecord();
    }
}

//Monsters can move
const monstersMoving = () => {
    Array.from(document.getElementsByClassName('point_field')).forEach(e => {    
        let current_field_id = Number(e.id.split('_')[1]);
        let possibleMonsterMoves = [-9,-1,1,9];
        if (rightWallID.includes(current_field_id)) {
            possibleMonsterMoves = [-9,-1,9];
        } else if (leftWallID.includes(current_field_id)) {
            possibleMonsterMoves = [-9,1,9];
        }
        
        let randomMonsterMove = possibleMonsterMoves[Math.floor(Math.random() * possibleMonsterMoves.length)]
        let next_id = current_field_id + randomMonsterMove;
        let nextField = document.getElementById(`field_${next_id}`);
        let currentDataHealth = e.dataset.health;
        let currentDataId = e.dataset.id;
        let monsterDirection;
        if (randomMonsterMove == 9) {
            monsterDirection = "bottom";
        } else if (randomMonsterMove == -1) {
            monsterDirection = "left";
        } else if (randomMonsterMove == 1) {
            monsterDirection = "right";
        } else if (randomMonsterMove == -9) {
            monsterDirection = "top";
        }
        if (next_id <= grid_items.length 
            && next_id >= 1 
            && !nextField.classList.contains('tree')
            && !nextField.classList.contains('point_field')
            && !nextField.classList.contains('active_field')){
                e.classList.remove('point_field');
                if (e.classList.contains('target')) {
                    e.classList.remove('target');
                    nextField.classList.add('target');
                    attackTarget();
                }
                e.removeAttribute('data-id');
                e.removeAttribute('data-health');
                e.removeAttribute('data-direction');
                nextField.classList.add('point_field');
                nextField.setAttribute("data-id", currentDataId);
                nextField.setAttribute("data-health", currentDataHealth);
                nextField.setAttribute("data-direction", monsterDirection);
                //nextField.dataset = currentDataset;
                //nextField.setAttribute("data-direction", direction);
                e = document.getElementsByClassName('point_field')[0];
                monsterAttack(nextField);
            }
        })
        
        setTimeout(function() {
                monstersMoving();
        }, monsterSpeed);
}

const playerGetHit = () => {
    let currentField = active_field;
    currentField.style.filter= "opacity(0.2)";
    setTimeout(() => {
        currentField.style.filter = "none";
    }, 200);
}

const monsterAttack = (currentMonsterPossition) => {
    const curentMonsterField = Number(currentMonsterPossition.dataset.field);
    const currentPlayerField = Number(active_field.dataset.field);
    
    if (curentMonsterField + 9 == currentPlayerField) {
        playerHP.value = playerHP.value - Monster.dmg;
        playerHPvalue.innerHTML = playerHP.value;
        playerGetHit();
    } else if (curentMonsterField - 9 == currentPlayerField) {       
        playerHP.value = playerHP.value - Monster.dmg;
        playerHPvalue.innerHTML = playerHP.value;
        playerGetHit();
    } else if (curentMonsterField + 1 == currentPlayerField) {
        playerHP.value = playerHP.value - Monster.dmg;    
        playerHPvalue.innerHTML = playerHP.value;
        playerGetHit();
    } else if (curentMonsterField - 1 == currentPlayerField) {
        playerHP.value = playerHP.value - Monster.dmg;
        playerHPvalue.innerHTML = playerHP.value;
        playerGetHit();
    }

    if (playerHP.value <= 0) {
        (() => {
            active_field.classList.add('player_is_dead');
            playerIsLive = false;
            setTimeout(function(){ 
                alert('U are dead', location.reload());
            }, 1500);
            playerHP.value = 1;
        })()
    }

}

// Start Monster Moving
(() => {
    monstersMoving()
})();

//Game Shop shop_item_available
let buyItemBtn = Array.from(document.getElementsByClassName('shop_item_button'));
buyItemBtn.forEach(e => {
    e.addEventListener('click', function() {
        let availableGold = Number(money_counter.innerHTML);
        let shopItem = this.parentElement.parentElement;
        let itemPrice = shopItem.dataset.price;
        if (availableGold >= itemPrice) {
            shopItem.classList.remove('shop_item_available');
            goldCounter.innerHTML = String(availableGold - itemPrice);
            currentWeapon = shopItem.id;
        } else {
            alert(`You don't have enough gold :(`)
        }
    })
})

pauseGameBtn.addEventListener("click", () => {
    alert("Game paused. Click ok to resume.")
})











