const RUNNING = 'RUNNING';
const JUMPING = 'JUMPING';

const DEFAULT_LOCATION = 10;
const DEFAULT_COLOR = '#FFF';

const GROUND = 10;
const JUMP_VELOCITY = 12;
const GRAVITY = .5;

const HEIGHT = 22;
const WIDTH = 22;

const FRAME_STANDING = 0;
const FRAME_BLINKING = 1;
const FRAME_LEFT_LEG = 2;
const FRAME_RIGHT_LEG = 3;

const COUNTER_LIMIT = 60;
const WALK_CYCLE_FR = 10; // ideally divides evenly into COUNTER_LIMIT

export default function Dino(ctx, x = DEFAULT_LOCATION, color = DEFAULT_COLOR) {
    this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAWCAYAAACVDJ0dAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wwJFR4dSVZTmgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAKKSURBVHja7VvBbsMgDLWjHPJVPZJvhmO/qjd26CIxCsE2OE0WW0LaFHgG+9mA2dB7Dy1xzm0/xkZXDCEAVQxXF3eTdV13cb33CDeSidE3UvokDjRcJi4iwtZG4a7rGmOMsDVJUNyZ9O9Ug9dKClrz1cKtEfOs870F6bWcoiVa870aOa/mN02ZzQT/P0Aty3dmehOTu2d6rRRiuCZ6pH88HgAA8Hw+ix0a1YJ0P/5TTtvG1UpshkvChRruKLlbuRIAYF6WJb5eL2w4I3Ky2+/YWOpjuP24AO8yY4uwpVLk3ph0Tj0BRg3kEMIwnRy9c2NwpE6eOSnDVcDdIzvnPg0AmO9QCu8ZmNlhhE6S3hkAYFmW6JxD5uBIyEiGq4hbyvYtwm/fG7tELBCTRChGMOc7oFQnW+9UAeco4kSe4Q7GTUlOyfDMM3zMGrX/ewGyUilXJ1vvzMw+IxxuuINxuceZBvFRMM/yYunvDsN0UvR2lSw1qgmGq49LuFgOJeHZdE4gqzHvls9+vxmuEq7gmEIek+jFI4PtSJ1Th2MoCzFcJVwp8b9IQiy0I4j/oXcSOAaVHG64AqdTic8NkA4SYmXMx+U03806iU/WOzEdg9yzpuHq4lIILd0RiCRMyYbZWmutusYQAsVW2KN3JtykR10wjsRNIxydc5JLYYrLqQN/xQ7ee0yrOPnvEskfjwo2wOxVtcfeJb2w59csm5P1To1qAeZRJ1nMF3CBklUYGe7joehMdqhl9t4zfzaX2Lhsi+1NtVOWycV6554KgjTTaeOOwM9KaR9/J3JWOyhdbnFv7sqlVWwEBL96s/Ot9P+YcYDjj8TtJn6SYS5hh9KRpueYU7HBcFvv2Wk04A8GVyP3KvY3jQAAAABJRU5ErkJggg==';
    this.ctx = ctx;

    this.x = x;
    this.y = GROUND;
    this.w = WIDTH;
    this.h = HEIGHT;

    this.color = color;
    this.state = RUNNING;
    this.frame = FRAME_LEFT_LEG;
    this.counter = 0;

    this.jump = () => {
        this.state = JUMPING;
        this.velocity = JUMP_VELOCITY;
        this.frame = FRAME_STANDING;
    }

    this.update = () => {
        this.counter++;

        if (this.counter > COUNTER_LIMIT) {
            this.counter = 0;
        }

        if (this.state = JUMPING) {
            this.velocity -= GRAVITY;
            this.y += Math.floor(this.velocity);
            if (this.y < GROUND) {
                this.state = RUNNING;
                this.y = GROUND;
            }
        }

        if (this.state == RUNNING) {
            // update the walk cycle every WALK_CYCLE_FR frames
            if (this.counter % WALK_CYCLE_FR === 0) {
                // the walk cycle is only 2 frames long, so toggle on even/odd.
                const evenFrame = !((this.counter / WALK_CYCLE_FR) % 2);
                this.frame = evenFrame ? FRAME_LEFT_LEG : FRAME_RIGHT_LEG;
            }
        }

        ctx.fillStyle = colors[1];
        ctx.drawImage(this.image, this.frame, 0, this.w, this.h,
            this.x, this.y, this.w, this.h);
    }
}
}