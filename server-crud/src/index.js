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
  const producer = kafka.producer({  })
  const admin = kafka.admin()
  await admin.connect()
  await producer.connect()
  // await admin.createTopics({
  //     waitForLeaders: true,
  //     topics: [
  //       { topic: 'nuevos-miembros2',
  //         numPartitions: 2 },
  //     ],
  // })
  
  if (req.query.premium == 1){
    console.log('Se manda premium')
    await producer.send({
      topic: 'nuevos-miembros',
      messages: [
        { value: JSON.stringify(req.query), partition: 1 },
      ],
    })
  }else if(req.query.premium == 0){
      console.log('Se manda NO premium')
      await producer.send({
        topic: 'nuevos-miembros',
        messages: [
          { value: JSON.stringify(req.query), partition: 0 },
        ],
      })
  }
  
  await producer.disconnect()
  await admin.disconnect()
  res.send({ value: JSON.stringify(req.query) })

  
})

// Response Registro Venta

app.post("/registroVenta",async (req, res) =>{
    const producer = kafka.producer({ })
    const admin = kafka.admin()
    await admin.connect()
    await producer.connect()


    // Creacion Topicos

//     await admin.createTopics({
//         waitForLeaders: true,
//         topics: [
//           { topic: 'topic-ventas' },
//         ],
//     })

//     await admin.createTopics({
//       waitForLeaders: true,
//       topics: [
//         { topic: 'topic-coordenadas', numPartitions: 2 },
//       ],
//   })

//   await admin.createTopics({
//     waitForLeaders: true,
//     topics: [
//       { topic: 'topic-stock', numPartitions: 2 },
//     ],
// })

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
        messages: [{ value: JSON.stringify( stock ), partition: 0 }],
      },
    )

    
    await producer.disconnect()
    await admin.disconnect()
    console.log('Venta enviada')
    res.send("Venta enviada")
})

// Response Profugo

app.post("/carroProfugo",async (req, res) =>{
  const { Partitioners } = require('kafkajs')
  const producer = kafka.producer({  })
  const admin = kafka.admin()
  await admin.connect()
  await producer.connect()
//   await admin.createTopics({
//     waitForLeaders: true,
//     topics: [
//       { topic: 'topic-coordenadas', numPartitions: 2 },
//     ],
// })

let ubicacion = {
  "nombre" : req.query.nombre,
  "ubicacion" : req.query.ubicacion,
}
  
await producer.send(
  {
    topic: 'topic-coordenadas',
    messages: [{ value: JSON.stringify( ubicacion ), partition: 1 }],
  },
)
  
  await producer.disconnect()
  await admin.disconnect()
  res.send({ value: JSON.stringify('Ubicacion Enviada') })
  console.log('Carro Profugo Enviado')

  
})

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(3000, ()=>{
    console.log('Crud Server open on port 3000')
})
