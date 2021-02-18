export interface CreateTopicFormFields {
  topic_name: string;
}

export interface Topic {
  id: number;
  name: string;
  // Unix timestamp
  createTimestamp: number;
  messages: string[];
}

export interface ForumState {
  topics: Topic[];
}
