export type UserStory = {
  id: string;
  name: string;
  description: string;
  priority: string;
  projectId: string;
  createDate: any;
  state: string; // todo/doing/done
  createdBy: string; // id użytkownika
};
