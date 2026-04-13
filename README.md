# KOINS - Finanzas Inteligentes & Sostenibles 🌿

KOINS es una plataforma diseñada para gestionar finanzas personales de forma inteligente, centralizando la información financiera de los usuarios y permitiendo analizar sus gastos de manera eficiente.

El sistema está construido utilizando una **arquitectura basada en microservicios**, lo que permite escalar el sistema, desacoplar responsabilidades y mejorar la resiliencia y observabilidad del backend.

---

# 1. Propuesta de Valor

En un mundo digital, muchas personas pierden el control de sus finanzas debido al desorden en sus registros de gastos.

KOINS busca solucionar este problema mediante:

- **Centralización financiera:** todos los registros de transacciones en un solo lugar.
- **Digitalización:** reducción del uso de papel mediante almacenamiento digital.
- **Análisis de gastos:** estructura preparada para incorporar inteligencia artificial en análisis financieros.
- **Arquitectura escalable:** backend basado en microservicios que permite crecimiento del sistema.

---

# 2. Arquitectura del Sistema

El sistema utiliza una **arquitectura de microservicios**, donde cada servicio es responsable de un dominio específico del negocio.

Los microservicios se comunican mediante **APIs REST**, permitiendo independencia entre servicios y facilitando el despliegue y mantenimiento.

### Componentes principales

- **API Gateway**
- **Microservicio de Usuarios**
- **Microservicio de Transacciones**
- **Base de datos Supabase**
- **Sistema de observabilidad con Prometheus y Grafana**

Esta arquitectura permite:

- Bajo acoplamiento entre servicios
- Escalabilidad horizontal
- Mayor resiliencia ante fallos
- Mejor mantenibilidad del código

---

# 3. Microservicios del Sistema

## Microservicio de Usuarios

Responsable de gestionar la información de los usuarios y su autenticación.

### Responsabilidades

- Autenticación de usuarios
- Validación de usuarios
- Gestión de credenciales
- Acceso a base de datos mediante repositorio desacoplado

### Endpoints principales

POST /login
GET /validate/:id


Este microservicio utiliza **Supabase** como base de datos.

---

## Microservicio de Transacciones

Responsable de gestionar las transacciones financieras de los usuarios.

### Responsabilidades

- Registro de nuevas transacciones
- Consulta de transacciones
- Validación de usuarios antes de registrar operaciones
- Comunicación con el microservicio de usuarios

### Endpoints principales
POST /transactions
GET /transactions


Este servicio actúa como **consumidor del microservicio de usuarios**.

---

# 4. Seguridad

El sistema implementa autenticación mediante **JSON Web Tokens (JWT)**.

### Flujo de autenticación

1. El usuario envía sus credenciales al endpoint `/login`.
2. El microservicio de usuarios valida las credenciales.
3. Si son correctas, se genera un **JWT**.
4. El cliente envía el token en cada solicitud.
5. El **API Gateway valida el token** antes de permitir el acceso a los microservicios.

Esto permite implementar un sistema **stateless y escalable**.

---

# 5. Resiliencia

Para mejorar la robustez del sistema se implementaron mecanismos de resiliencia en el microservicio de transacciones.

### Retry automático

Se utiliza la librería **axios-retry** para reintentar solicitudes cuando ocurre un fallo en la comunicación con el microservicio de usuarios.

Configuración:

- máximo **3 reintentos**
- delay entre intentos
- reintento ante errores de red o errores **HTTP 5xx**

### Timeout

Las llamadas entre microservicios incluyen un **timeout** para evitar bloqueos cuando un servicio no responde.

Ejemplo:
timeout: 2000 ms


### Fallback

Cuando ocurre un fallo en la consulta de información de usuario, el sistema devuelve una respuesta alternativa.

Ejemplo:
nombre_usuario: "Nombre no disponible"


Esto permite mantener la funcionalidad del sistema incluso cuando un servicio falla.

---

# 6. Observabilidad

El sistema implementa monitoreo mediante **Prometheus y Grafana**.

Cada microservicio expone el endpoint:
/metrics


Prometheus recolecta estas métricas y Grafana las visualiza mediante dashboards.

### Métrica principal implementada

http_requests_total


Esta métrica registra:

- método HTTP
- endpoint
- código de respuesta

Esto permite analizar el comportamiento del sistema en tiempo real.

---

# 7. Patrones de Diseño Utilizados

Durante el desarrollo se implementaron varios patrones de diseño para mejorar la arquitectura.

### Repository Pattern

Se utiliza en el microservicio de usuarios para desacoplar la lógica de negocio del acceso a la base de datos.

Esto permite cambiar la tecnología de almacenamiento sin modificar la lógica del servicio.

### Factory Pattern

Se utiliza para crear instancias de repositorios sin depender directamente de una implementación específica.

Esto reduce el acoplamiento con Supabase.

---

# 8. Stack Tecnológico

### Backend

- Node.js
- Express

### Comunicación

- REST APIs
- Axios

### Resiliencia

- axios-retry

### Base de datos

- Supabase

### Observabilidad

- Prometheus
- Grafana
- prom-client

---

# 9. Atributos de Calidad

La arquitectura del sistema permite cumplir con varios atributos de calidad importantes.

### Escalabilidad

Los microservicios pueden escalar de forma independiente según la carga.

### Resiliencia

El sistema implementa retry, timeout y fallback para tolerar fallos entre servicios.

### Seguridad

El uso de JWT protege los endpoints del sistema.

### Observabilidad

El sistema puede ser monitoreado mediante Prometheus y Grafana.

### Mantenibilidad

El uso de principios SOLID y patrones de diseño facilita la evolución del sistema.

---

# 10. Ejecución del Proyecto

### Instalar dependencias

npm install


### Ejecutar microservicio de usuarios


node usuarios-service.js


### Ejecutar microservicio de transacciones


node transacciones-service.js


Cada microservicio se ejecuta en su propio puerto.

---

# 11. Conclusión

KOINS demuestra la implementación de una arquitectura moderna basada en microservicios que integra seguridad, resiliencia y observabilidad.

El uso de JWT para autenticación, la comunicación mediante APIs REST y el monitoreo con Prometheus y Grafana permiten construir un sistema robusto, escalable y preparado para evolucionar en el futuro.
