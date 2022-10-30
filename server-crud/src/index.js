const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Kafka

const { Kafka } = require('kafkajs')
const { Partitioners } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

// Response Registro Usuario

app.post("/registroMaestro",async (req, res) =>{
  const producer = kafka.producer()
  const admin = kafka.admin()
  await admin.connect()
  await producer.connect()
  await admin.createTopics({
      waitForLeaders: true,
      topics: [
        { topic: 'nuevos-miembros' },
      ],
  })
  
  await producer.send({
    topic: 'nuevos-miembros',
    messages: [
      { value: JSON.stringify(req.query) },
    ],
  })
  await producer.disconnect()
  await admin.disconnect()
  res.send({ value: JSON.stringify(req.query) })
})

// Response Registro Venta

app.post("/registroVenta",async (req, res) =>{
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    const admin = kafka.admin()
    await admin.connect()
    await producer.connect()


    // Creacion Topicos

    await admin.createTopics({
        waitForLeaders: true,
        topics: [
          { topic: 'topic-ventas' },
        ],
    })

    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        { topic: 'topic-coordenadas' },
      ],
  })

  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: 'topic-stock' },
    ],
})

  // Mensajes Productor

    console.log('Registro de Venta Recibido')
    console.log(req.query)
    
    let venta = {
        "nombre" : req.query.nombre,
        "cliente": req.query.cliente,
        "cantidad": req.query.cantidad
      }

    let ubicacion = {
        "nombre" : req.query.nombre,
        "ubicacion" : req.query.ubicacion,
    }

    let stock = {
      "nombre" : req.query.nombre,
      "stock" : req.query.stock,
  }

    await producer.send(
      {
        topic: 'topic-ventas',
        messages: [{ value: JSON.stringify( venta ) }],
      },
    )

    await producer.send(
        {
          topic: 'topic-coordenadas',
          messages: [{ value: JSON.stringify( ubicacion ) }],
        },
      )

    await producer.send(
      {
        topic: 'topic-stock',
        messages: [{ value: JSON.stringify( stock ) }],
      },
    )

    
    await producer.disconnect()
    await admin.disconnect()
    console.log('Venta enviada')
    res.send("Venta enviada")
})

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(3000, ()=>{
    console.log('Crud Server open on port 3000')
})
