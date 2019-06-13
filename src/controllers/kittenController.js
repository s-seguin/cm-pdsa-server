import Kitten from '../database/models/kitten';

/**
 * Return the kittens by name in the request from the database.
 * @param {*} req the http request object
 * @param {*} res http response object
 */
export function findByName(req, res) {
  Kitten.find({ name: req.params.name }, (err, kittens) => {
    if (err) return console.error(err);
    return res.json(kittens);
  });
}

/**
 * Return the kittens that match the age in the request.
 * @param {*} req the http request object
 * @param {*} res the http response object
 */
export function findByAge(req, res) {
  Kitten.find({ age: req.params.age }, (err, kittens) => {
    if (err) return console.error(err);
    return res.send(kittens);
  });
}

/**
 * Return all of the kittens in the database.
 * @param {*} req the http request object
 * @param {*} res the http response object
 */
export function findAll(req, res) {
  Kitten.find((err, kittens) => {
    if (err) return console.error(err);
    return res.send(kittens);
  });
}

/**
 * Create a new kitten with the name and age parameters in the request.
 * @param {*} req the http request object
 * @param {*} res the http response object
 */
export function newKitten(req, res) {
  const kitty = new Kitten({
    name: req.params.name,
    age: req.params.age
  });
  kitty.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
}

/**
 * Rename the kitten specified in the request.
 * @param {*} req the http request object
 * @param {*} res the http response object
 */
export function rename(req, res) {
  const result = Kitten.updateMany({ name: req.params.oldName }, { name: req.params.newName });
  console.log(result);
  res.send(result.n);
}
