uniform float uDelta;
uniform float uAccumulator;
in vec2 vPosition;
out vec4 fragColor;

uniform sampler2D uPositionSampler;
uniform sampler2D uVelocitySampler;

const float MAX_LIFETIME_SECONDS = 5.5;

void main(void) {
    vec2 uv = screenToTexture(vPosition);
    vec4 position = texture(uPositionSampler, uv);
    vec2 velocity = texture(uVelocitySampler, uv).xy;

    bool spawned = false;
    if(position.a <= 0.0 || position.x <= 0.0) {
        // Reset old and out-of-bound particles.
        // Make sure that we do not release all particles at the same time when the simulation starts
        float chance = rand(vec2(uv.x, uv.y)) * MAX_LIFETIME_SECONDS;
        if(chance < uAccumulator) {
            position.x = 1.0;
            float r0 = rand(vec2(uv.y + uAccumulator, uv.x + uAccumulator));
            float r1 = rand(vec2(uv.x - uAccumulator, uv.y - uAccumulator));
            position.y = r0 * 0.75 + 0.125;
            position.z = r0 * 0.8 + r1 * 0.2;
            position.a = 1.0;
            spawned = true;
        }
    }

    position.a = position.a - (uDelta / MAX_LIFETIME_SECONDS);

    // The velocity was computed for the particle's previous position, so skip it for freshly spawned particles
    if(!spawned) {
        position.xy += velocity * uDelta;
    }

    fragColor = position;
}