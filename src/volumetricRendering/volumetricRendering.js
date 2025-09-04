import * as THREE from 'three';

let canvas = document.querySelector("#canvas");
let canvasWidth = 800;
let canvasHeight = 480;
let aspectRatio = canvasWidth / canvasHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
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


    vec3 hash( vec3 p )
    {
        p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                dot(p,vec3(269.5,183.3,246.1)),
                dot(p,vec3(113.5,271.9,124.6)));

        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec3 p )
    {
        vec3 i = floor( p );
        vec3 f = fract( p );
        vec3 u = f*f*(3.0-2.0*f);
        return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ),
                            dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                        mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ),
                            dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                    mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ),
                            dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                        mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ),
                            dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
    }


    // Constants
    const float PI = 3.14159265359;

    const float STEP_SIZE = 0.1;
    const float MAX_DIST = 10.0;
    const float SIGMA_A = 0.15;
    const float SIGMA_S = 0.7;
    const float SIGMA_T = SIGMA_A + SIGMA_S;
    const float G = 0.15;

    const float NUM_STEPS_LIGHT = 10.0;



    float eval_density(vec3 p, mat2 rot)
    {
        p.xz = rot * p.xz;
        float fade = -length(p) + 3.0;
        fade = smoothstep(0.0, 1.0, fade);
        float n = (noise(p)+1.0)*0.5;
        n = smoothstep(0.4, 0.8, n);
        return 2.0*fade*n;
    }

    float phaseHG(vec3 w_in, vec3 w_out, float g)
    {
        float g2 = g * g;
        float cos_theta = dot(w_in, w_out);
        float denom = 1.0 + g2 - 2.0 * g * cos_theta;
        return (1.0 - g2) / (4.0 * PI * denom * sqrt(denom));
    }


    vec3 rayMarch(vec3 ro, vec3 rd)
    {
        // Light properties
        vec3 light_pos = vec3(10.0, 5.0, 1.0);
        vec3 light_dir = normalize(light_pos - vec3(0.0));
        vec3 light_color = vec3(20.0);
        
        vec3 background_color = vec3(0.45, 0.6, 0.85) - (rd.y*0.3);
        float sun = pow(clamp(dot(rd, normalize(light_pos)), 0.0, 1.0), 4096.0);
        background_color += 0.2*light_color*sun;

        // Ray marching variables
        float transparency = 1.0;
        vec3 result_color = vec3(0.0);

        mat2 rot = mat2(cos(u_time), sin(u_time), -sin(u_time), cos(u_time));
        float phase_val = phaseHG(-rd, light_dir, G);
        
        // Main ray-marching loop
        for (int i = 0; i < int(MAX_DIST/STEP_SIZE); ++i) {
            float stride = STEP_SIZE;
            float t = stride * (float(i) + 0.5);
            vec3 p = ro + t * rd;

            float density = eval_density(p, rot);
            if (density <= 0.001) continue;

            // Update transparency based on Beer's Law
            float sample_attenuation = exp(-stride * density * SIGMA_T);
            transparency *= sample_attenuation;

            float tau = 0.0;
            // Ray-march along the light ray to calculate attenuation
            for (int j = 0; j < int(NUM_STEPS_LIGHT); ++j) {
                float stride_light = STEP_SIZE;
                float t_light = stride_light * (float(j) + 0.5);
                vec3 p_light = p + light_dir * t_light;

                if (length(p_light)-3.0 > 0.0 ) break;
                
                float eval_light_density = eval_density(p_light, rot);

                tau += eval_light_density * stride_light;
            }

            float light_ray_att = exp(-tau * SIGMA_T);

            // Add scattered light to the result
            result_color += light_color *
                        light_ray_att *
                        phase_val *
                        SIGMA_S *
                        transparency *
                        stride *
                        density;
                        
            // Early exit if the ray is already opaque
            if (transparency < 0.01) {
                break;
            }
        }
        
        return background_color * transparency + result_color;
    }


    
    void main()
    {
        // Normalized pixel coordinates (from -1 to 1)
        vec2 uv = vUv;
        uv = uv*2.0 - 1.0;

        // Camera setup
        vec3 ro = vec3(0.0, 0.0, -5.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        // Render the volume
        vec3 col = rayMarch(ro, rd);
        col = pow(col, vec3(0.4545)); // Gamma correction

        // Output to screen
        gl_FragColor = vec4(col, 1.0);
    }
`;


const geometry = new THREE.PlaneGeometry(2*aspectRatio, 2);
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
  uniforms.u_time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

animate();
