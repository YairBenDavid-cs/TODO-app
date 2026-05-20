export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type Filter = 'all' | 'active' | 'completed';

export interface TodoCard {
  id: string;
  title: string;
  todos: Todo[];
  createdAt: number;
}
