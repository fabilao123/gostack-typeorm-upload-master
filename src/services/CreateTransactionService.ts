// import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  titleCategory: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    titleCategory,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have balance');
    }

    let category = await categoryRepository.findOne({
      where: { title: titleCategory },
    });

    if (!category) {
      category = categoryRepository.create({
        title: titleCategory,
      });

      await categoryRepository.save(category);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
