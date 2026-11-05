uniform float uDelta;
uniform float uAccumulator;
in vec2 vPosition;
out vec2 fragColor;

uniform sampler2D uPositionSampler;
uniform sampler2D uVelocitySampler;

const float field_speed = 0.12;
const float noise_strength = 0.25;
const float progression_rate = 0.25;
const float length_scale = 0.5;
const vec2 field_main_direction = vec2(-1.0, 0.0);
const vec2 sphere_position = vec2(0.5, 0.5);
const float sphere_radius = 0.25;

// The vector field potential has three components, but in 2D only the z-component
// contributes to the curl, so only that component is computed.
float potential(vec2 p) {
    float L;      // Length scale as described by Bridson
    float speed;  // field speed
    float alpha;  // Alpha as described by Bridson
    float beta;   // amount of curl noise compared to the constant field
    float pot;    // Output potential

    L = length_scale;
    speed = field_speed;
    beta = noise_strength;

    // Start with noise
    float progression_constant = 2.0;
    pot = L * beta * speed * snoise(vec4(p.x, p.y, 0.0 + 43.0, uAccumulator * progression_rate * progression_constant) / L);

    // External directional field
    // Rotational potential gives a constant velocity field
    vec2 p_parallel = dot(field_main_direction, p) * field_main_direction;
    vec2 p_orthogonal = p - p_parallel;
    // z-component of cross(vec3(p_orthogonal, 0.0), vec3(field_main_direction, 0.0))
    float pot_directional = p_orthogonal.x * field_main_direction.y - p_orthogonal.y * field_main_direction.x;
    // Add the rotational potential
    pot += (1.0 - beta) * speed * pot_directional;

    // Affect the field by a sphere
    // The closer to the sphere, the less of the original potential.
    // The tangental potential that replaces it has no z-component in 2D.
    // The variable d_0 determines the distance to the sphere when the
    // particles start to become affected.
    float d_0 = L * 0.5;
    alpha = smoothstep(sphere_radius, sphere_radius + d_0, length(p - sphere_position));

    return alpha * pot;
}

void main(void) {
    vec2 uv = screenToTexture(vPosition);
    vec2 p = texture(uPositionSampler, uv).xy;

    float epsilon = 0.0001;
    if(length(p) < epsilon) {
        fragColor = field_main_direction;
    } else {
        float pot = potential(p);
        float dp3_dy = (pot - potential(vec2(p.x, p.y + epsilon))) / epsilon;
        float dp3_dx = (pot - potential(vec2(p.x + epsilon, p.y))) / epsilon;

        fragColor = vec2(dp3_dy, -dp3_dx);
    }
}