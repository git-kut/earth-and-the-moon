uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    float sunOrientation = dot(uSunDirection, normal);

    float dayMix = smoothstep(-0.15, 0.5, sunOrientation);

    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nigthColor = texture(uNightTexture, vUv).rgb;

    color = mix(nigthColor, dayColor, dayMix);

    // Clouds
    vec2 specularCloudColor = texture(uSpecularCloudsTexture, vUv).rg;
    float cloudMix = smoothstep(0.2, 1.0, specularCloudColor.g);
    color = mix(color, vec3(1.0 * dayMix), cloudMix);
    
    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Atmosphere
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereMix);

    // Specular
    vec3 reflection = reflect(- uSunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 30.0);
    specular *= specularCloudColor.r;
    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color += specular * specularColor;
    
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}