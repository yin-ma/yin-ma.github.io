let root = document.querySelector(":root");
let title = document.querySelector(".hero");

title.addEventListener("mousemove", event => {
  let w = title.getBoundingClientRect().width;
  let h = title.getBoundingClientRect().height;

  let pointX = event.clientX - w / 2;
  let pointY = event.clientY - h / 2;


  let ang = (Math.atan2(pointY, pointX)) / Math.PI * 180 + 90;
  ang = ang < 0 ? ang+360 : ang;

  root.style.setProperty("--bgdeg", `${ang.toFixed(2)}deg`);

})


document.addEventListener('DOMContentLoaded', () => {
  const viewWorkBtn = document.getElementById('view-work-btn');
  const projectsSection = document.getElementById('projects');

  if (viewWorkBtn && projectsSection) {
    viewWorkBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});