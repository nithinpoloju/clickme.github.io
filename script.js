// Score variables
let score = 0;
const scoreDisplay = document.getElementById('score');
const maxScore = 45;

// Get all buttons (tabs) and avatar
const tabs = document.querySelectorAll('.tab');
const avatar = document.getElementById('avatar-container');

// Store positions for elements
let tabPositions = [];
let avatarPosition = randomPosition(); // Set initial position for avatar

// Randomize initial position of element within the screen bounds
function randomPosition() {
  return {
    x: Math.random() * (window.innerWidth - 50), // Smaller margin for harder gameplay
    y: Math.random() * (window.innerHeight - 50),
  };
}

// Set initial random positions of tabs and avatar
tabs.forEach((tab, index) => {
  tabPositions[index] = randomPosition();
});

function initializePositions() {
  tabs.forEach((tab, index) => {
    tabPositions[index] = randomPosition();
    tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
  });

  avatar.style.transform = `translate(${avatarPosition.x}px, ${avatarPosition.y}px)`;
}

initializePositions();

// Function to move tabs and avatar continuously
function moveElements() {
  const minDistance = 120; // Larger minimum distance for harder gameplay
  const moveSpeed = 0.4; // Increased speed for faster movement
  const boundaryPadding = 5;

  tabs.forEach((tab, index) => {
    let moveX = tabPositions[index].x;
    let moveY = tabPositions[index].y;

    tabs.forEach((otherTab, otherIndex) => {
      if (otherIndex !== index) {
        const dx = tabPositions[index].x - tabPositions[otherIndex].x;
        const dy = tabPositions[index].y - tabPositions[otherIndex].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          moveX += (minDistance - distance) * (dx / distance);
          moveY += (minDistance - distance) * (dy / distance);
        }
      }
    });

    moveX = Math.min(
      Math.max(moveX, boundaryPadding),
      window.innerWidth - 50 - boundaryPadding
    );
    moveY = Math.min(
      Math.max(moveY, boundaryPadding),
      window.innerHeight - 50 - boundaryPadding
    );

    tabPositions[index].x += (moveX - tabPositions[index].x) * moveSpeed;
    tabPositions[index].y += (moveY - tabPositions[index].y) * moveSpeed;

    tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
  });

  avatarPosition.x = Math.min(
    Math.max(avatarPosition.x + (Math.random() - 0.5) * 3, boundaryPadding),
    window.innerWidth - 50 - boundaryPadding
  );
  avatarPosition.y = Math.min(
    Math.max(avatarPosition.y + (Math.random() - 0.5) * 3, boundaryPadding),
    window.innerHeight - 50 - boundaryPadding
  );
  avatar.style.transform = `translate(${avatarPosition.x}px, ${avatarPosition.y}px)`;

  requestAnimationFrame(moveElements);
}

// Periodic random teleportation for tabs
setInterval(() => {
  tabs.forEach((tab, index) => {
    tabPositions[index] = randomPosition();
    tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
  });
}, 2500); // Teleport every 3 seconds

// Click event on avatar to win the game
avatar.addEventListener('click', () => {
  alert('You clicked the avatar! Final score: ' + score);
  resetGame();
});

// Click event on tabs to gain points
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (score < maxScore) {
      score += parseInt(tab.getAttribute('data-points'));
      if (score > maxScore) score = maxScore;
      scoreDisplay.textContent = score;

      tabPositions[index] = randomPosition();
      tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;

      tab.classList.add('clicked');
      setTimeout(() => tab.classList.remove('clicked'), 200);
    }

    if (score === maxScore) {
      setTimeout(() => {
        alert('You reached the maximum score! Final score: ' + score);
        resetGame();
      }, 500);
    }
  });
});

// Reset the game
function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  initializePositions();
  moveElements();
}

// Start movement
moveElements();

// Repel effect
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  tabs.forEach((tab, index) => {
    const tabX = tabPositions[index].x;
    const tabY = tabPositions[index].y;

    const distX = mouseX - tabX;
    const distY = mouseY - tabY;

    if (Math.abs(distX) < 150 && Math.abs(distY) < 150) {
      tabPositions[index].x -= distX * 0.2;
      tabPositions[index].y -= distY * 0.2;

      tabPositions[index].x = Math.min(
        Math.max(tabPositions[index].x, boundaryPadding),
        window.innerWidth - 50 - boundaryPadding
      );
      tabPositions[index].y = Math.min(
        Math.max(tabPositions[index].y, boundaryPadding),
        window.innerHeight - 50 - boundaryPadding
      );

      tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
    }
  });
});
