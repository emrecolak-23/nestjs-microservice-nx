import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';

@Job({
  name: 'Fibonacci',
  description: 'Generates Fibonacci numbers and store it in the database',
})
export class FibonacciJob extends AbstractJob {}
