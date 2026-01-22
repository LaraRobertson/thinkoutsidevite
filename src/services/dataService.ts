import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

class DataService {
  private publicClient = generateClient<Schema>({ authMode: 'apiKey' });
  private authClient = generateClient<Schema>({ authMode: 'userPool' });

  // Public operations (read-only)
  public getClient() {
    return this.publicClient;
  }

  // Authenticated operations
  public getAuthClient() {
    return this.authClient;
  }

  // Helper methods
  async createTodo(content: string) {
    return this.authClient.models.Todo.create({ content });
  }

  async deleteTodo(id: string) {
    return this.authClient.models.Todo.delete({ id });
  }

  async createUser(email: string) {
    return this.authClient.models.User.create({ email });
  }
}

export const dataService = new DataService();