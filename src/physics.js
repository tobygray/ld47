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

export function getMaxSpeed(track, side) {
  const radius = track.getRadius(side);
  if (radius === 0) {
    return 99999999;
  }
  return Math.sqrt((MAX_SIDE_FORCE * Math.abs(radius)) / CAR_MASS);
}

// note: this ignores the additional friction on corners right now
export function getBrakingDistance(currentSpeed, targetSpeed) {
  const accel = (CO_MOVING_FRICTION * DOWNFORCE) / CAR_MASS;
  return (targetSpeed * targetSpeed - currentSpeed * currentSpeed) / (2 * accel);
}

export function getStablePower(car) {
  const forceLoss = (car.speed / MAX_SPEED) * MAX_TORQUE;
  return (forceLoss + car.currentFriction) / MAX_TORQUE;
}

export default function physics(delta, car, track, side, raceState) {
  if (car.fallOut > 0) {
    car.fallOut -= delta;
    if (car.fallOut <= 0) {
      car.speed = 0;
    } else {
      return;
    }
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
    circularForce = (CAR_MASS * car.speed * car.speed) / Math.abs(radius);
  }

  if (circularForce > MAX_SIDE_FORCE) {
    // car falls out
    car.fallOut = 60;
    // High danger when you're flying through the air.
    car.dangerLevel = 1.0;
    if (raceState) {
      raceState.onCarFallOut(car);
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

  let frictionForce;
  if (car.speed === 0) {
    frictionForce = DOWNFORCE * CO_STATIC_FRICTION;
  } else {
    frictionForce = circularForce * CO_SIDE_FRICTION + DOWNFORCE * CO_MOVING_FRICTION;
  }
  car.currentFriction = frictionForce;

  let netForce = engineForce - frictionForce;
  if (car.speed === 0 && netForce < 0) {
    netForce = 0;
  }
  const accel = netForce / CAR_MASS;
  car.speed += accel * delta;
  if (car.speed < 0) {
    car.speed = 0;
  }
}
