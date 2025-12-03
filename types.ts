export type TransactionType = 'expense' | 'income';

export enum ExpenseCategory {
  FOOD = 'Food & Dining',
  GROCERIES = 'Groceries',
  TRANSPORT = 'Transport',
  BILLS = 'Bills & Utilities',
  SHOPPING = 'Shopping',
  HEALTH = 'Health & Fitness',
  HOUSING = 'Housing & Rent',
  EDUCATION = 'Education',
  ENTERTAINMENT = 'Entertainment',
  TRAVEL = 'Travel & Vacation',
  PERSONAL_CARE = 'Personal Care',
  GIFTS = 'Gifts & Donations',
  INVESTMENT = 'Investment',
  DEBT = 'Debt & Loans',
  INSURANCE = 'Insurance',
  PETS = 'Pets',
  OTHERS = 'Others',
}

export enum IncomeCategory {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  BUSINESS = 'Business',
  GIFT = 'Gift',
  REFUND = 'Refund',
  INVESTMENT_RETURN = 'Investment Return',
  RENTAL = 'Rental Income',
  OTHERS = 'Others',
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
  category: string;
  type: TransactionType;
  note: string;
  timestamp: number; // created at
}

export type TimeRange = 'month' | 'year' | 'custom';

export interface FilterState {
  range: TimeRange;
  customStart: string;
  customEnd: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}