const canvas = document.getElementById('canvas');
const sounds = document.querySelectorAll('.sound');
const stopButton = document.getElementById('stop');

// Sound Map
const soundMap = {
  rain: 'rain.mp3',
  wind: 'wind.mp3',
  birdsong: 'birdsong.mp3',
  city: 'city.mp3',
  ocean: 'ocean.mp3',
  forest: 'forest.mp3',
  thunder: 'thunder.mp3',
  street: 'street.mp3',
  fire: 'fire.mp3',
};

// Active Sounds
const activeSounds = {};

// Grid Size and Item Size
const gridSize = 100; // Size of each grid cell
const itemSize = 80;  // Fixed size of dropped items

// Drag-and-Drop Handlers
function dragOverHandler(event) {
  event.preventDefault();
}

function dropHandler(event) {
  event.preventDefault();
  const soundType = event.dataTransfer.getData('sound');

  // Get canvas bounding box to calculate relative positions
  const canvasRect = canvas.getBoundingClientRect();
  let offsetX = event.clientX - canvasRect.left;
  let offsetY = event.clientY - canvasRect.top;

  // Ensure position snaps to grid
  let gridX = Math.floor(offsetX / gridSize) * gridSize;
  let gridY = Math.floor(offsetY / gridSize) * gridSize;

  // Clamp the position to keep it within the canvas
  const maxX = canvas.offsetWidth - gridSize;
  const maxY = canvas.offsetHeight - gridSize;

  gridX = Math.min(Math.max(gridX, 0), maxX);
  gridY = Math.min(Math.max(gridY, 0), maxY);

  createSoundControl(soundType, gridX, gridY);
}

function createSoundControl(soundType, x, y) {
  if (activeSounds[soundType]) return; // Prevent duplicate sound types

  const audio = new Audio(soundMap[soundType]);
  audio.loop = true;

  // Play audio on user interaction for mobile compatibility
  audio.play().catch(() => {
    console.log('Autoplay prevented, sound will play after user interaction.');
  });

  activeSounds[soundType] = audio;

  const controlCard = document.createElement('div');
  controlCard.className = 'control-card';
  controlCard.style.left = `${x}px`;
  controlCard.style.top = `${y}px`;
  controlCard.style.width = `${itemSize}px`;
  controlCard.style.height = `${itemSize}px`;

  // Display the sound name in the card
  const soundName = document.createElement('div');
  soundName.className = 'sound-name';
  soundName.textContent = soundType.charAt(0).toUpperCase() + soundType.slice(1); // Capitalize the first letter of the sound name
  controlCard.appendChild(soundName);

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.value = 1;
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });

  // Remove Button with Font Awesome icon
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Trash icon for remove
  removeButton.addEventListener('click', () => {
    audio.pause();
    controlCard.remove();
    delete activeSounds[soundType];
  });

  controlCard.appendChild(volumeSlider);
  controlCard.appendChild(removeButton);
  canvas.appendChild(controlCard);
}

// Attach dragstart event to each sound element
sounds.forEach(sound => {
  sound.setAttribute('draggable', 'true');  // Make each sound element draggable
  sound.addEventListener('dragstart', event => {
    event.dataTransfer.setData('sound', sound.dataset.sound);
  });

  // Mobile touch handling for drag and drop
  sound.addEventListener('touchstart', event => {
    event.preventDefault();
    event.dataTransfer.setData('sound', sound.dataset.sound);
  });
});

// Canvas event listeners
canvas.addEventListener('dragover', dragOverHandler);
canvas.addEventListener('drop', dropHandler);

// Stop Button to clear all sounds
stopButton.addEventListener('click', () => {
  Object.values(activeSounds).forEach(audio => audio.pause());
  Object.keys(activeSounds).forEach(key => delete activeSounds[key]);
  document.querySelectorAll('.control-card').forEach(card => card.remove());
});
