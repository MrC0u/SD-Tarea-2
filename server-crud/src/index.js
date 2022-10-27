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
    console.log('Registro de Venta Recibido')
    console.log(req.query)
    
    let venta = {
        "nombre" : req.query.nombre,
        "cliente": req.query.client,
        "cantidad": req.query.cantidad
      }

    await producer.send({
      topic: 'topic-ventas',
      messages: [
        { value: JSON.stringify( venta ) },
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

app.listen(3000, ()=>{
    console.log('Crud Server open on port 3000')
})
