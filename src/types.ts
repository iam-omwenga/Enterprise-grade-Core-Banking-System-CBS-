export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  TELLER = "TELLER",
  LOAN_OFFICER = "LOAN_OFFICER",
  AUDITOR = "AUDITOR",
  CUSTOMER = "CUSTOMER",
}

export enum AccountType {
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING",
  FIXED_DEPOSIT = "FIXED_DEPOSIT",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  CLOSED = "CLOSED",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  INTEREST = "INTEREST",
  FEE = "FEE",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum LoanStatus {
  APPLIED = "APPLIED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  DISBURSED = "DISBURSED",
  REPAID = "REPAID",
  DEFAULTED = "DEFAULTED",
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: number;
  updatedAt: number;
}

export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  interestRate: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  reference: string;
  performedBy: string;
  createdAt: number;
}

export interface Loan {
  id: string;
  customerId: string;
  amount: number;
  durationMonths: number;
  interestRate: number;
  status: LoanStatus;
  appliedDate: number;
  approvalDate?: number;
}
