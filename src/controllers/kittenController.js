import Kitten from '../database/models/kitten';

export function findByName(req, res) {
  Kitten.find({ name: req.params.name }, (err, kittens) => {
    if (err) return console.error(err);
    return res.send(kittens);
  });
}

export function findByAge(req, res) {
  Kitten.find({ age: req.params.age }, (err, kittens) => {
    if (err) return console.error(err);
    return res.send(kittens);
  });
}

export function findAll(req, res) {
  Kitten.find((err, kittens) => {
    if (err) return console.error(err);
    return res.send(kittens);
  });
}

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

export function rename(req, res) {
  const result = Kitten.updateMany({ name: req.params.oldName }, { name: req.params.newName });
  console.log(result);
  res.send(result.n);
}
