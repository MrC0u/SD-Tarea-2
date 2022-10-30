# Tarea 2 - Sistemas Distribuidos

Los archivos y codigos de este repositorio son utilizados en la Tarea 2 de Sistemas Distribuidos para el periodo 2022-02 de la Universidad Diego Portales.

## Docker Compose Run:

En arquitectura Linux los containers son iniciados a traves del comando:

```bash
docker-compose up --build --remove-orphans
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

## Topic Ventas

Puerto: ```4000```

### Ventas Totales:
```http://localhost:4000/ventas```\
Query tipo ```GET```

### Ventas Diarias:
```http://localhost:4000/ventasDiarias```\
Query tipo ```GET```


## Topic Coordenadas

Puerto: ```6000```

### Ubicaciones Carritos:
```http://localhost:6000/ubicaciones```\
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

[![Video](https://img.youtube.com/)](https://www.youtube.com/watch?v=mCdA4bJAGGk/)

# Participantes

Marcos Valderrama \
Daniel Salas
