# RxJS wrapper for amqplib
rx-amqplib is a wrapper for using the squaremo amqplib NodeJS package with RxJS.

## Gettings started

To include this library in your project, all you need to do is install it using NPM.

```
$ npm install rx-amqplib --save
```

## Examples

Here is a basic example of creating a connection to a RabbitMQ server, creating a channel + queue and sneding a message to the queue.

```javascript
const config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
    .doOnNext(reply => reply.channel.sendToQueue(config.queue, new Buffer('Test message')))
    .flatMap(reply => reply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => console.log('Message sent'));
```

## More Examples

1. ### Hello World

   [Server](./examples/server.js), [Client](./examples/client.js)

   The simplest thing that does something.

   ![](https://www.rabbitmq.com/img/tutorials/python-one.png "Hello world queue")

2. ### Work Queues

   [New task](./examples/new_task.js), [Worker](./examples/worker.js)

   Distributing tasks among workers

   ![](https://www.rabbitmq.com/img/tutorials/python-two.png "Worker queue")

3. ### Publish/Subscribe

   [Emit logs](./examples/emit_logs.js), [Receive logs](./examples/receive_logs.js)

   Sending messages to many consumers at once

   ![](https://www.rabbitmq.com/img/tutorials/python-three.png "Publish/Subscribe Queue")

4. ### Routing

   [Emit log](./examples/emit_log_direct.js), [Receive logs](./examples/receive_logs_direct.js)

   Receiving messages selectively

   ![](https://www.rabbitmq.com/img/tutorials/python-four.png "Routing Queue")

5. ### Topics

   [Emit log](./examples/emit_log_topic.js), [Receive logs](./examples/receive_logs_topic.js)

   Receiving messages based on a pattern

   ![](https://www.rabbitmq.com/img/tutorials/python-five.png "Topic Queue")

6. ### RPC

   [RPC Server](./examples/rpc_server.js), [RPC Client](./examples/rpc_client.js)

   Remote procedure call implementation

   ![](https://www.rabbitmq.com/img/tutorials/python-six.png "RPC Queue")


## Build it Yourself

Should you wish to build the library yourself, either for personal use, or for contribution, please ensure there are no errors emitted during the build process with `gulp`.

```
$ git clone git@github.com:SkippyZA/rx-amqplib.git
$ cd rx-amqplib
$ npm install
$ gulp
```
