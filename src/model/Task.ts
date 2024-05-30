export type Task = {
  name: string;
  description: string;
  priority: string; // low/med/hig
  userStoryId: string;
  expectedEndDate: Date;
  createDate: Date;
  startDate: Date;
  endDate: Date;
  state: string; // todo/doing/done
  pinedUser: string; // id użytkownika
};