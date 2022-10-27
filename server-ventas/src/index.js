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

let listaVentas = []

app.get("/ventasDiarias",async (req, res) =>{
  
  console.log(listaVentas)
  res.send(listaVentas)  

})

const consume = async () =>{

  console.log("Server Ventas: Iniciando Kafka...")

  const consumer = kafka.consumer({
     groupId: 'group-ventas',
     heartbeatInterval: 5000
    })
  await consumer.connect()
  await consumer.subscribe({ topic: 'topic-ventas', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(" =~=~=~ o ~=~=~=")
      console.log(" Mensaje Recibido: ")
      let time = message.timestamp/1000;
      const data = JSON.parse( message.value.toString() );

      console.log('Vendedor: ', data.nombre)

      // Vendedor ya registrado
      if( listaVentas.some(item => item.nombre === data.nombre) ){

        console.log('- Ya Existe Vendedor ... Actualizando -')

        for(var i = 0; i < listaVentas.length ; i++){
          if( listaVentas[i].nombre === data.nombre){
            listaVentas[i].ventas_totales+= 1
          }
        }
        

      // Vendedor no registrado
      }else{
        console.log('- No Existe Vendedor ... Ingresando -')

        let vendedor = {
          "nombre" : data.nombre,
          "ventas_cliente": [],
          "promedio_ventas_cliente" : [],
          "clientes_totales": 0,
          "ventas_totales": 1
        }

        listaVentas.push(vendedor)
      }

     //console.log(vendedor.nombre)
    
      console.log("Venta Registrada")
      console.log('Cantidad lista: ', listaVentas.length)

    },
  })
}

// Responses

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(4000, ()=>{
  console.log('Server Ventas open on port 4000')
  // Inicio Kafka
  consume().catch((err) => {
    console.error("error in consumer: ", err)
  })
})
