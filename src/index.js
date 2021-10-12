const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  if(!username){
    return response.status(404).json({error: 'Username not entered'});
  }else{
    const userExist = users.find(user => user.username === username);
    if(!userExist){
      return response.status(404).json({error: 'Username not found'});
    }
  }
  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  const userExist = users.find(user => user.username === username);
  if(userExist){
    return response.status(400).json({error: 'User already exists'});
  }
  const user = {id: uuidv4(), name, username, todos: []};
  users.push(user);
  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find(user => user.username === username);
  const {todos} = user;
  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {title, deadline} = request.body;
  const todo = {id: uuidv4(), title, deadline: new Date(deadline), done: false,  created_at: new Date()};
  const user = users.find(user => user.username === username);
  user.todos.push(todo);
  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {username} = request.headers;
  const {title, deadline} = request.body;
  const user = users.find(user => user.username === username);
  const {todos} = user;
  const todoExist = todos.find(todo => todo.id === id); 
  if(!todoExist){
    return response.status(404).json({error: 'Todo not found'});
  }
  todoExist.title = title;
  todoExist.deadline = new Date(deadline);
  todos.map(todo => {
    if(todo.id === id){
      todo = todoExist;
    }
    return todo;
  }); 
    return response.status(200).json(todoExist);
  });

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {username} = request.headers;
  const user = users.find(user => user.username === username);
  const {todos} = user;
  const todoExist = todos.find(todo => todo.id === id);
  if(!todoExist){
    return response.status(404).json({error: 'Todo not found'});
  }

  todoExist.done = !todoExist.done;

  todos.map(todo => {
    if(todo.id === id){
      todo = todoExist;
    }
    return todo;
  });
  return response.status(200).json(todoExist);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {username} = request.headers;
  const user = users.find(user => user.username === username);
  const {todos} = user;
  const todoExist = todos.find(todo => todo.id === id);
  if(!todoExist){
    return response.status(404).json({error: 'Todo not found'});
  }
  todos.splice(todoExist, 1);
  return response.status(204).send();
});

module.exports = app;