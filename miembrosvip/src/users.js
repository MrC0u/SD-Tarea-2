const express =require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());
port= 6969

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

let listaUsuarios = []

let listaVIP = []

app.get("/users",async (req, res) =>{
  vipazos = {
    "usuarios VIP": listaVIP
  }
  res.send(vipazos, " algo ", listaUsuarios)
})

const consume = async () =>{
    console.log("funca pls")
    const consumer = kafka.consumer({
       groupId: 'test-group',
       heartbeatInterval: 10000
      })
    await consumer.connect()
    await consumer.subscribe({ topic: 'nuevos-miembros', fromBeginning: true })
    variable = null
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let time = message.timestamp/1000;
        variable = message.value.toString()
        const credentials = JSON.parse(variable);
  
        let logUsr = {
          "nombre" : credentials.nombre,
          "apellido" : credentials.apellido,
          "rut": credentials.rut,
          "vip": credentials.premium
        }

        if(logUsr.vip==1){
            listaVIP.push(logUsr.nombre);
            console.log("gigachads",listaVIP)
        }
        else {
            listaUsuarios.push(logUsr.nombre);
            console.log("usuarios normales puaj", listaUsuarios)
        }  
      },
    })
  }
  
  app.get("/", function (req,res){
      res.send('wohooo')
  });
  app.listen(port, ()=>{
      console.log(`Express listening at http://localhost:${port}`)
      consume().catch((err) => {
        console.error("error in consumer: ", err)
      })
  })