const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const session = require('express-session');
const flash = require('connect-flash');
const { v4: uuidv4 } = require('uuid');

router.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

router.use(express.urlencoded({ extended: false }));
router.use(flash());

const validateForm = (req, res, next) => {
  const { username, name, email, age } = req.body;

  if (username === '' || name === '' || email === '' || age === '') {
    req.flash('error', 'Please fill in all fields.');
    res.redirect('/users/create');
  } else next();
};
const createUser = async (req, res) => {
  try {
    const { username, name, email, age } = req.body;

    const id = uuidv4();
    const user = {
      id: id,
      username: username,
      name: name,
      email: email,
      age: age,
    };

    const db = await fs.readFile('./db/data.json', 'utf8');
    const data = JSON.parse(db);
    const { users } = data;
    if (users) {
      const newUsers = [...users, user];

      await fs.writeFile(
        './db/data.json',
        `{ "users": ${JSON.stringify(newUsers)}}`
      );

      res.redirect('/users/listing');
    } else {
      await fs.writeFile(
        './db/data.json',
        `{ "users": ${JSON.stringify(user)}}`
      );

      res.redirect('/users/listing');
    }
  } catch (error) {
    console.log(error);
  }
};
const listUsers = async (req, res) => {
  try {
    const db = await fs.readFile('./db/data.json', 'utf8');
    const data = JSON.parse(db);
    const { users } = data;
    // console.log(users);

    res.render('userListing', { users: users });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await fs.readFile('./db/data.json', 'utf8');
    const data = JSON.parse(db);
    const { users } = data;
    const userIndex = users.findIndex((user) => user.id === userId);
    users.splice(userIndex, 1);
    // console.log(userIndex);
    // console.log(users);

    await fs.writeFile(
      './db/data.json',
      `{ "users": ${JSON.stringify(users)}}`
    );
    res.redirect('/users/listing');
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await fs.readFile('./db/data.json', 'utf8');
    const data = JSON.parse(db);
    const { users } = data;
    const user = users.find((person) => person.id === userId);
    // console.log(user);
    res.render('userEdit', {
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, name, email, age } = req.body;

    const updUser = {
      id: userId,
      username: username,
      name: name,
      email: email,
      age: age,
    };
    const db = await fs.readFile('./db/data.json', 'utf8');
    const data = JSON.parse(db);
    const { users } = data;
    users.splice(
      users.findIndex((person) => person.id === userId),
      1,
      updUser
    );

    await fs.writeFile(
      './db/data.json',
      `{ "users": ${JSON.stringify(users)}}`
    );
    res.redirect('/users/listing');
  } catch (error) {
    console.log(error);
  }
};

router.get('/create', (req, res) => {
  const errorMessage = req.flash('error')[0];
  res.render('createUser', { errorMessage });
});
router.post('/create', [validateForm, createUser]);

router.get('/listing', listUsers);

router.post('/:id', deleteUser);

router.get('/:id/edit', editUser);

router.post('/:id/edit', updateUser);

module.exports = router;
