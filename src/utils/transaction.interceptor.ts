import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Observable, tap, catchError } from 'rxjs';

export class TransactionInterceptor implements NestInterceptor {
	constructor(
		@InjectConnection() private readonly connection: mongoose.Connection,
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest(); // as FastifyRequest;
		const session: mongoose.ClientSession =
			await this.connection.startSession();
		request.mongooseSession = session;
		session.startTransaction();
		return next.handle().pipe(
			tap(async () => {
				await session.commitTransaction();
				session.endSession();
			}),
			catchError(async err => {
				await session.abortTransaction();
				session.endSession();
				throw err;
			}),
		);
	}
}

