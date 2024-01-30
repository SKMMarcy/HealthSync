const createUser = async (req, res) => {
  const {
    session, // this req.session property is put here by the handleCookieSessions middleware
    db: { User }, // this req.db.User property is put here by the addModelsToRequest middleware
    body: { username, password, name, email }, // this req.body property is put here by the client
  } = req;

  // TODO: check if username is taken, what should you return?
  const user = await User.create(username, password, name, email);
  session.userId = user.id;

  res.send(user);
};

module.exports = createUser;
