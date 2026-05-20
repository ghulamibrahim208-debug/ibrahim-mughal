const uploadWrappers = document.querySelectorAll('.image-uploader');

function loadSavedImages() {
  uploadWrappers.forEach(wrapper => {
    const key = wrapper.dataset.imageKey;
    if (!key) return;
    const saved = localStorage.getItem(`theburgerboard-image-${key}`);
    if (saved) {
      const img = wrapper.querySelector('img.editable-image');
      if (img) img.src = saved;
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

    wrapper.addEventListener('click', () => input.click());
    input.addEventListener('click', event => event.stopPropagation());
    input.addEventListener('change', handleInputChange);
  });
}

function init() {
  loadSavedImages();
  bindImageUploaders();
}

init();
