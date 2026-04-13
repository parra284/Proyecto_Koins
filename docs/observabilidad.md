# Observabilidad del Sistema – KOINS

## 1. Introducción

La observabilidad es un componente fundamental en arquitecturas modernas basadas en microservicios. Permite monitorear el comportamiento del sistema en tiempo real, identificar fallos, analizar el rendimiento y comprender cómo interactúan los distintos componentes del sistema.

En el proyecto **KOINS**, la observabilidad se implementa mediante el uso de **Prometheus** para la recolección de métricas y **Grafana** para la visualización de dichas métricas a través de paneles interactivos.

Este enfoque permite detectar anomalías, analizar el tráfico del sistema y facilitar tareas de diagnóstico y mantenimiento.

---

## 2. Objetivos de la Observabilidad

La implementación de observabilidad en el sistema KOINS tiene como objetivos principales:

- Monitorear el tráfico de solicitudes hacia los microservicios.
- Analizar el comportamiento de los endpoints del sistema.
- Detectar errores o fallos en los servicios.
- Evaluar el rendimiento de los microservicios.
- Facilitar la toma de decisiones basada en datos operativos del sistema.

---

## 3. Herramientas Utilizadas

La solución de observabilidad se construyó utilizando dos herramientas ampliamente adoptadas en arquitecturas de microservicios.

### Prometheus

**Prometheus** es un sistema de monitoreo y recolección de métricas de código abierto. Se encarga de consultar periódicamente los endpoints de métricas de cada microservicio y almacenar dicha información para su posterior análisis.

Entre sus características principales se encuentran:

- Recolección automática de métricas.
- Almacenamiento eficiente de series temporales.
- Integración con múltiples sistemas de monitoreo.
- Capacidad de generar alertas basadas en reglas.

En el sistema KOINS, Prometheus consulta periódicamente el endpoint `/metrics` expuesto por cada microservicio.

---

### Grafana

**Grafana** es una plataforma de visualización de datos que permite construir dashboards interactivos basados en métricas recolectadas por Prometheus.

En el proyecto KOINS, Grafana se utiliza para:

- Visualizar el tráfico de peticiones al sistema.
- Analizar el comportamiento de los endpoints.
- Monitorear códigos de respuesta HTTP.
- Identificar posibles anomalías en el sistema.

Los dashboards permiten obtener una visión clara del estado del sistema en tiempo real.

---

## 4. Instrumentación de los Microservicios

Para habilitar la observabilidad, cada microservicio del sistema fue instrumentado utilizando la librería **prom-client** en Node.js.

Esta librería permite registrar métricas personalizadas y exponerlas mediante un endpoint que puede ser consultado por Prometheus.

Cada microservicio expone el siguiente endpoint:
/metrics


Este endpoint devuelve las métricas del servicio en un formato compatible con Prometheus.

---

## 5. Métricas Implementadas

Una de las métricas principales implementadas en el sistema es:
http_requests_total


Esta métrica cuenta el número total de solicitudes HTTP recibidas por los microservicios.

La métrica registra tres etiquetas principales:

- **method**: método HTTP utilizado (GET, POST, etc.).
- **route**: endpoint al que se realizó la solicitud.
- **status**: código de respuesta HTTP.

Gracias a estas etiquetas es posible analizar el comportamiento del sistema desde diferentes perspectivas.

---

## 6. Recolección de Métricas

El flujo de recolección de métricas funciona de la siguiente manera:

1. Cada microservicio expone su endpoint `/metrics`.
2. **Prometheus** consulta periódicamente estos endpoints.
3. Las métricas recolectadas se almacenan como series temporales.
4. **Grafana** consulta a Prometheus para visualizar los datos en dashboards.

Este proceso permite mantener un monitoreo continuo del sistema.

---

## 7. Visualización en Grafana

Los dashboards de Grafana permiten visualizar métricas importantes como:

- Número total de solicitudes HTTP.
- Distribución de códigos de respuesta (200, 404, 500).
- Uso de endpoints del sistema.
- Comportamiento del tráfico a lo largo del tiempo.

Estas visualizaciones facilitan la detección de patrones anómalos o picos de tráfico que podrían indicar problemas en el sistema.

---

## 8. Beneficios de la Observabilidad en KOINS

La implementación de observabilidad aporta múltiples beneficios al sistema:

### Monitoreo en tiempo real

Permite conocer el estado actual del sistema y detectar fallos rápidamente.

### Diagnóstico de errores

Las métricas registradas permiten identificar qué endpoints generan errores y en qué condiciones.

### Análisis del rendimiento

Es posible analizar cómo se comporta el sistema bajo diferentes niveles de carga.

### Mejora continua

La información obtenida mediante las métricas permite realizar mejoras informadas en la arquitectura y el rendimiento del sistema.

---

## 9. Conclusión

La implementación de observabilidad mediante **Prometheus y Grafana** permite monitorear el comportamiento del sistema KOINS de forma eficiente.

Gracias a la instrumentación de los microservicios y la visualización de métricas en dashboards interactivos, es posible analizar el tráfico del sistema, detectar fallos y mejorar el rendimiento general de la plataforma.

Este enfoque fortalece la confiabilidad del sistema y facilita su mantenimiento y evolución en el tiempo.
