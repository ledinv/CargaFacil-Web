// script/includeHeaderFooter.js

document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (selector, file) => {
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        document.querySelector(selector).innerHTML = html;
      });
  };

  loadComponent("header", "componentes/header.html");
  loadComponent("footer", "componentes/footer.html");
});
