const routes = {
  404: "/src/404.html",
  "/": "/src/home.html",
  "/about": "/src/about.html",
  "/codesamples": "/src/codeSample.html"
};

const route = (event) => {
  console.log("redirecting...")
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];

  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
