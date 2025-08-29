import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    if (!newTodoTitle.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/todos`, {
        title: newTodoTitle
      });
      setTodos([...todos, response.data]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todoId, updates) => {
    try {
      const response = await axios.put(`${API}/todos/${todoId}`, updates);
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API}/todos/${todoId}`);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createTodo();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Todo List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1"
            />
            <Button 
              onClick={createTodo} 
              disabled={loading || !newTodoTitle.trim()}
              className="px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) =>
                    updateTodo(todo.id, { completed: checked })
                  }
                />
                <span
                  className={`flex-1 ${
                    todo.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {todos.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No todos yet. Add one above!
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-500 pt-4 border-t">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter(t => t.completed).length}</span>
            <span>Remaining: {todos.filter(t => !t.completed).length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoApp;