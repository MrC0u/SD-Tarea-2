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

let listaUbicaciones = []

app.get("/ubicaciones",async (req, res) =>{
  
  console.log(listaUbicaciones)
  res.send(listaUbicaciones)  

})

const consume = async () =>{

  console.log("Server Ubicaciones: Iniciando Kafka...")

  const consumer = kafka.consumer({
     groupId: 'group-ubicaciones',
     heartbeatInterval: 5000
    })
  await consumer.connect()
  await consumer.subscribe({ topic: 'topic-coordenadas', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(" =~=~=~ o ~=~=~=")
      console.log(" Mensaje Recibido: ")

      const data = JSON.parse( message.value.toString() );

      let coords = data.ubicacion.split(',')

      console.log('Vendedor: ', data.nombre, 'Coordenadas: ( ' , coords[0] , ' , ' , coords[1] , ' )')

      // Vendedor ya registrado
      if( listaUbicaciones.some(item => item.nombre === data.nombre) ){

        console.log('- Ya Existe Vendedor ... Actualizando Coordenadas -')

        for(var i = 0; i < listaUbicaciones.length ; i++){
          if( listaUbicaciones[i].nombre === data.nombre){
            listaUbicaciones[i].coordenadas_x = coords[0]
            listaUbicaciones[i].coordenadas_y = coords[1]
          }
        }
        

      // Vendedor no registrado
      }else{
        console.log('- No Existe Vendedor ... Ingresando Coordenadas -')

        let vendedor = {
          "nombre" : data.nombre,
          "coordenadas_x": coords[0],
          "coordenadas_y": coords[1],
          "profugo" : false 
        }

        listaUbicaciones.push(vendedor)
      }

     //console.log(vendedor.nombre)
    
      console.log("Ubicacion Registrada")
      console.log('Cantidad lista: ', listaUbicaciones.length)

    },
  })
}

// Responses

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(6000, ()=>{
  console.log('Server Coordenadas open on port 6000')
  // Inicio Kafka
  consume().catch((err) => {
    console.error("error in consumer: ", err)
  })
})
