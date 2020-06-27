import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionRepository.findOne(id);

    if (!transactions) {
      throw new AppError('Transaction does not exist!');
    }

    transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
