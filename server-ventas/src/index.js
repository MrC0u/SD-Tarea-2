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

    // # ListaDiaria Found 'Nombre'
    if( listaDiaria.some(item => item.nombre === vendedores[0].nombre) ){
      for(var i = 0; i < listaDiaria.length ; i++){
        if( listaDiaria[i].nombre === vendedores[0].nombre){
          
          listaDiaria[i].ventas_totales += 1

          // ## Clientes found 'Nombre'
          if( listaDiaria[i].clientes.some(item => item.nombre === vendedores[0].cliente) ){
            for(var j = 0; j < listaDiaria[i].clientes.length ; j++){
              if( listaDiaria[i].clientes[j].nombre === vendedores[0].cliente){

                let cliente = listaDiaria[i].clientes[j]
                
                cliente.ventas_cliente += 1
                cliente.cantidades.push( vendedores[0].cantidad )
                let sum = cliente.cantidades.reduce((a,b) => parseInt(a)+parseInt(b))
                cliente.promedio = (sum / parseInt(cliente.ventas_cliente) ).toFixed(1).toString()

              }
            }    
          // ## Clientes NOT found 'Nombre'
          }else{

            let cliente = {
              "nombre" : vendedores[0].cliente,
              "ventas_cliente": 1,
              "cantidades": [],
              "promedio": vendedores[0].cantidad
            }
            
            cliente.cantidades.push( vendedores[0].cantidad )
            
            listaDiaria[i].clientes.push( cliente )

          }

        }

      }
    
    // # listaDiaria NOT Found 'Nombre'
    }else{

      let vendedor = {
        "nombre" : vendedores[0].nombre,
        "ventas_totales": 1,
        "clientes": [],
        "clientes_totales": 1
      }

      let cliente = {
        "nombre" : vendedores[0].cliente,
        "ventas_cliente": 1,
        "cantidades": [],
        "promedio": vendedores[0].cantidad
      }

      cliente.cantidades.push( vendedores[0].cantidad )

      vendedor.clientes.push( cliente )

      listaDiaria.push( vendedor )

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
