uniform float uDelta;
uniform float uAccumulator;
in vec2 vPosition;
out vec4 fragColor;

uniform sampler2D uPositionSampler;
uniform sampler2D uVelocitySampler;

const float field_speed = 0.0007;
const float noise_strength = 0.25;
const float progression_rate = 0.25;
const float length_scale = 0.5;
const vec3 field_main_direction = vec3(-1.0, 0.0, 0.0);
const vec3 sphere_position = vec3(0.5, 0.5, 0.0);
const float sphere_radius = 0.25;

// The vector field potential has three components
vec3 potential(vec2 p) {
    float L;      // Length scale as described by Bridson
    float speed;  // field speed
    float alpha;  // Alpha as described by Bridson
    float beta;   // amount of curl noise compared to the constant field
    vec3 n;      // Normal of closest surface
    vec3 pot;    // Output potential

    L = length_scale;
    speed = field_speed;
    beta = noise_strength;

    // Start with an empty field
    pot = vec3(0.0, 0.0, 0.0);
    // Add Noise in each direction
    float progression_constant = 2.0;
    pot += L * beta * speed * vec3(snoise(vec4(p.x, p.y, 0.0, uAccumulator * progression_rate * progression_constant) / L), snoise(vec4(p.x, p.y + 43.0, 0.0, uAccumulator * progression_rate * progression_constant) / L), snoise(vec4(p.x, p.y, 0.0 + 43.0, uAccumulator * progression_rate * progression_constant) / L));

    // External directional field
    // Rotational potential gives a constant velocity field
    vec2 p_parallel = dot(field_main_direction.xy, p) * field_main_direction.xy;
    vec2 p_orthogonal = p - p_parallel;
    vec3 pot_directional = cross(vec3(p_orthogonal, 0.0), field_main_direction);
    // Add the rotational potential
    pot += (1.0 - beta) * speed * pot_directional;

    // Affect the field by a sphere
    // The closer to the sphere, the less of the original potential
    // and the more of a tangental potential.
    // The variable d_0 determines the distance to the sphere when the
    // particles start to become affected.
    float d_0 = L * 0.5;
    vec3 p3d = vec3(p, 0.0);
    alpha = abs((smoothstep(sphere_radius, sphere_radius + d_0, length(p3d - sphere_position))));

    n = normalize(p3d);
    pot = (alpha) * pot + (1.0 - (alpha)) * n * dot(n, pot);

    return pot;
}

void main(void) {
    vec2 uv = screenToTexture(vPosition);
    vec2 p = texture(uPositionSampler, uv).xy;

    float epsilon = 0.0001;
    if(length(p) < epsilon) {
        fragColor = vec4(field_main_direction, 1.0);
    } else {
        vec3 pot = potential(p);
        float dp3_dy = (pot.z - potential(vec2(p.x, p.y + epsilon))).z / epsilon;
        float dp2_dz = (pot.y - potential(vec2(p.x, p.y))).y / epsilon;
        float dp1_dz = (pot.x - potential(vec2(p.x, p.y))).x / epsilon;
        float dp3_dx = (pot.z - potential(vec2(p.x + epsilon, p.y))).z / epsilon;

        vec2 vel = vec2(dp3_dy - dp2_dz, dp1_dz - dp3_dx);
        fragColor = vec4(vel, 0.0, 1.0);
    }
}