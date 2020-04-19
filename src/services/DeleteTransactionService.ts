import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepositiry from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepositiry = getCustomRepository(TransactionRepositiry);

    const transaction = await transactionRepositiry.findOne(id);

    if (!transaction) {
      throw new AppError('TRANSACAO NAO EXISTE');
    }

    await transactionRepositiry.remove(transaction);
  }
}

export default DeleteTransactionService;
