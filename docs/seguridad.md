# Seguridad del Sistema – KOINS

## 1. Introducción

La seguridad es un aspecto fundamental en cualquier sistema que maneje información sensible.  
En el caso de KOINS, el sistema gestiona datos financieros de los usuarios, por lo que se implementaron mecanismos de autenticación y control de acceso para proteger la información.

La arquitectura implementa un modelo de seguridad basado en **JSON Web Tokens (JWT)**, lo que permite proteger los endpoints del sistema y garantizar que únicamente usuarios autenticados puedan acceder a los recursos.

Además, el uso de un **API Gateway** permite centralizar el control de acceso y validar la autenticación antes de que las solicitudes lleguen a los microservicios.

---

# 2. Autenticación basada en JWT

KOINS utiliza **JSON Web Tokens (JWT)** como mecanismo principal de autenticación.

Un JWT es un token firmado digitalmente que contiene información sobre la identidad del usuario.  
Este token es generado después de que el usuario se autentica correctamente en el sistema.

El uso de JWT permite implementar un sistema **stateless**, donde el servidor no necesita almacenar sesiones activas.

### Ventajas del uso de JWT

- Autenticación segura mediante firma digital
- Eliminación de manejo de sesiones en el servidor
- Escalabilidad en arquitecturas de microservicios
- Validación rápida del token en cada solicitud

---

# 3. Flujo de Autenticación

El proceso de autenticación en KOINS sigue los siguientes pasos:

1. El usuario envía sus credenciales al endpoint de autenticación.
2. El **Microservicio de Usuarios** valida las credenciales.
3. Si las credenciales son correctas, el sistema genera un **JWT**.
4. El cliente recibe el token.
5. En cada solicitud posterior, el cliente envía el token en el encabezado HTTP.
6. El **API Gateway** valida el token antes de permitir el acceso a los microservicios.

Este flujo garantiza que únicamente usuarios autenticados puedan realizar operaciones dentro del sistema.

---

# 4. Endpoint de Autenticación

El proceso de autenticación inicia en el **Microservicio de Usuarios**.

### Endpoint principal
POST /login


Este endpoint recibe las credenciales del usuario y valida su existencia en el sistema.

### Ejemplo de solicitud

```json
{
  "email": "usuario@email.com",
  "password": "password123"
}
```

Si las credenciales son válidas, el sistema devuelve la información necesaria para autenticación y acceso a los servicios.

## 5. Validación de Usuarios

Además del proceso de autenticación, el sistema incluye un mecanismo para validar la existencia y estado de un usuario dentro del sistema.

Endpoint

GET /validate/:id

Este endpoint es utilizado principalmente por otros microservicios para verificar que un usuario exista y esté autorizado.

Ejemplo de respuesta
```
{
  "exists": true,
  "userId": 10,
  "status": "active",
  "full_name": "Juan Pérez"
}
```

Este mecanismo permite que otros servicios, como el **Microservicio de Transacciones,** validen usuarios antes de ejecutar operaciones.

## 6. Validación de Token en el API Gateway

El API Gateway actúa como punto central de control de seguridad del sistema.

Antes de redirigir una solicitud a los microservicios, el gateway verifica que el token JWT sea válido.

**Funciones del API Gateway en seguridad**
* Validar el token JWT.
* Verificar autenticación del usuario.
* Bloquear solicitudes no autorizadas.
* Redirigir solicitudes válidas a los microservicios correspondientes.

Este enfoque permite que los microservicios se concentren en la lógica de negocio mientras el gateway gestiona el control de acceso.

## 7. Protección de Endpoints

Los endpoints del sistema están protegidos mediante el uso de tokens JWT.

El cliente debe enviar el token en cada solicitud utilizando el encabezado HTTP **Authorization.**

**Ejemplo de encabezado**
Authorization: Bearer <token_jwt>

Si el token no es válido o está ausente, el sistema rechaza la solicitud.

Esto evita accesos no autorizados a los recursos del sistema.


## 8. Seguridad en la Comunicación entre Microservicios

La comunicación entre microservicios se realiza mediante APIs REST.

Para garantizar la integridad del sistema:

* Los microservicios validan las solicitudes recibidas.
* Se verifican los datos antes de ejecutar operaciones críticas.
* Las respuestas contienen únicamente la información necesaria.

Por ejemplo, cuando el Microservicio de Transacciones valida un usuario, el servicio de usuarios devuelve únicamente los datos requeridos para la operación.

Esto reduce la exposición innecesaria de información.

## 9. Beneficios del Modelo de Seguridad

La arquitectura de seguridad implementada ofrece varios beneficios:

**Protección de datos sensibles**

Los datos financieros de los usuarios se encuentran protegidos mediante autenticación segura.

**Control de acceso centralizado**

El API Gateway permite gestionar la autenticación en un único punto del sistema.

**Escalabilidad**

El uso de JWT permite que los microservicios escalen sin necesidad de gestionar sesiones.

Integración entre microservicios

Los servicios pueden validar usuarios de forma segura sin compartir bases de datos.

## 10. Conclusión

La arquitectura de seguridad de KOINS se basa en el uso de **JSON Web Tokens (JWT)** y en la centralización del control de acceso mediante un **API Gateway.**

Este enfoque permite construir un sistema seguro, escalable y adecuado para arquitecturas basadas en microservicios.

La validación de usuarios, la protección de endpoints y la autenticación stateless garantizan que únicamente usuarios autorizados puedan acceder a las funcionalidades del sistema.
