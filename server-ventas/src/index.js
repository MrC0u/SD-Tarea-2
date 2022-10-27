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

// Responses

app.get("/ventas",async (req, res) =>{
  
  console.log(listaVentas)
  res.send(listaVentas)  

})

app.get("/ventasDiarias",async (req, res) =>{
  
  let listaDiaria = []

  let vendedores = [...listaVentas]

  while(vendedores.length > 0){

    // ListaDiaria Found Nombre
    if( listaDiaria.some(item => item.nombre === vendedores[0].nombre) ){

      for(var i = 0; i < listaRestock.length ; i++){

      }
    
    }else{

      let vendedor = {
        "nombre" : data.nombre,
        "ventas_totales": 1,
        "promedio_clientes": [],
        "clientes_totales": 1
      }

      let cliente = {
        "nombre" : data.cliente,
        "ventas_totales": 1,
        "cantidad_venta": [],
      }

      vendedor.promedio_clientes.push()
    }

    vendedores.shift()
  }

 console.log(listaDiaria)
 res.send(listaDiaria)    

})


//Consumer

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
      console.log(time)

      const data = JSON.parse( message.value.toString() );

      console.log('Vendedor: ', data.nombre)
      console.log('Cliente: ', data.cliente)

      // Ingreso de Venta

      console.log('- Ingresando Venta... -')

      let vendedor = {
        "nombre" : data.nombre,
        "cliente": data.cliente,
        "cantidad" : data.cantidad,
      }

      listaVentas.push(vendedor)


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
