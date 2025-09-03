import * as THREE from 'three';

let canvas = document.querySelector("#canvas");
let canvasWidth = 600;
let canvasHeight = 480;
let aspectRatio = 600 / 480;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
canvas.appendChild(renderer.domElement);


const uniforms = {
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) }
};


const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    float sdSphere( vec3 p, float s )
    {
      return length(p)-s;
    }

    float scene(vec3 p)
    {
        float d = sdSphere(p, 2.0);
        return d;
    }

    float rayMarch(vec3 ro, vec3 rd)
    {
        float t = 0.0;
        for (int i=0; i<100; i++)
        {
            vec3 p = ro + t*rd;
            float dist = scene(p);
            
            t += dist;
            
            if (dist < 0.01 || t > 100.0) break;
        }
        return t;
    }

    vec3 calcNormal( in vec3 p ) // for function f(p)
    {
        const float eps = 0.0001; // or some other value
        const vec2 h = vec2(eps,0);
        return normalize( vec3(scene(p+h.xyy) - scene(p-h.xyy),
                              scene(p+h.yxy) - scene(p-h.yxy),
                              scene(p+h.yyx) - scene(p-h.yyx) ) );
    }

    void main() {
        vec2 uv = vUv;
        // uv.x *= u_resolution.x / u_resolution.y;
        uv = uv*2.0 - 1.0;

        vec3 col = vec3(0.0);
    
        vec3 ro = vec3(0.0, 0.0, -5.0);
        vec3 rd = normalize(vec3(uv, 1.0));   
        vec3 lightDir = normalize(vec3(5.0, 3.0, -5.0));
        
        float t = rayMarch(ro, rd);
        
        vec3 p = ro + t*rd;
        
        if (t < 100.0)
        {
            vec3 n = calcNormal(p);
            float diff = clamp(dot(lightDir, n), 0.0, 1.0);
            
            col += vec3(0.8)*diff;
            col += vec3(0.1);
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;

// 4. 建立幾何體和 ShaderMaterial
const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 1;

function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}

animate();
