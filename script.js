let grid_items = Array.from(document.getElementsByClassName("grid_item"));
let active_field = grid_items[4]; //start position
let random_field;
let pointsCounter;
let preyCounter = document.getElementById('prey_counter');
let levelProgress = document.getElementById('level_progress');
let direction;
const rightWallID = [9, 18, 27, 36, 45, 54, 63, 72, 81];
const leftWallID = [1, 10, 19, 28, 37, 46, 55, 64, 73];

// Set random trees
function randomTrees(x) {
    for (let i=1; i <= x; i++) {
        rand_tree = grid_items[Math.floor(Math.random() * grid_items.length)];
        if (!rand_tree.classList.contains("active_field")) { //it can't be start position
            rand_tree.classList.add("tree");
        }
    }
}

// Set random sheeps
function randomSheep(x) {
    for (let i=1; i <= x; i++) { 
        random_field = grid_items[Math.floor(Math.random() * grid_items.length)];
        if (!random_field.classList.contains("tree") && !random_field.classList.contains("active_field")) { //new field can't bee tree
            random_field.classList.add("point_field");
            random_field.setAttribute("data-health", "100");

            let preyAmount = document.getElementsByClassName('point_field').length;
            preyCounter.innerHTML = String(preyAmount);
            
        }
    }
}

// Set center field as active (starting game)
(function setActiveField() {
    active_field.classList.add('active_field');
    active_field.setAttribute("data-direction", "bottom");
    randomTrees(10); //NUMBER OF TREES AT START
    randomSheep(5); //NUMBER OF SHEEPS AT START
        
})();


// Level progression
function levelProgression() {
    
    let levelCounter = document.getElementById('level_counter');

    levelProgress.value = levelProgress.value + 20;
    if (levelProgress.value >= levelProgress.max) {
        levelCounter.innerHTML = Number(levelCounter.innerHTML) + 1;
        levelProgress.value = 0;
    }
}

// Points giver (x - points can be scored by targeting or enter active field)
function pointScored(x) { 
    if (x.classList.contains('point_field')) {
        x.classList.remove('point_field');
        // If sheep was a target
        if (x.classList.contains('target')) {
            grid_items.forEach(e => e.classList.remove('target'));
        }

        x.classList.add('loot_field');
        dropLoot(x);
        levelProgression();


        pointsCounter = document.getElementById("points_counter");
        pointsCounter.innerHTML = Number(pointsCounter.innerHTML) + 1;
        randomSheep(2); //HOW MANY SHEEPS RESPAWN WHEN U GET POINT
        
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

//Checking game is over
function gameIsOver() {
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
    gameIsOver();

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

//auto attact targets
function attackTarget() {
    let target = document.getElementsByClassName('target')[0];
    setTimeout(function(){ 
        target.dataset.health = String(Number(target.dataset.health) - 40);
        if (target.dataset.health > 0) {
            attackTarget(); //recursion method
        } else if (target.dataset.health < 0) {
            pointScored(target); //if target have less than 0 hp, points are given
            gameIsOver();
        }
        target.classList.add('spell_field');
        setTimeout(function() {
            target.classList.remove('spell_field');
        }, 200)
    }, 1200);
}

//spell (Q) settings
document.addEventListener("keypress", function spellEvent(e) {
    let spell_direction = active_field.dataset.direction;
    let current_field_id = Number(active_field.id.split('_')[1]);
    let spell_field;
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
    } else if (e.keyCode == 119) { // W key
    }
    let nextSpellField = document.getElementById(`field_${spell_field}`);
    nextSpellField.classList.add('spell_field');
    setTimeout(function() {
        nextSpellField.classList.remove('spell_field');
    }, 200)
    
    if (nextSpellField.classList.contains('point_field')) {
        nextSpellField.dataset.health = String(Number(nextSpellField.dataset.health) - 80);
        if (nextSpellField.dataset.health < 0) {
            pointScored(nextSpellField); //if target have less than 0 hp, points are given
            gameIsOver();
        }
    }
});

//loot is droped when prey dies
function dropLoot(x) {
    let possibleCoinLoot = [1,2,3,4,5,6,7,8,10];
    let newCoinLoot = possibleCoinLoot[Math.floor(Math.random() * possibleCoinLoot.length)];
    x.setAttribute('data-coins', newCoinLoot);
    x.innerHTML = `${newCoinLoot}`;
}

//collecting money
function takeLoot(x) {
    if (x.classList.contains('loot_field')) {
        let coinsAmmout = x.dataset.coins;
        let goldCounter = document.getElementById("money_counter");
        goldCounter.innerHTML = Number(goldCounter.innerHTML) + Number(coinsAmmout);
        x.classList.remove('loot_field');
        x.innerHTML = '';
    }
}

//Monsters can move
function monstersMoving() {
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
                e.removeAttribute('data-health');
                e.removeAttribute('data-direction');
                nextField.classList.add('point_field');
                nextField.setAttribute("data-health", currentDataHealth);
                nextField.setAttribute("data-direction", monsterDirection);
                //nextField.dataset = currentDataset;
                //nextField.setAttribute("data-direction", direction);
                e = document.getElementsByClassName('point_field')[0];
            };
        })
        
        setTimeout(function() {
                monstersMoving();
        }, 1500);
}

(function runMonster() {
    monstersMoving()
})();




