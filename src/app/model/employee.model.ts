export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  group: string;
  description: Date;
}
