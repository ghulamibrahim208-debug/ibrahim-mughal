const uploadWrappers = document.querySelectorAll('.image-uploader');
const PASSWORD = '12345678';
const imageDefaults = new Map();

function verifyPassword() {
  const entered = prompt('Enter uploader password (12345678):');
  if (entered === null) return false;
  if (entered === PASSWORD) return true;
  alert('Incorrect password.');
  return false;
}

function loadSavedImages() {
  uploadWrappers.forEach(wrapper => {
    const key = wrapper.dataset.imageKey;
    const img = wrapper.querySelector('img.editable-image');
    if (!key || !img) return;
    imageDefaults.set(key, img.src);
    const saved = localStorage.getItem(`theburgerboard-image-${key}`);
    if (saved) {
      img.src = saved;
    }
  });
}

function handleInputChange(event) {
  const input = event.currentTarget;
  const wrapper = input.closest('.image-uploader');
  if (!wrapper) return;
  const key = wrapper.dataset.imageKey;
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = wrapper.querySelector('img.editable-image');
    if (image) {
      image.src = reader.result;
      localStorage.setItem(`theburgerboard-image-${key}`, reader.result);
    }
  };
  reader.readAsDataURL(file);
}

function bindImageUploaders() {
  uploadWrappers.forEach(wrapper => {
    const input = wrapper.querySelector('.image-input');
    const img = wrapper.querySelector('img.editable-image');
    if (!input || !img) return;

    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'image-reset-button';
    resetButton.textContent = 'Reset';
    wrapper.appendChild(resetButton);

    wrapper.addEventListener('click', () => {
      if (!verifyPassword()) return;
      input.dataset.authorized = 'true';
      input.click();
    });

    input.addEventListener('change', event => {
      if (input.dataset.authorized !== 'true') {
        input.value = '';
        return;
      }
      delete input.dataset.authorized;
      handleInputChange(event);
    });

    resetButton.addEventListener('click', event => {
      event.stopPropagation();
      if (!verifyPassword()) return;
      const key = wrapper.dataset.imageKey;
      const defaultSrc = imageDefaults.get(key) || img.src;
      img.src = defaultSrc;
      localStorage.removeItem(`theburgerboard-image-${key}`);
      input.value = '';
    });
  });
}

function init() {
  loadSavedImages();
  bindImageUploaders();
}

init();
