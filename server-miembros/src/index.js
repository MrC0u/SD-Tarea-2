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

let listaUsuarios = []

let listaVIP = []

// Responses
app.get("/users",async (req, res) =>{
  vipazos = {
    "usuarios No Premium": listaUsuarios
  }
  res.send(vipazos)
})

app.get("/usersPremium",async (req, res) =>{
  vipazos = {
    "usuarios Premium": listaVIP
  }
  res.send(vipazos)
})

// Procesamiento Kafka

const consume = async () =>{

    const consumer = kafka.consumer({
       groupId: 'group-miembros',
       heartbeatInterval: 5000
      })

    await consumer.connect()
    await consumer.subscribe({ topic: 'nuevos-miembros', fromBeginning: true })
    variable = null
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Maestro Recibido')

        variable = message.value.toString()
        
        const data = JSON.parse( variable );

        let User = {
          "nombre" : data.nombre,
          "apellido" : data.apellido,
          "rut": data.rut,
          "correo": data.correo,
          "patente": data.patente
        }

        if(partition == 0){
          if( ! listaVIP.some(item => item.rut === data.rut) ){
            listaVIP.push(User);
            console.log("Premiums: ",listaVIP)
          }else{
            console.log('Maestro Ya existe')
          }
        }
        else {
          if( ! listaUsuarios.some(item => item.rut === data.rut) ){
            listaUsuarios.push(User);
            console.log("No Premiums: ", listaUsuarios)
          }else{
            console.log('Maestro Ya existe')
          }
        }  
      },
    })
  }


// Responses

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(5000, ()=>{
  console.log('Server Miembros open on port 5000')
  // Inicio Kafka
  consume().catch((err) => {
    console.error("error in consumer: ", err)
  })
})
