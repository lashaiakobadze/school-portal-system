import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Inject,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('subscriber')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscriberController {
	constructor(
		@Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
	) {}

	@Get()
	async getSubscribers() {
		return this.subscribersService.send(
			{
				cmd: 'get-all-subscribers',
			},
			'',
		);
	}

	@Post()
	async create(@Body() subscriber: any) {
		return this.subscribersService.send({
		  cmd: 'add-subscriber'
		}, subscriber)
	}
}
