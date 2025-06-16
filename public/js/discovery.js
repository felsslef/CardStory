function toggleOverlay() {
  const overlay = document.getElementById("tagOverlay");
  overlay.classList.toggle("active");
}

function toggleTag(button) {
  button.classList.toggle("selected");

  const tag = button.textContent;
  console.log("Tag clicada:", tag);
}
