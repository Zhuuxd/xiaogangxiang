// 页面切换逻辑
const startPage = document.getElementById('start-page');
const mixPage = document.getElementById('mix-page');
const rollPage = document.getElementById('roll-page');
const dryPage = document.getElementById('dry-page');
const endPage = document.getElementById('end-page');

document.getElementById('start-button').addEventListener('click', () => {
    startPage.classList.add('hidden');
    mixPage.classList.remove('hidden');
    backgroundMusic.play();
});

// 混合香料逻辑
const mixArea = document.getElementById('mix-area');
const mixCompleteButton = document.getElementById('mix-complete-button');
const ingredients = document.querySelectorAll('.ingredient');
const mixedHerbs = new Set();
const mixSound = document.getElementById('mix-sound');

ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    });
});

mixArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

mixArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const herb = e.dataTransfer.getData('text/plain');
    if (mixedHerbs.has(herb)) {
        alert('不能重复添加！');
    } else {
        mixedHerbs.add(herb);
        mixArea.textContent = '混合香：' + Array.from(mixedHerbs).join(' + ');
        if (mixedHerbs.size >= 2) {
            mixCompleteButton.disabled = false;
        }
        mixSound.play();
    }
});

mixCompleteButton.addEventListener('click', () => {
    mixPage.classList.add('hidden');
    rollPage.classList.remove('hidden');
    const herbs = Array.from(mixedHerbs);
    if (herbs.includes('沉香') && herbs.includes('檀香')) {
        result.textContent = '你制作了一款经典的沉香檀香！';
    } else if (herbs.includes('艾草') && herbs.includes('龙脑香')) {
        result.textContent = '你制作了一款清新的艾草龙脑香！';
    } else {
        result.textContent = '你制作了一款独特的香！';
    }
});

// 搓香逻辑
const rollArea = document.getElementById('roll-area');
const mixedHerbsBefore = document.getElementById('mixed-herbs-before');
const mixedHerbsAfter = document.getElementById('mixed-herbs-after');
const rollCompleteButton = document.getElementById('roll-complete-button');
const restartRollButton = document.getElementById('restart-roll-button');
const rollSound = document.getElementById('roll-sound');
const result = document.getElementById('result');
let rollCount = 0;

rollArea.addEventListener('mousemove', () => {
    if (!rollPage.classList.contains('hidden')) {
        rollCount++;
        console.log(`搓制次数: ${rollCount}`); // 调试用，可以删除

        // 当搓制次数在 500 到 2000 之间时，按钮变为可点击状态
        if (rollCount >= 500 && rollCount <= 2000) {
            rollCompleteButton.disabled = false;
            mixedHerbsBefore.style.opacity = '0';
            mixedHerbsAfter.classList.remove('hidden');
            mixedHerbsAfter.style.opacity = '1';
        } 
        // 当搓制次数超过 2000 时，按钮变为不可点击状态，并显示搓制过度的提示
        else if (rollCount > 2000) {
            rollCompleteButton.disabled = true;
            result.textContent = '搓制过度，香已损坏！';
            restartRollButton.classList.remove('hidden'); // 显示重新制作按钮
        }

        // 每 10 次搓制播放一次音效
        if (rollCount % 10 === 0) {
            rollSound.play();
        }
    }
});

// 重新制作逻辑
restartRollButton.addEventListener('click', () => {
    rollCount = 0;
    rollCompleteButton.disabled = true;
    result.textContent = '';
    mixedHerbsBefore.style.opacity = '1';
    mixedHerbsAfter.classList.add('hidden');
    restartRollButton.classList.add('hidden'); // 隐藏重新制作按钮
});

rollCompleteButton.addEventListener('click', () => {
    rollPage.classList.add('hidden');
    dryPage.classList.remove('hidden');
    startDrying();
});

// 晾晒逻辑
const calibrationBar = document.getElementById('calibration-bar');
const pointer = document.getElementById('pointer');
const calibrationPoint = document.getElementById('calibration-point');
const dryCompleteButton = document.getElementById('dry-complete-button');
const finalResult = document.getElementById('final-result');
const finalIncense = document.getElementById('final-incense');

function startDrying() {
    const randomPoint = Math.random() * 80 + 10;
    calibrationPoint.style.left = `${randomPoint}%`;

    dryCompleteButton.addEventListener('click', () => {
        const pointerPos = parseFloat(pointer.style.left);
        const pointPos = parseFloat(calibrationPoint.style.left);
        if (Math.abs(pointerPos - pointPos) < 5) {
            result.textContent = '完美！你的香晾晒得非常均匀。';
        } else if (Math.abs(pointerPos - pointPos) < 10) {
            result.textContent = '优秀！你的香晾晒得不错。';
        } else {
            result.textContent = '晾晒不均匀，香的品质有所下降。';
        }
        finalResult.textContent = result.textContent;
        finalIncense.style.display = 'block';
        setTimeout(() => {
            dryPage.classList.add('hidden');
            endPage.classList.remove('hidden');
        }, 1000);
    });
}

// 重新开始逻辑
const restartButton = document.getElementById('restart-button');
const backgroundMusic = document.getElementById('background-music');

restartButton.addEventListener('click', () => {
    endPage.classList.add('hidden');
    startPage.classList.remove('hidden');
    mixedHerbs.clear();
    rollCount = 0;
    result.textContent = '';
    finalResult.textContent = '';
    finalIncense.style.display = 'none';
    mixedHerbsBefore.style.opacity = '1';
    mixedHerbsAfter.classList.add('hidden');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
});