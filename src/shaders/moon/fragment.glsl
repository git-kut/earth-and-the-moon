uniform sampler2D uMoonTexture;
uniform vec3 uSunDirection;
uniform vec3 uMoonToEarth;

varying vec2 vUv;
varying vec3 vNormal;

void main() {

    // Normalize
    vec3 normal = normalize(vNormal);
    vec3 sunDirection = normalize(uSunDirection);
    vec3 earthDirection = normalize(uMoonToEarth);


    // Dot Product
    float lighting = dot(normal, sunDirection);
    float earthFacing = dot(normal, earthDirection);

    // Smooth
    float darkMix = smoothstep(-0.15, 0.5, lighting);
    float earthMix = smoothstep(-0.15, 0.5, earthFacing);

    // Coloring
    vec3 moonColor = texture(uMoonTexture, vUv).rgb;
    vec3 litColor = moonColor * darkMix;
    vec3 earthshineColor = moonColor * 0.1 * earthMix;
    vec3 color = litColor + earthshineColor;
    
    
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>  
}