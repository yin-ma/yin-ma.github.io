const routes = {
  "404": { html:"/src/404.html" },
  "/": { html:"/src/home.html", css:"/src/home.css", js:"/src/home.js" },
  "/index": { html:"/src/home.html", css:"/src/home.css", js:"/src/home.js" },
  "/index.html": { html:"/src/home.html", css:"/src/home.css", js:"/src/home.js" },
  "/home": { html:"/src/home.html", css:"/src/home.css" },
  "/about": { html:"/src/about.html", css:"/src/about.css" },
  "/codesamples": { html:"/src/codeSample.html", css:"/src/codeSample.css" },
};


const route = (targetPath, scroll = false) => {
  if (targetPath === window.location.pathname) return;
  window.history.pushState({}, "", targetPath);
  handleLocation();
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
};


const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path].html || routes["404"].html;
  const mainPage = document.getElementById("main-page");
  
  
  // load the html
  await fetch(route).then((data) => data.text()).then((text) => {
    mainPage.innerHTML = text;

    if (routes[path].loaded) return;
    
    // load css 
    if (routes[path].css) {
      let link = document.createElement('link');
      link.rel = "stylesheet";
      link.type = 'text/css';
      link.href = routes[path].css;
      document.head.appendChild(link);
    }
    
    // load js
    if (routes[path].js) {
      let script = document.createElement('script');
      script.src = routes[path].js;
      document.head.appendChild(script);
    }
    routes[path].loaded = true;
  });
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();