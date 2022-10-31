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

let listaStock = []

let listaRestock = []

// Responses

app.get("/stockTotal",async (req, res) =>{
  
  console.log(listaStock)
  res.send(listaStock)  

})

app.get("/restock",async (req, res) =>{
  
  console.log(listaRestock)
  res.send(listaRestock)  

})

// Consumer

const consume = async () =>{

  console.log("Server Stock: Iniciando Kafka...")

  const consumer = kafka.consumer({
     groupId: 'group-stock',
     heartbeatInterval: 10000
    })
  await consumer.connect()
  await consumer.subscribe({ topic: 'topic-stock', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(" =~=~=~ o ~=~=~=")
      console.log(" Mensaje Recibido: ")

      // Procesamiento data

      const data = JSON.parse( message.value.toString() );

      // # Stock Found
      if( listaStock.some(item => item.nombre === data.nombre) ){

        console.log('- Ya Existe Vendedor ... Actualizando Stock -')
        

        // let pos = listaStock.indexOf(data.nombre)
        // Stock position find
        for(var i = 0; i < listaStock.length ; i++){
          if( listaStock[i].nombre === data.nombre){
              // Stock update
              listaStock[i].stock = data.stock
            
            // ## Restock found
            if (listaRestock.some(item => item.nombre === data.nombre) ){
              console.log('Restock Found')
              // Restock position find
              for(var j = 0; j < listaRestock.length ; j++){
                if(listaRestock[j].nombre === data.nombre){
                  // Restock Update
                  listaRestock[j].stock = data.stock

                  // Vendedor tiene stock mayor a 20 ( No necesita Restock )
                  if(parseInt(listaRestock[j].stock) >= 20){
                    console.log('pos: ', j)
                    listaRestock.splice(j,1)
                    
                  }

                }
                

              }

            // ## Restock Not Found
            }else{
              
              // Vendedor tiene un stock menor a 20 ( Necesita Restock )
              if(parseInt(listaStock[i].stock) < 20){
                listaRestock.push( listaStock[i] )
              }

            }
          }
        }
        

      // # Stock not found
      }else{
        console.log('- No Existe Vendedor ... Ingresando Stock -')

        let vendedor = {
          "nombre" : data.nombre,
          "stock": data.stock
        }

      if(data.stock < 20){
        listaRestock.push(vendedor)
      }

        listaStock.push(vendedor)
      }

     //console.log(vendedor.nombre)
    
      console.log("Stock Registrado")

      // Caso de Restock

      if(listaRestock.length > 0){
        console.log('Se necesita Restock de los siguientes maestros:', listaRestock)
      }

    },
  })
}

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(7000, ()=>{
  console.log('Server Stock open on port 7000')
  // Inicio Kafka
  consume().catch((err) => {
    console.error("error in consumer: ", err)
  })
})
