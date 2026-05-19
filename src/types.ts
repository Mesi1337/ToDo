export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  order: number;
}

export interface SketchbookSettings {
  language: 'pl' | 'en';
  paperStyle: 'lines' | 'dots' | 'plain';
}
