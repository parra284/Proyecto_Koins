# Resiliencia del Sistema – KOINS

## 1. Introducción

La resiliencia es la capacidad de un sistema para continuar operando incluso cuando ocurren fallos en alguno de sus componentes.  
En una arquitectura basada en microservicios, este aspecto es especialmente importante, ya que los servicios dependen de la comunicación entre sí.

En KOINS se implementaron varios mecanismos de resiliencia para evitar que la falla de un microservicio afecte completamente el funcionamiento del sistema.

Las estrategias implementadas incluyen:

- Retry automático
- Timeout en llamadas entre servicios
- Fallback para degradación controlada del servicio

Estas técnicas permiten mejorar la disponibilidad y estabilidad del sistema.

---

# 2. Retry Automático

El microservicio de **Transacciones** implementa un mecanismo de reintento automático utilizando la librería `axios-retry`.

Este mecanismo permite reintentar solicitudes HTTP cuando ocurre un fallo temporal en la comunicación con otro microservicio.

### Configuración aplicada

- Máximo **3 reintentos**
- **Delay entre intentos**
- Reintentos ante:
  - errores de red
  - errores HTTP **5xx**

### Implementación

```javascript
axiosRetry(axios, { 
    retries: 3, 
    shouldResetTimeout: true, 
    retryDelay: (retryCount) => {
        console.log(`⚠️ Fallo detectado. Intento de recuperación #${retryCount}...`);
        return 2000;
    },
    retryCondition: (error) => {
        return !error.response || error.response.status >= 500;
    }
});****
```
Gracias a esta estrategia, el sistema puede recuperarse automáticamente ante fallos temporales sin afectar inmediatamente al usuario.

## 3. Timeout en Comunicación entre Servicios

Para evitar bloqueos en el sistema cuando un servicio no responde, se implementaron timeouts en las llamadas HTTP entre microservicios.

Esto permite que el sistema detecte rápidamente cuando un servicio externo no está disponible.

Ejemplo de implementación
```javascript
const response = await axios.get(`${USUARIOS_MS_URL}/validate/${userId}`, {
    timeout: 2000
});
```

En este caso:

* Si el Microservicio de Usuarios no responde en 2 segundos, la solicitud se cancela.
* El sistema activa el mecanismo de retry o el manejo de errores correspondiente.

Esto evita que una llamada lenta bloquee el flujo completo de la aplicación.

## 5. Manejo de Fallos Críticos

Cuando la comunicación con el microservicio de usuarios falla incluso después de los reintentos, el sistema devuelve un error controlado.

Ejemplo
```javascript
res.status(503).json({ 
  error: 'Servicio de validación no disponible', 
  detail: 'Se intentó conectar con el servicio de usuarios 3 veces sin éxito.' 
});
```
El código 503 Service Unavailable indica que el servicio dependiente no está disponible temporalmente.

Esto permite a los clientes del sistema manejar correctamente la situación.

## 6. Beneficios de la Estrategia de Resiliencia

La implementación de estas técnicas aporta varios beneficios al sistema:

**Mayor disponibilidad**

El sistema puede continuar operando incluso cuando algunos servicios presentan fallos temporales.

**Mejor experiencia de usuario**

El uso de fallback evita interrupciones completas del servicio.

**Recuperación automática**

El mecanismo de retry permite resolver fallos transitorios sin intervención manual.

**Control de latencia**

Los timeouts evitan bloqueos prolongados en el flujo de procesamiento.

## 7. Conclusión

La resiliencia es un componente fundamental en arquitecturas basadas en microservicios.

En KOINS se implementaron mecanismos como **retry automático, timeouts y fallback,** los cuales permiten que el sistema sea más robusto frente a fallos en la comunicación entre servicios.

Gracias a estas estrategias, la plataforma puede mantener su funcionamiento incluso en escenarios donde uno de los microservicios presenta problemas temporales, garantizando así mayor estabilidad y confiabilidad del sistema.
