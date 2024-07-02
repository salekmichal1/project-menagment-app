export type Task = {
  id: string;
  name: string;
  description: string;
  priority: string; // low/med/hig
  userStoryId: string;
  expectedEndDate: any;
  createDate: any;
  startDate: any;
  endDate: any;
  state: string; // todo/doing/done
  pinedUser: string;
};
