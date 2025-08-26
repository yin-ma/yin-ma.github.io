document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('main-header');
  const footerPlaceholder = document.getElementById('main-footer');

  if (headerPlaceholder) {
    fetch('/src/header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;

        let currentPage = window.location.pathname;
        if (currentPage.endsWith('/') || currentPage.endsWith('/index.html')) {
          currentPage = '/index.html';
        }

        const links = headerPlaceholder.querySelectorAll('nav a');
        links.forEach(link => {
          if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
          }
        });
      });
  }

  if (footerPlaceholder) {
    fetch('/src/footer.html')
      .then(response => response.text())
      .then(data => {
        footerPlaceholder.innerHTML = data;
      });
  }
});