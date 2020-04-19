import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepositiry from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepositiry = getCustomRepository(TransactionRepositiry);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepositiry.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Voce nao tem saldo suficiente ');
    }

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepositiry.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionRepositiry.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
