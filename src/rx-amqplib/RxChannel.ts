import * as Rx from 'rx';
import {Connection, Channel, Options} from 'amqplib';
import RxMessage from './RxMessage';
import {Message} from 'amqplib/properties';

/**
 * AMQP Rx Channel
 */
class RxChannel {

  /**
   * Class constructor.
   *
   * @param channel
   */
  constructor(private channel: Channel) {
  }

  /**
   * Assert a queue into existence.
   *
   * This operation is idempotent given identical arguments; however, it will bork the channel if the queue already
   * exists but has different properties.
   *
   * @param queue
   * @param options
   * @returns {Rx.Observable<RxChannel>}
   */
  public assertQueue(queue: string, options: Options.AssertQueue): Rx.Observable<RxChannel> {
    return Rx.Observable.fromPromise(this.channel.assertQueue(queue, options))
      .map(() => this);
  }

  /**
   * Assert an exchange into existence.
   *
   * @param exchange
   * @param type
   * @param options
   * @returns {Rx.Observable<RxChannel>}
   */
  public assertExchange(exchange: string, type: string, options?: Options.AssertExchange): Rx.Observable<RxChannel> {
    return Rx.Observable.fromPromise(this.channel.assertExchange(exchange, type, options))
      .map(() => this);
  };

  /**
   * Publish a single message to an exchange.
   *
   * @param exchange
   * @param routingKey
   * @param content
   * @param options
   * @returns {Rx.Observable<RxChannel>}
   */
  public publish(exchange: string, routingKey: string, content: Buffer,
                 options?: Options.Publish): Rx.Observable<RxChannel> {
    return Rx.Observable.just(this.channel.publish(exchange, routingKey, content, options))
      .map(() => this);
  }

  /**
   * Send a single message with the content given as a buffer to the specific queue named, bypassing routing.
   *
   * @param queue
   * @param message
   * @param options
   * @returns {Rx.Observable<RxChannel>}
   */
  public sendToQueue(queue: string, message: Buffer, options?: Options.Publish): Rx.Observable<RxChannel> {
    return Rx.Observable.just(this.channel.sendToQueue(queue, message, options))
      .map(() => this);
  };

  /**
   * Set up a consumer where each message will emit an observable of `RxMessage`
   *
   * @param queue
   * @param options
   * @returns {Rx.Observable<RxMessage>}
   */
  public consume(queue: string, options?: Options.Consume): Rx.Observable<RxMessage> {
    return <Rx.Observable<RxMessage>> Rx.Observable.create(observer => {
        this.channel.consume(queue, (msg: Message) => {
          observer.onNext(new RxMessage(msg));
        }, options);
      });
  }


  /**
   * Close a channel.
   *
   * @returns {Rx.Observable<RxChannel>}
   */
  public close(): Rx.Observable<RxChannel> {
    return Rx.Observable.fromPromise(this.channel.close())
      .map(() => this);
  }

  /**
   * Set the prefetch count for this channel. The count given is the maximum number of messages sent over the channel
   * that can be awaiting acknowledgement; once there are count messages outstanding, the server will not send more
   * messages on this channel until one or more have been acknowledged. A falsey value for count indicates no such
   * limit.
   *
   * @param count
   * @param global
   * @returns {Rx.Observable<RxChannel>}
   */
  public prefetch(count: number, global?: boolean): Rx.Observable<RxChannel> {
    return Rx.Observable.fromPromise(this.channel.prefetch(count, global))
      .map(() => this);
  }

  /**
   * Acknowledge the given message, or all messages up to and including the given message.
   *
   * @param message
   * @param allUpTo
   * @returns {Rx.Observable<RxChannel>}
   */
  public ack(message: RxMessage, allUpTo?: boolean): Rx.Observable<RxChannel> {
    return Rx.Observable.just(this.channel.ack(message, allUpTo))
      .map(() => this)
  }
}

export default RxChannel;
