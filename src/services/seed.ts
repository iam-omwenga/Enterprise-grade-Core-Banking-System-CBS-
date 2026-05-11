import { dbService } from './db';
import { 
  UserRole, 
  AccountType, 
  AccountStatus, 
  TransactionType, 
  TransactionStatus 
} from '../types';

export const seedService = {
  async seedDemoData(userId: string) {
    // 1. Create 3 mock accounts for the current user
    const accounts = [
      {
        accountNumber: 'NC-CHK-88290',
        customerId: userId,
        type: AccountType.CHECKING,
        balance: 12500.50,
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        interestRate: 0.5,
        createdAt: Date.now() - (86400000 * 30), // 30 days ago
      },
      {
        accountNumber: 'NC-SAV-11204',
        customerId: userId,
        type: AccountType.SAVINGS,
        balance: 450000.00,
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        interestRate: 4.25,
        createdAt: Date.now() - (86400000 * 60),
      },
      {
        accountNumber: 'NC-FIX-44012',
        customerId: userId,
        type: AccountType.FIXED_DEPOSIT,
        balance: 1000000.00,
        currency: 'USD',
        status: AccountStatus.FROZEN,
        interestRate: 6.5,
        createdAt: Date.now() - (86400000 * 120),
      }
    ];

    for (const acc of accounts) {
      const id = acc.accountNumber.replace(/-/g, '_');
      await dbService.set('accounts', id, acc);

      // 2. Add some transactions for each account
      const transactions = [
        {
          accountId: id,
          type: TransactionType.DEPOSIT,
          amount: 5000,
          status: TransactionStatus.COMPLETED,
          description: 'Monthly Salary Credit',
          reference: `TRX_${Math.random().toString(36).substring(7).toUpperCase()}`,
          performedBy: 'SYSTEM',
          createdAt: Date.now() - 5000000
        },
        {
          accountId: id,
          type: TransactionType.WITHDRAWAL,
          amount: 1200,
          status: TransactionStatus.COMPLETED,
          description: 'Cloud Infrastructure Payment',
          reference: `TRX_${Math.random().toString(36).substring(7).toUpperCase()}`,
          performedBy: userId,
          createdAt: Date.now() - 10000000
        }
      ];

      for (const tx of transactions) {
        const txId = tx.reference;
        await dbService.set(`accounts/${id}/transactions`, txId, tx);
      }
    }
  }
};
