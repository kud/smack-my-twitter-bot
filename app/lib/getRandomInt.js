/**
 * Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution!
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

export default getRandomInt
