# Arquitectura del Sistema – KOINS

## 1. Introducción

KOINS es una plataforma orientada a la gestión de finanzas personales de forma inteligente y sostenible. La arquitectura del sistema ha sido diseñada siguiendo principios modernos de **arquitectura basada en microservicios**, con el propósito de garantizar atributos de calidad fundamentales como **escalabilidad, resiliencia, seguridad y observabilidad**.

El sistema permite a los usuarios registrar y consultar sus transacciones financieras mientras el backend procesa la información mediante servicios desacoplados que interactúan a través de **APIs REST**. Este enfoque facilita la evolución del sistema, permitiendo la integración de nuevos servicios y funcionalidades sin afectar los componentes existentes.

---

## 2. Estilo Arquitectónico

El sistema adopta un **estilo arquitectónico basado en microservicios**, donde cada servicio es responsable de un dominio específico dentro del sistema. Este enfoque permite dividir la lógica de negocio en componentes independientes que pueden evolucionar y desplegarse de manera autónoma.

La comunicación entre los microservicios se realiza mediante **HTTP y APIs REST**, lo que garantiza interoperabilidad y facilita la integración entre servicios.

### Características principales del estilo arquitectónico

- Separación clara de responsabilidades entre servicios.
- Independencia en el despliegue de cada microservicio.
- Escalabilidad horizontal del sistema.
- Bajo acoplamiento entre componentes.

---

## 3. Componentes Principales

La arquitectura del sistema está compuesta por los siguientes componentes principales.

### API Gateway

El **API Gateway** actúa como el punto de entrada único para todas las solicitudes provenientes del cliente.

#### Responsabilidades

- Centralizar todas las solicitudes externas hacia el sistema.
- Validar la autenticación de los usuarios mediante **JSON Web Tokens (JWT)**.
- Redirigir las peticiones hacia los microservicios correspondientes.

Este componente permite simplificar el acceso a los servicios internos del sistema y proporciona una capa adicional de seguridad y control.

---

### Microservicio de Usuarios

El **Microservicio de Usuarios** es responsable de gestionar toda la lógica relacionada con la autenticación y validación de usuarios dentro del sistema.

#### Responsabilidades

- Autenticación de usuarios.
- Validación de identidad de los usuarios.
- Gestión de credenciales.

#### Endpoints principales

- `POST /login`
- `GET /validate/:id`

Este microservicio accede a la información de los usuarios a través de un **repositorio desacoplado**, el cual interactúa con la base de datos proporcionada por **Supabase**.

---

### Microservicio de Transacciones

El **Microservicio de Transacciones** gestiona las operaciones relacionadas con las transacciones financieras registradas por los usuarios.

#### Responsabilidades

- Registrar nuevas transacciones.
- Validar la existencia y estado del usuario antes de registrar una transacción.
- Enriquecer la información de las transacciones con datos del usuario.

#### Endpoints principales

- `POST /transactions`
- `GET /transactions`

Este microservicio actúa como **consumidor del Microservicio de Usuarios**, solicitando validación del usuario antes de permitir el registro de una transacción.

---

## 4. Base de Datos

La arquitectura implementa el principio **Database per Microservice**, en el cual cada microservicio gestiona su propia base de datos de forma independiente.

Este enfoque evita dependencias directas entre servicios y permite que cada microservicio mantenga su propio modelo de datos.

### Implementación actual

- **Microservicio de Usuarios:** utiliza **Supabase** como base de datos.
- **Microservicio de Transacciones:** mantiene un almacenamiento propio de las transacciones en memoria con fines académicos.

La interacción entre servicios se realiza exclusivamente mediante **APIs REST**, evitando accesos directos entre bases de datos.

---

## 5. Seguridad

El sistema implementa un mecanismo de autenticación basado en **JSON Web Tokens (JWT)**, lo que permite gestionar la seguridad de forma **stateless**.

### Flujo de autenticación

1. El usuario envía sus credenciales al endpoint `/login`.
2. El microservicio de usuarios valida las credenciales.
3. Si las credenciales son correctas, se genera un **JWT**.
4. El cliente incluye el token en las solicitudes posteriores.
5. El **API Gateway** valida el token antes de permitir el acceso a los microservicios.

Este mecanismo garantiza que solo usuarios autenticados puedan acceder a los recursos del sistema.

---

## 6. Comunicación entre Microservicios

La comunicación entre microservicios se realiza mediante **APIs REST**, permitiendo un intercambio de información desacoplado y controlado.

### Ejemplo de flujo

1. El cliente solicita la creación de una nueva transacción.
2. El **API Gateway** redirige la solicitud al **Microservicio de Transacciones**.
3. El Microservicio de Transacciones consulta al **Microservicio de Usuarios** para validar la existencia y estado del usuario.
4. Si el usuario es válido, se registra la transacción en el sistema.

Este mecanismo permite mantener la independencia entre los servicios mientras se garantiza la coherencia de la información.

---

## 7. Resiliencia

Con el objetivo de mejorar la robustez del sistema frente a fallos, se implementaron diferentes mecanismos de **resiliencia** en el Microservicio de Transacciones.

### Retry automático

Se utiliza la librería `axios-retry` para reintentar solicitudes cuando ocurre un fallo en la comunicación con el Microservicio de Usuarios.

#### Configuración

- máximo **3 reintentos**
- delay entre intentos
- reintento ante errores de red o errores **5xx**

### Timeout

Las llamadas entre microservicios incluyen un **timeout** para evitar bloqueos del sistema en caso de que un servicio no responda dentro de un tiempo razonable.

Ejemplo:
timeout: 2000 ms


### Fallback

En algunos endpoints se implementa un **fallback** para evitar fallos totales del sistema.

Por ejemplo, si falla la consulta al Microservicio de Usuarios al consultar transacciones, el sistema devuelve:

nombre_usuario: "Nombre no disponible"


Esto permite mantener la disponibilidad del sistema incluso ante fallos parciales.

---

## 8. Observabilidad

La arquitectura incorpora herramientas de **observabilidad** mediante la integración de **Prometheus** y **Grafana**.

Cada microservicio expone un endpoint de métricas:

**Prometheus** recolecta estas métricas y **Grafana** permite visualizarlas mediante dashboards.

### Métrica principal implementada
http_requests_total


Esta métrica registra:

- método HTTP
- endpoint solicitado
- código de respuesta

Esto permite monitorear el comportamiento del sistema en tiempo real y detectar posibles problemas de rendimiento o disponibilidad.

---

## 9. Patrones de Diseño Utilizados

Durante el desarrollo del sistema se aplicaron distintos **patrones de diseño** con el objetivo de mejorar la modularidad y mantenibilidad del código.

### Repository Pattern

Este patrón se utiliza en el Microservicio de Usuarios para abstraer el acceso a los datos.

De esta manera, la lógica de negocio queda desacoplada de la implementación específica de la base de datos.

### Factory Pattern

El **Factory Pattern** se utiliza para crear instancias del repositorio de usuarios sin depender directamente de una implementación concreta.

Esto permite reemplazar o modificar la fuente de datos en el futuro sin afectar el resto del sistema.

---

## 10. Atributos de Calidad

La arquitectura del sistema permite satisfacer diversos atributos de calidad importantes.

### Escalabilidad

Los microservicios pueden escalar de forma independiente según la demanda del sistema.

### Resiliencia

La implementación de mecanismos como **retry, timeout y fallback** permite que el sistema tolere fallos en servicios dependientes.

### Seguridad

La autenticación mediante **JWT** protege los endpoints y garantiza que solo usuarios autorizados puedan acceder a los servicios.

### Observabilidad

La integración con **Prometheus y Grafana** permite monitorear el comportamiento del sistema.

### Mantenibilidad

El uso de principios **SOLID** y patrones de diseño facilita la evolución del sistema y la incorporación de nuevas funcionalidades.

---

## 11. Conclusión

La arquitectura implementada en **KOINS** permite construir un sistema **modular, resiliente y escalable**.

La adopción de un enfoque basado en **microservicios**, junto con mecanismos de **autenticación mediante JWT**, estrategias de **resiliencia** y herramientas de **observabilidad**, proporciona una base sólida para el crecimiento y evolución futura del sistema.
