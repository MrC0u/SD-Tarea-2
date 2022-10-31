# Tarea 2 - Sistemas Distribuidos

Los archivos y codigos de este repositorio son utilizados en la Tarea 2 de Sistemas Distribuidos para el periodo 2022-02 de la Universidad Diego Portales.

## Docker Compose Run:

En arquitectura Linux los containers son iniciados a traves del comando:

```bash
docker-compose up --build --remove-orphans
```

# Creacion Topics

Dentro de la carpeta del docker compose ejecutamos el siguiente comando para la creacion de topics:

```bash
docker-compose exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions <NUMERO-PARTICIONES> --config retention.ms=259200000 --topic <NOMBRE-TOPIC>
```

Los topics que se deben crear para el funcionamiento de los servidores de procesamiento son:\
```nuevos-miembros```\
```topic-stock```\
```topic-coordenadas```\
```topic-ventas```

Si queremos ver la lista de Topics junto con sus particiones ejecutamos el siguiente comando en la misma ruta:

```bash
sudo docker-compose exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe
```


# Request Servidores

Todos los servidores pueden probarse a traves del enlace ```http://localhost:< port >/```, ejemplo: ```http://localhost:3000/```.

## Cliente - Crud

Puerto: ```3000```

### Crear Venta:
```http://localhost:3000/registroVenta```\
Query tipo ```POST```\
Parametros:
```json
"nombre": <String>,
"cliente": <String>,
"cantidad": <Integer>,
"stock": <Integer>,
"ubicacion": <Integer>,<Integer>
```

### Crear Maestro:
```http://localhost:3000/registroMaestro```\
Query tipo ```POST```\
Parametros:
```json
"nombre": <String>,
"apellido": <String>,
"rut": <String>,
"correo": <String>,
"patente": <String>,
"premium": <0 to False, 1 to True>
```

### Notificar Carro Profugo:
```http://localhost:3000/carroProfugo```\
Query tipo ```POST```\
Parametros:
```json
"nombre": <String>,
"ubicacion": <Integer>,<Integer>
```

## Topic Ventas

Puerto: ```4000```

### Ventas Totales:
```http://localhost:4000/ventas```\
Query tipo ```GET```

### Ventas Diarias:
```http://localhost:4000/ventasDiarias```\
Query tipo ```GET```

## Topic Maestros Nuevos

Puerto: ```5000```

### Maestros No Premium:
```http://localhost:4000/users```\
Query tipo ```GET```

### Maestros Premium:
```http://localhost:4000/usersPremium```\
Query tipo ```GET```

## Topic Coordenadas

Puerto: ```6000```

### Ubicaciones Carritos:
```http://localhost:6000/ubicaciones```\
Query tipo ```GET```

### Carritos Profugos:
```http://localhost:6000/profugos```\
Query tipo ```GET```


## Topic Stock

Puerto: ```7000```

### All Stock List:
```http://localhost:7000/stockTotal```\
Query tipo ```GET```

### Restock Only List:
```http://localhost:7000/restock```\
Query tipo ```GET```


# Video

Video explicativo del funcionamiento:

[![Video](https://img.youtube.com/vi/hAee1h1ZbQc/0.jpg)](https://youtu.be/hAee1h1ZbQc/)

# Participantes

Marcos Valderrama \
Daniel Salas
