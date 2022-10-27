const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Kafka

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

app.post("/registroVenta",async (req, res) =>{
    const producer = kafka.producer()
    const admin = kafka.admin()
    await admin.connect()
    await producer.connect()
    await admin.createTopics({
        waitForLeaders: true,
        topics: [
          { topic: 'topic-ventas' },
        ],
    })
    
    console.log(req.body)

    await producer.send({
      topic: 'topic-ventas',
      messages: [
        { value: JSON.stringify(req.query) },
      ],
    })
    await producer.disconnect()
    await admin.disconnect()
    res.send("Venta enviada")
})

// Responses

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(3000)
console.log('Crud Server open on port 3000')