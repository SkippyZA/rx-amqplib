import * as Rx from 'rx';
import {Connection, Channel, Options} from 'amqplib';
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
   * Set up a consumer where each message will emit an observable of `Message`
   *
   * @param queue
   * @param options
   * @returns {Rx.Observable<Message>}
   */
  public consume(queue: string, options?: Options.Consume): Rx.Observable<Message> {
    return <Rx.Observable<Message>> Rx.Observable.create(observer => {
        this.channel.consume(queue, (msg: Message) => {
          observer.onNext(msg);
        }, options);
      });
  }
}

export default RxChannel;
