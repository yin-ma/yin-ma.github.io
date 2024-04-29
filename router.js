const routes = {
  "404": "/src/404.html",
  "/": "/src/home.html",
  "/index": "/src/home.html",
  "/index.html": "/src/home.html",
  "/home": "/src/home.html",
  "/about": "/src/about.html",
  "/codesamples": "/src/codeSample.html"
};

const route = (targetPath) => {
  if (targetPath === window.location.pathname) return;
  window.history.pushState({}, "", targetPath);
  handleLocation();
};


const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes["404"];

  const html = await fetch(route).then((data) => data.text());

  // load css first
  let routePart = route.split("/");
  routePart[routePart.length-1] = routePart[routePart.length-1].slice(0, -4) + "css";
  let exist = false;
  for (let l of document.head.querySelectorAll("link")) {
    if (l.getAttribute("href") === routePart.join("/")) {
      exist = true;
      break;
    }
  }

  if (!exist) {
    let link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = routePart.join("/");
    document.head.appendChild(link);
  }
  
  // and load the html
  document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();