let worldSelectList = document.querySelector("div.world > select.world");
let objectSelectList = document.querySelector("div.objects > select.objects");
let cameraOption = document.querySelector(".camera-option");

let settings = document.querySelectorAll(".setting");
let cameraSetting = document.querySelector(".camera-setting");
let quadSetting = document.querySelector(".quad-setting");
let sphereSetting = document.querySelector(".sphere-setting");
let triangleSetting = document.querySelector(".triangle-setting");
let boxSetting = document.querySelector(".box-setting");
let matSetting = document.querySelectorAll(".mat-detail");
let matSelect = document.querySelectorAll(".material-select");

let addObjectBtn = document.querySelector(".add-object-btn");
let removeObjectBtn = document.querySelector(".remove-object-btn");
let commitChangeBtn = document.querySelector(".commit-change-btn");

let object_prev_option;
let world_prev_option;
let world_is_focus = false;
let objects = [];
addForm(getForm(worldSelectList.value)); // add camera

commitChangeBtn.addEventListener("click", event => {
  if (world_is_focus) {
    objects[worldSelectList.selectedIndex] = getForm(objects[worldSelectList.selectedIndex]["type"]);

    if (worldSelectList.selectedIndex !== 0) {
      worldSelectList.options[worldSelectList.selectedIndex].text = objects[worldSelectList.selectedIndex]["name"];
    }
  }
})


matSelect.forEach((matSel, idx) => {
  matSel.addEventListener("click", event => {
    matSetting.forEach(m => {
      if (m.classList.contains(matSel.value)) {
        m.style.display = "block";
      } else {
        m.style.display = "none";
      }
    })
  })
})
// matSelect.forEach(matsel => matsel.addEventListener("click", event => {
//   matSetting.forEach(m => {
//     if (m.classList.contains(matSelect.value)) {
//       m.style.display = "block";
//     } else {
//       m.style.display = "none";
//     }
//   })
//   })
// )

addObjectBtn.addEventListener("click", () => {
  let data = getFormData(objectSelectList.value);

  let opt = document.createElement("option");
  opt.text = data.get("name");
  worldSelectList.add(opt);

  addForm(getForm(objectSelectList.value));
})

removeObjectBtn.addEventListener("click", () => {
  let idx = worldSelectList.selectedIndex;
  if (idx === 0) return; // camera cannot be removed
  worldSelectList.remove(idx);
  objects.splice(idx, 1);

  if (idx === worldSelectList.length) {
    idx -= 1;
  }
  worldSelectList.options[idx].selected = true;
  showOption(worldSelectList.value);

})

function resetForm(opt) {
  let layout;
  let form = formHtmlElement(opt);
  switch (opt) {
    case "quad":
      layout = getQuadLayout();
      break;
    case "sphere":
      layout = getSphereLayout();
      break;
    case "triangle":
      layout = getTriangleLayout();
      break;
    case "box":
      layout = getBoxLayout();
      break; 
    default:
      break;
  }

  Object.entries(layout).forEach(l => {
    let [key, value] = l;
    form.elements[key].value = value;
  })
}

function setForm(data) {
  let form = formHtmlElement(data["type"]);

  Object.entries(data).forEach(d => {
    let [key, value] = d;
    form.elements[key].value = value;
  })
}

function formHtmlElement(opt) {
  let setting;
  switch (opt) {
    case "camera":
      setting = cameraSetting;
      break;
    case "quad":
      setting = quadSetting;
      break;
    case "sphere":
      setting = sphereSetting;
      break;
    case "box":
      setting = boxSetting;
      break;
    case "triangle":
      setting = triangleSetting;
      break;
    default:
      break;
  }
  return setting;
}

function getForm(value) {
  let data = getFormData(value);
  let temp = {};
  data.entries().forEach(d => {
    let [key, value] = d;
    temp[key] = value;
  })
  return temp;
}

function addForm(data) {
  objects.push(data);
}

function showOption(opt) {
  settings.forEach(setting => {
    setting.style.display = "none";
  })

  switch (opt) {
    case "camera":
      cameraSetting.style.display = "flex";
      break;
    case "quad":
      quadSetting.style.display = "flex";
      break;
    case "sphere":
      sphereSetting.style.display = "flex";
      break;
    case "box":
      boxSetting.style.display = "flex";
      break;
    case "triangle":
      triangleSetting.style.display = "flex";
      break;
    default:
      break;
  }
}

function getFormData(opt) {
  return new FormData(formHtmlElement(opt));
}

objectSelectList.addEventListener("click", event => {
  if (event.target.tagName === "OPTION") {
    world_is_focus = false;
    world_prev_option = null;
    if (object_prev_option === objectSelectList.value) return;

    object_prev_option = objectSelectList.value;
    showOption(objectSelectList.value);
    resetForm(objectSelectList.value);
  }
})

worldSelectList.addEventListener("click", event => {
  if (event.target.tagName === "OPTION") {
    world_is_focus = true;
    object_prev_option = null;
    if (world_prev_option === worldSelectList.selectedIndex) return;

    world_prev_option = worldSelectList.selectedIndex;
    showOption(objects[world_prev_option].type);
    setForm(objects[world_prev_option]);
  }
})







let progressBar = document.querySelector(".progress-bar");
let renderBtn = document.querySelector(".render-btn");

let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = 100;
canvas.height = 50;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 100, 50);

let worker = new Worker("script.js");

renderBtn.addEventListener("click", event => {
  let canvasWidth = parseInt(objects[0]["width"]);
  let canvasHeight = parseInt(objects[0]["height"]);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  worker.postMessage(objects);
})

worker.onmessage = (msg) => {
  let {progress, i, j, pixel_color, sample} = msg.data;

  setPixelColor(i, j, pixel_color, sample);
  progressBar.innerHTML = `${progress.toFixed(2)}%`;
}

function setPixelColor(x, y, color, sample) {
  const imgData = ctx.getImageData(x, y, x+1, y+1);
  const data = imgData.data;

  color = Vec3.clamp(color, 0.0, 1.0);

  if (sample === 0) {
    data[0] = linear_to_gamma(color.x) * 255;
    data[1] = linear_to_gamma(color.y) * 255;
    data[2] = linear_to_gamma(color.z) * 255;
    data[3] = 255;
  } else {
    data[0] = linear_to_gamma((sample * Math.pow((data[0] / 255), 2) + color.x) / (sample+1)) * 255;
    data[1] = linear_to_gamma((sample * Math.pow((data[1] / 255), 2) + color.y) / (sample+1)) * 255;
    data[2] = linear_to_gamma((sample * Math.pow((data[2] / 255), 2) + color.z) / (sample+1)) * 255;
    data[3] = 255;
  }
  ctx.putImageData(imgData, x, y);
}
