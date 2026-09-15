# Documentación

Todo lo escrito del proyecto vive aquí. No hay `README.md` sueltos por
carpetas: si algo necesita explicación y no cabe en un comentario, se escribe
en este directorio.

## Índice

| Documento | Qué responde |
|---|---|
| [`architecture.md`](./architecture.md) | Cómo se organiza el código: qué es un feature, qué significa cada carpeta y dónde va un archivo nuevo |
| [`design-tokens.md`](./design-tokens.md) | Qué valores existen y cómo se llaman: escala, espaciado, radios, tipografía, iconos, capas, movimiento |
| [`tailwind.md`](./tailwind.md) | Cómo está configurado Tailwind, qué tokens viven en CSS y cuáles en TypeScript, y los errores que conviene no repetir |
| [`components.md`](./components.md) | Cómo se construye un componente con el sistema, con ejemplos del propio código |
| [`messages.md`](./messages.md) | Dónde vive cada texto de la interfaz, cómo se interpolan datos y plurales, y qué falta para añadir un idioma |
| [`http.md`](./http.md) | Cómo se habla con el backend: peticiones, servicios, caché, avisos y cómo integrar un endpoint nuevo |

Esta página cubre lo que se necesita a diario. Los otros seis documentos son
la referencia completa.

---

## El sistema en una página

### Un solo vocabulario de tamaños

`xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Cada nombre significa lo mismo en todos
los componentes: un botón `md` y un campo `md` en la misma fila miden 40px los
dos y su texto es idéntico. Si un componente expone la prop `size`, sus valores
salen de esta escala.

El tamaño por defecto es **`md`**.

### Dónde vive cada cosa

```
src/style/style.css   →  VALORES de color, tipografía, radios y sombras.
                         Tailwind genera una utilidad por cada uno.

src/tokens/           →  RECETAS (qué token usa cada componente),
                         el espaciado y los números que JavaScript necesita.

src/messages/         →  TEXTOS: todo lo que la interfaz dice, agrupado por
                         módulo y tipado para que no falte ninguna clave.
```

Para decidir dónde va algo nuevo, basta una pregunta: **¿JavaScript necesita
ese valor como número?** Si no, va solo al CSS. El detalle y la única
excepción (el espaciado) están en [`tailwind.md`](./tailwind.md).

### Las seis reglas

1. **No inventes valores.** Si algo parece necesitar 18px de separación, casi
   siempre le corresponden 16 o 24. La escala completa está en
   [`design-tokens.md`](./design-tokens.md).
2. **Los estilos van en `*.style.ts`**, no dentro del `.tsx`. Un archivo por
   componente, escrito con `cva`.
3. **Las clases se escriben literales.** Tailwind lee el código fuente y no
   detecta una clase construida con plantillas: `` `gap-${n}` `` no genera CSS.
4. **El tamaño se lee de la receta**: `CONTROL_SIZE.md.heightClass`, no `"h-10"`
   escrito a mano.
5. **La tipografía es un token, no cuatro decisiones.** `text-body-md` fija
   tamaño, interlineado, grosor y tracking a la vez.
6. **Los textos no se escriben en el componente.** Salen de `@/messages`, igual
   que los tamaños salen de `@/tokens`. Ver [`messages.md`](./messages.md).

### Arranque rápido

Un componente con tamaños, de principio a fin:

```ts
// mi-componente.style.ts
import { cva } from "class-variance-authority";
import { CONTROL_SIZE, FOCUS_RING, TRANSITION } from "@/tokens";

export const miComponenteVariants = cva(
    ["inline-flex items-center justify-center", TRANSITION.colors, FOCUS_RING.default],
    {
        variants: {
            size: {
                sm: [CONTROL_SIZE.sm.heightClass, CONTROL_SIZE.sm.paddingXClass, CONTROL_SIZE.sm.typographyClass],
                md: [CONTROL_SIZE.md.heightClass, CONTROL_SIZE.md.paddingXClass, CONTROL_SIZE.md.typographyClass],
            },
            tone: {
                primary: "bg-primary-main text-white hover:bg-primary-dark",
                neutral: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300",
            },
        },
        defaultVariants: { size: "md", tone: "primary" },
    }
);
```

Texto suelto, sin importar nada:

```tsx
<h2 className="text-h3">Ventas por sucursal</h2>
<p className="text-body-md text-neutral-600">Últimos 30 días</p>
<span className="text-caption text-neutral-500">Actualizado hace 5 min</span>
```

Iconos, que reciben el tamaño por prop y no por clase:

```tsx
<ICON_TOKENS.PRODUCTS
    size={CONTROL_SIZE.md.iconSize}
    strokeWidth={ICON_STROKE.regular}
/>
```

---

## Estado del proyecto

### Componentes compartidos (`src/components/`)

Las familias del sistema están construidas con tokens. Ninguna tiene
valores propios más allá de las geometrías cerradas que se documentan en su
`*.style.ts` y se resumen en [`components.md`](./components.md).

| Familia | Componentes | Notas |
|---|---|---|
| `alerts/` | `Alert`, `AlertToaster` | Sobre sonner. La cuenta atrás se anima en CSS |
| `avatars/` | `Avatar` | Dos formas: `circle` y `square` |
| `badges/` | `StatusBadge` | Escala `xs…2xl`, por defecto `sm` |
| `buttons/` | `GenericButton`, `LinkButton` | Escala completa `xs…2xl` |
| `cards/` | `MetricCard`, `ProductCard`, `ProductThumbnail` | Superficies fijas: `SURFACE_SIZE.xl` y `lg` |
| `filters/` | `FilterSelect` | |
| `inputs/` | `TextField`, `NumberField`, `InputSelector`, `TextAreaField` | Escala `sm…xl` |
| `inputs/primitives/` | `InputGroup`, `Combobox`, `input`, `textarea` | Traducidos desde shadcn |
| `layout/` | `AppShell`, `PageHeader` | `AppShell` monta sidebar y navbar; `PageHeader` es el encabezado de pantalla |
| `modals/` | `Modal`, `ConfirmDialog` | Sobre Base UI, traducidos desde `dialog` y `alert-dialog` |
| `navbar/` | `Navbar` | Armazón desde `NAVBAR` |
| `pagination/` | `Pagination` | Todo el pie en `CONTROL_SIZE.sm` |
| `sidebar/` | `Sidebar`, `SidebarButton`, `SidebarGroup`, `SidebarNavItem` | Armazón desde `SIDEBAR` y `Z_INDEX` |
| `tables/` | `DataTable`, `DataTableCheckbox`, `TitleSubtitleCell` | Fila en `ROW_HEIGHT.md` |
| `tabs/` | `FilterTabs` | Contador en `BADGE_SIZE.xs`; el alto es de pestaña, no de control |
| `toggles/` | `Switch` | La geometría del carril es propia; el resto sale del sistema |

`PageHeader` y `Modal` nacieron al aparecer la pantalla de categorías, las dos
por el mismo motivo: eran la segunda pantalla que necesitaba lo mismo. Cuando
algo se necesita dos veces deja de pertenecer a la pantalla donde apareció.

### Pendiente: `src/components/ui/`

Esta carpeta es donde el CLI de shadcn deja lo que se instala, y todavía
conserva tres archivos:

| Archivo | Estado |
|---|---|
| `input.tsx` | En uso desde `features/cashier/.../OrderSearch.tsx`. Se reemplaza por `inputs/primitives/input.tsx` cuando se migre esa pantalla |
| `card.tsx` | Sin usar. Se puede borrar |
| `tabs.tsx` | Sin usar. Se puede borrar |

Lo que baja del CLI se traduce al sistema y se mueve a su familia, como se hizo
con los campos, el avatar y los diálogos. Lo que duplica algo que ya existe se
borra sin traducir: es lo que pasó con el `button` que acompañaba a los
diálogos, porque `GenericButton` ya cubría su función.

### Pantallas (`src/features/`)

| Módulo | Archivos | Estado |
|---|---|---|
| `products/` | 76 | Construido con el sistema: catálogo, alta por pasos y categorías, textos incluidos |
| `main-dashboard/` | 19 | Pendiente. Sus paneles siguen en `rounded-lg` donde el resto usa `rounded-xl`, y sus gráficos llevan tamaños de texto arbitrarios (`text-[28px]`, `text-[26px]`) |
| `cashier/` | 29 | Pendiente, y es el más alejado: no importa `@/tokens` ni `@/messages`, usa tipografía fuera de la rampa (`text-xl`), espaciado fuera de la escala (`space-y-5`) y sombra en superficies estáticas |
| `login/` | 5 | Pendiente. Solo un archivo lee tokens |

El orden natural para continuar es `main-dashboard` (donde el desfase es de
radios y tamaños sueltos) y después `cashier`, que necesita también sus textos.

### Sobre los iconos

`ICON_TOKENS` registra los iconos que representan un **concepto del producto**:
una sección del menú, una acción, un estado. Los que son solo gramática de un
control (el chevron de un desplegable, la equis de un campo, la marca de un
checkbox) se importan directos de lucide en el componente que los dibuja.

La prueba para decidirlo: si cambiar ese icono en toda la aplicación fuera una
decisión de producto, va al registro.
