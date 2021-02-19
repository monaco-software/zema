import { UserObject } from '../../api/schema';

export interface CreateTopicFormFields {
  topic_name: string;
}

export interface TopicMessage {
  id: number;
  text: string;
  user: UserObject;
  // Unix timestamp
  createTimestamp: number;
}

export interface Topic {
  id: number;
  name: string;
  // Unix timestamp
  createTimestamp: number;
  messages: TopicMessage[];
}

export interface ForumState {
  topics: Topic[];
}
