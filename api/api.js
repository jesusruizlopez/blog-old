module.exports = function(app) {
  var userController = require('./controllers/users.js');
  var postController = require('./controllers/posts.js');

  app.get('/', function(req, res) { res.send(401); });
  
  app.post('/registerAccount', userController.registerAccount);
  app.post('/login', userController.login);

  app.post('/createPost', postController.createPost);
  app.post('/addComment', postController.addComment);
  
  app.get('/getPosts', postController.getPosts);
  app.get('/getPost', postController.getPost);
};