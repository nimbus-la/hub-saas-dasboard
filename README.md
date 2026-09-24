# Hub SaaS Dashboard

Este es el panel de administración del Hub. Desde aquí un negocio gestiona su catálogo de productos, las recetas e insumos con los que se preparan, los precios de cada sucursal, la caja y un tablero con el resumen de ventas.

Está construido con Next.js 16, React 19 y Tailwind CSS 4. Por ahora solo las categorías de producto se leen del backend. El resto de pantallas usa datos de ejemplo que se irán reemplazando por los reales a medida que el backend los ofrezca.

## Antes de empezar

Necesitas Node.js y pnpm instalados. El proyecto usa pnpm como gestor de paquetes, así que conviene no mezclarlo con npm ni con yarn.

Instala las dependencias con este comando:

```bash
pnpm install
```

Luego crea tu archivo de variables de entorno copiando la plantilla que viene en el repositorio:

```bash
cp .env.exam .env
```

La plantilla explica cada variable, pero en resumen son estas:

```bash
# Dirección del backend. La usan tanto el navegador como el servidor.
NEXT_PUBLIC_API_URL=http://localhost:8000

# Token de pruebas con el que se firman las peticiones mientras no exista
# el inicio de sesión real. Sin él, el backend rechaza todas las peticiones.
NEXT_PUBLIC_API_ACCESS_TOKEN=

# Dominio desde el que se sirven las fotos de producto. Si lo dejas vacío,
# las tarjetas muestran las iniciales del producto en lugar de la foto.
NEXT_PUBLIC_PRODUCT_IMAGES_ORIGIN=
```

Hay una cuarta variable, API_INTERNAL_URL, que solo tiene sentido en producción y que en local puedes ignorar.

Ten en cuenta que Next.js lee estas variables al arrancar. Si cambias alguna mientras el servidor está encendido, tendrás que reiniciarlo para que el cambio se note.

## Cómo levantar el proyecto

Para trabajar en local, arranca el servidor de desarrollo:

```bash
pnpm dev
```

Después abre http://localhost:3000 en el navegador. La página se actualiza sola cada vez que guardas un cambio.

Estos son los demás comandos que vas a usar:

```bash
pnpm build       # genera la versión de producción
pnpm start       # sirve la versión que generó build
pnpm lint        # revisa el estilo del código
pnpm typecheck   # revisa los tipos de TypeScript
```

El proyecto todavía no tiene pruebas automáticas. Antes de dar un cambio por terminado, pasa lint y typecheck. La configuración de TypeScript es bastante estricta y suele atrapar errores que a simple vista pasan desapercibidos.

## Documentación

Toda la documentación del proyecto está en la carpeta docs. Vale la pena leerla antes de tocar la interfaz, porque ahí se explican las reglas que mantienen el diseño coherente entre pantallas.

Si es tu primera vez en el proyecto, empieza por la [guía rápida](./docs/README.md). Resume el sistema en una sola página y cuenta en qué estado está cada módulo.

Cuando necesites más detalle, estos son los demás documentos:

1. [Arquitectura](./docs/architecture.md) explica cómo está organizado el código y en qué carpeta va cada archivo nuevo.
2. [Valores de diseño](./docs/design-tokens.md) reúne los colores, tamaños, espacios, tipografías e iconos disponibles.
3. [Tailwind](./docs/tailwind.md) cuenta cómo está configurado y qué errores conviene no repetir.
4. [Componentes](./docs/components.md) enseña a construir un componente nuevo siguiendo el sistema.
5. [Textos](./docs/messages.md) indica dónde se guarda cada texto que aparece en pantalla.
6. [Conexión con el backend](./docs/http.md) describe cómo se hacen las peticiones, cómo se muestran los avisos al usuario y qué pasos seguir para conectar una pantalla nueva.
