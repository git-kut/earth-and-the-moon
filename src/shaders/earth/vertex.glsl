uniform sampler2D uNormalTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Normal Map
    vec3 normalTexture = texture2D(uNormalTexture, uv).rgb;
    float displacement = normalTexture.y * 0.2; // strength
    vec3 newPosition = position + normal * displacement;

    // Position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // Varyings
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}

