// adjusting the balance of these affects starting moving and keeping moving, respectively
const CO_MOVING_FRICTION = 0.6;
const CO_STATIC_FRICTION = 0.9;
// adjusting this affects the non-rotational component of friction, i.e. how much we slow down on
// a straight line
const DOWNFORCE = 1;
// adjusting this affects how slowly the car responds to a net force
const CAR_MASS = 1;
const MAX_TORQUE = 2;
// not the actual top speed - the point at which the motor can't produce any torque
// but leads to the top speed, along with the friction
const MAX_SPEED = 66;
// side force limit before falling out of track
const MAX_SIDE_FORCE = 2;
// How close to losing grip that danger starts to happen (as a proportion of MAX_SIDE_FAULT)
const DANGER_THERSHOLD = 0.5;

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
  const forceMax = ((MAX_SPEED - car.speed) / MAX_SPEED) * MAX_TORQUE;
  if (engineForce > forceMax) {
    engineForce = forceMax;
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
  if (circularForce > (MAX_SIDE_FORCE * DANGER_THERSHOLD)) {
    car.dangerLevel = (
      ((circularForce / MAX_SIDE_FORCE) - DANGER_THERSHOLD) / (1 - DANGER_THERSHOLD)
    );
  } else {
    car.dangerLevel = 0.0;
  }

  let frictionForce;
  if (car.speed === 0) {
    frictionForce = DOWNFORCE * CO_STATIC_FRICTION;
  } else {
    frictionForce = (circularForce + DOWNFORCE) * CO_MOVING_FRICTION;
  }

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
