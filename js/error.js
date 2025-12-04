window.addEventListener("DOMContentLoaded", () => {
  const goHome = document.getElementById("goHomeBtn");
  const goSpaces = document.getElementById("goSpacesBtn");

  if (goHome) {
    goHome.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (goSpaces) {
    goSpaces.addEventListener("click", () => {
      window.location.href = "my-spaces.html";
    });
  }
});
