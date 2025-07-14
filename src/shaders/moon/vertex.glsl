varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;

    // Transform normal to world space (correctly)
    mat3 normalMatrixWorld = transpose(inverse(mat3(modelMatrix)));
    vNormal = normalize(normalMatrixWorld * normal);

    // Position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}