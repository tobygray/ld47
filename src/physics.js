const SAT = require('sat');

// adjusting the balance of these affects starting moving and keeping moving, respectively
const CO_MOVING_FRICTION = 0.6;
const CO_STATIC_FRICTION = 0.9;
const CO_SIDE_FRICTION = 0.3;
// adjusting this affects the non-rotational component of friction, i.e. how much we slow down on
// a straight line
const DOWNFORCE = 1;
// adjusting this affects how slowly the car responds to a net force
const CAR_MASS = 1;
// adjusting this affects the maximum acceleration
const MAX_TORQUE = 2.5;
// not the actual top speed - the point at which the motor can't produce any torque
// but leads to the top speed, along with the friction
const MAX_SPEED = 66;
// side force limit before falling out of track
const MAX_SIDE_FORCE = 4;
const MAX_SIDE_FORCE_SQRT = Math.sqrt(MAX_SIDE_FORCE);
// How close to losing grip that danger starts to happen (as a proportion of MAX_SIDE_FORCE)
const DANGER_THRESHOLD = 0.5;
// Maxium additional angle added by tail slide
const MAX_TAIL_ANGLE = 45;
// Scale collision forces
const FORWARD_COLLISION_SCALE = 0.1;
const SIDE_COLLISION_SCALE = 0.2;

export const PHYSICS_DEBUG = false;

const rad = (a) => (a * Math.PI) / 180;

export function getMaxSpeed(track, side) {
  const radius = track.getRadius(side);
  if (radius === 0) {
    return 99999999;
  }
  return Math.sqrt((MAX_SIDE_FORCE * Math.abs(radius)) / CAR_MASS);
}

// note: this ignores the additional friction on corners right now
export function getBrakingDistance(currentSpeed, targetSpeed) {
  const accel = -(CO_MOVING_FRICTION * DOWNFORCE) / CAR_MASS;
  return (targetSpeed * targetSpeed - currentSpeed * currentSpeed) / (2 * accel);
}

export function getStablePower(car) {
  const forceLoss = (car.speed / MAX_SPEED) * MAX_TORQUE;
  return (forceLoss + car.currentFriction) / MAX_TORQUE;
}

function carToSAT(car) {
  // the origin is centered in the x axis and 10% in the y axis
  const { width, height, angle } = car.sprite;
  const shape = new SAT.Box(new SAT.V(0, 0), width, height).toPolygon();
  shape.translate(-width / 2, -height / 10);
  shape.pos = new SAT.V(...car.pos);
  shape.setAngle(rad(angle));

  if (PHYSICS_DEBUG) {
    const c1 = shape.calcPoints[0].clone();
    c1.add(shape.pos);
    [car.corner1.x, car.corner1.y] = [c1.x, c1.y];
    const c2 = shape.calcPoints[1].clone();
    c2.add(shape.pos);
    [car.corner2.x, car.corner2.y] = [c2.x, c2.y];
    const c3 = shape.calcPoints[2].clone();
    c3.add(shape.pos);
    [car.corner3.x, car.corner3.y] = [c3.x, c3.y];
    const c4 = shape.calcPoints[3].clone();
    c4.add(shape.pos);
    [car.corner4.x, car.corner4.y] = [c4.x, c4.y];
  }

  return shape;
}

export function collide(car1, car2) {
  if (Math.abs(car1.sprite.zIndex - car2.sprite.zIndex) > 5) {
    // stop cars on bridges colliding
    return null;
  }
  const s1 = carToSAT(car1);
  const s2 = carToSAT(car2);
  const res = new SAT.Response();
  const coll = SAT.testPolygonPolygon(s1, s2, res);
  if (coll) {
    return res;
  }
  return null;
}

export default function physics(delta, car, track, side, raceState, coll) {
  if (car.fallOut > 0) {
    car.fallOut -= delta;
    if (car.fallOut <= 0) {
      car.speed = 0;
      car.tailAngle = 0;
      car.targetAngle = 0;
    }
    // we need a tick with speed = 0 and no funny business to place the cars back neatly
    return;
  }
  let collSideForce = 0;
  let collLinearForce = 0;
  if (coll !== null) {
    // make unit vectors, take dot products
    const angle = rad(car.angle);
    const forward = new SAT.V(0, -1).rotate(angle);
    const right = new SAT.V(1, 0).rotate(angle);
    collLinearForce = coll.dot(forward) * FORWARD_COLLISION_SCALE;
    collSideForce = coll.dot(right) * SIDE_COLLISION_SCALE;
  }
  let engineForce = car.power * MAX_TORQUE;
  // electric motors have a linear torque/speed graph
  const forceLoss = (car.speed / MAX_SPEED) * MAX_TORQUE;
  engineForce -= forceLoss;
  if (engineForce < 0) {
    engineForce = 0;
  }

  const radius = track.getRadius(side);
  let circularForce = 0;
  if (radius !== 0) {
    // the sign is inverted here: a positive radius is a right turn, which produces an apparent
    // force to the left.
    // need to keep the sign because the collision force is signed as well, with a right force +ve
    circularForce = -(CAR_MASS * car.speed * car.speed) / radius;
    if (PHYSICS_DEBUG && coll !== null) {
      console.log(car.side, 'collLinearForce', collLinearForce, 'circularForce', circularForce,
        'collSideForce', collSideForce, 'net', circularForce + collSideForce);
    }
    circularForce += collSideForce;
    // but for threshold checking we just want the absolute value
    circularForce = Math.abs(circularForce);
  }

  if (circularForce > MAX_SIDE_FORCE) {
    if (PHYSICS_DEBUG) {
      console.log(car.side, 'circularForce', circularForce);
    }
    // car falls out
    car.fallOut = 60;
    // High danger when you're flying through the air.
    car.dangerLevel = 1.0;
    if (raceState) {
      raceState.onCarFallOut(car);
    }
    car.fallHandedness = radius > 0 ? 5 : -5;

    if (track.cross === 1) {
      car.distance = 2 * track.getLength(car.side);
    } else if (track.cross === -1) {
      car.distance = track.getLength(car.side);
    }
    return;
  }
  const circularForceSqrt = Math.sqrt(circularForce);
  if (circularForceSqrt > (MAX_SIDE_FORCE_SQRT * DANGER_THRESHOLD)) {
    car.dangerLevel = (
      ((circularForceSqrt / MAX_SIDE_FORCE_SQRT) - DANGER_THRESHOLD) / (1 - DANGER_THRESHOLD)
    );
  } else {
    car.dangerLevel = 0.0;
  }

  car.targetAngle = MAX_TAIL_ANGLE * car.dangerLevel;
  if (radius < 0) {
    car.targetAngle *= -1;
  }

  if (coll !== null) {
    car.dangerLevel = 1.0;
  }

  let frictionForce;
  if (car.speed === 0) {
    frictionForce = DOWNFORCE * CO_STATIC_FRICTION;
  } else {
    frictionForce = circularForce * CO_SIDE_FRICTION + DOWNFORCE * CO_MOVING_FRICTION;
  }
  car.currentFriction = frictionForce;

  let netForce = engineForce - frictionForce + collLinearForce;
  if (car.speed === 0 && netForce < 0) {
    netForce = 0;
  }
  const accel = netForce / CAR_MASS;
  car.speed += accel * delta;
  if (car.speed < 0) {
    car.speed = 0;
  }
}
