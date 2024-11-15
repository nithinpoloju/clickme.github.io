// Score variables
let score = 0;
const scoreDisplay = document.getElementById('score');

// Get all buttons (tabs) and avatar
const tabs = document.querySelectorAll('.tab');
const avatar = document.getElementById('avatar-container');

// Store positions for elements
let tabPositions = [];
let avatarPosition = { x: 0, y: 0 };

// Randomize initial position of element within the screen bounds
function randomPosition() {
  return {
    x: Math.random() * (window.innerWidth - 100),  // Avoid going off-screen
    y: Math.random() * (window.innerHeight - 100)
  };
}

// Store initial random positions of tabs and avatar
tabs.forEach((tab, index) => {
  tabPositions[index] = randomPosition();
});

avatarPosition = randomPosition();

// Function to move tabs away from each other and avoid overlap
function moveElements() {
  const minDistance = 100; // Minimum distance between tabs
  const moveSpeed = 0.2; // Increase the speed of the movement
  const boundaryPadding = 10; // Padding from the edges of the screen

  tabs.forEach((tab, index) => {
    let moveX = tabPositions[index].x;
    let moveY = tabPositions[index].y;

    // Check for overlap and keep tabs away from each other
    tabs.forEach((otherTab, otherIndex) => {
      if (otherIndex !== index) {
        const dx = tabPositions[index].x - tabPositions[otherIndex].x;
        const dy = tabPositions[index].y - tabPositions[otherIndex].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          // Move away if too close
          moveX += (minDistance - distance) * (dx / distance);
          moveY += (minDistance - distance) * (dy / distance);
        }
      }
    });

    // Apply screen boundaries: Make sure elements stay within screen width and height
    if (moveX < boundaryPadding) moveX = boundaryPadding; // Avoid going too far left
    if (moveX > window.innerWidth - 100 - boundaryPadding) moveX = window.innerWidth - 100 - boundaryPadding; // Avoid going too far right
    if (moveY < boundaryPadding) moveY = boundaryPadding; // Avoid going too far top
    if (moveY > window.innerHeight - 100 - boundaryPadding) moveY = window.innerHeight - 100 - boundaryPadding; // Avoid going too far bottom

    tabPositions[index].x += (moveX - tabPositions[index].x) * moveSpeed;
    tabPositions[index].y += (moveY - tabPositions[index].y) * moveSpeed;

    // Apply new positions to each tab
    tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
  });

  // Move the avatar in random direction
  const avatarNewPos = randomPosition();
  avatarPosition.x += (avatarNewPos.x - avatarPosition.x) * 0.05;
  avatarPosition.y += (avatarNewPos.y - avatarPosition.y) * 0.05;
  avatar.style.transform = `translate(${avatarPosition.x}px, ${avatarPosition.y}px)`;

  // Continue moving tabs and avatar
  requestAnimationFrame(moveElements);
}

// Click event on avatar to win the game
avatar.addEventListener('click', () => {
  alert('You won! Final score: ' + score);
  resetGame();
});

// Click event on tabs to gain points
tabs.forEach(tab => {
  tab.addEventListener('click', (event) => {
    // Increase score each time tab is clicked, even on repeated clicks
    score += parseInt(tab.getAttribute('data-points'));
    scoreDisplay.textContent = score;

    // Apply click animation to tab
    tab.classList.add('clicked');

    // Check if player wins
    if (score >= 45) {
      setTimeout(() => {
        alert('You won the game! Final score: ' + score);
        resetGame();
      }, 500);
    }
  });
});

// Function to reset the game
function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  tabs.forEach(tab => tab.classList.remove('clicked'));
  tabPositions = [];
  avatarPosition = { x: 0, y: 0 };

  // Randomize new positions
  tabs.forEach((tab, index) => {
    tabPositions[index] = randomPosition();
  });
  avatarPosition = randomPosition();

  // Start continuous movement again
  moveElements();
}

// Start the continuous floating movement
moveElements();

// Move tabs away from cursor on hover (Repel effect)
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  tabs.forEach((tab, index) => {
    const tabX = tabPositions[index].x;
    const tabY = tabPositions[index].y;

    const distX = mouseX - tabX;
    const distY = mouseY - tabY;

    // If cursor is near the tab, move it away
    if (Math.abs(distX) < 100 && Math.abs(distY) < 100) {
      // Calculate the distance and move the tab away from the cursor
      tabPositions[index].x -= distX * 0.1; // Increase this multiplier to make it move faster
      tabPositions[index].y -= distY * 0.1; // Increase this multiplier to make it move faster
      tab.style.transform = `translate(${tabPositions[index].x}px, ${tabPositions[index].y}px)`;
    }
  });
});
