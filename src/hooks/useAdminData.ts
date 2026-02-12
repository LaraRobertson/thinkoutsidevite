import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { dataService } from "../services/dataService";

export function useAdminData() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);


  const { authStatus } = useAuthenticator();

  useEffect(() => {
    const todoSubscription = dataService.getClient().models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos([...data.items]);
        setLoading(false);
      },
      error: (err) => {
        setError(`Failed to load todos: ${err.message}`);
        setLoading(false);
      }
    });
    
    const userSubscription = dataService.getClient().models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
      error: (err) => setError(`Failed to load users: ${err.message}`)
    });

    return () => {
      todoSubscription.unsubscribe();
      userSubscription.unsubscribe();
    };
  }, []);

  const createTodo = async () => {
    try {
      setCreating(true);
      const content = window.prompt("Todo content");
      if (!content) return;
      await dataService.createTodo(content);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to create todo: ${message}`);
    } finally {
      setCreating(false);
    }
  };

  const createUser = async () => {
    console.log('createUser called');
    try {
      setCreating(true);
      const email = window.prompt("User email");
      if (!email) return;
      await dataService.createUser(email);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to create user: ${message}`);
    } finally {
      setCreating(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setDeleting(id);
      await dataService.deleteTodo(id);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to delete todo: ${message}`);
    } finally {
      setDeleting(null);
    }
  };

  return {
    todos,
    users,
    error,
    loading,
    creating,
    deleting,
    authStatus,
    createTodo,
    createUser,
    deleteTodo,
    isAuthenticated: authStatus === 'authenticated'
  };
}