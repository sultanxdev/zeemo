import amqp from 'amqplib';
import { logger } from '@zeemo/shared';
import { EventEmitter } from 'events';

export const QUEUE_INVESTIGATIONS = 'zeemo.investigations';
export const EXCHANGE_INCIDENTS = 'zeemo.incidents';

class RabbitMQClient extends EventEmitter {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private isConnected = false;
  private connectionAttempted = false;

  async connect(): Promise<boolean> {
    if (this.connectionAttempted && !this.isConnected) {
      return false;
    }
    this.connectionAttempted = true;

    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(EXCHANGE_INCIDENTS, 'topic', { durable: true });
      await this.channel.assertQueue(QUEUE_INVESTIGATIONS, { durable: true });
      await this.channel.bindQueue(QUEUE_INVESTIGATIONS, EXCHANGE_INCIDENTS, 'incident.investigate');

      this.isConnected = true;
      logger.info('Connected to RabbitMQ', { url, exchange: EXCHANGE_INCIDENTS, queue: QUEUE_INVESTIGATIONS });
      return true;
    } catch (error) {
      logger.warn('RabbitMQ unavailable, using resilient in-memory dispatcher', {
        error: (error as Error).message,
        fallback: 'Local background runner active',
      });
      this.isConnected = false;
      return false;
    }
  }

  async publishInvestigation(payload: { incidentId: string; workspaceId: string; runId: string }): Promise<void> {
    const isRabbitReady = this.isConnected || (await this.connect());
    if (isRabbitReady && this.channel) {
      this.channel.publish(
        EXCHANGE_INCIDENTS,
        'incident.investigate',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      logger.info('Dispatched investigation message to RabbitMQ', payload);
    } else {
      // Dispatch via local event emitter
      logger.info('Dispatching investigation locally (fallback)', payload);
      this.emit('investigate', payload);
    }
  }
}

export const rabbitMQClient = new RabbitMQClient();
