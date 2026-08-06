# Documentación

Todo lo escrito del proyecto vive aquí. Nada de `README.md` sueltos por
carpetas: si hace falta explicar algo que no cabe en un comentario, va a este
directorio.

## Índice

| Documento | Qué responde |
|---|---|
| [`design-tokens.md`](./design-tokens.md) | Qué valores existen y cómo se llaman: escala, espaciado, radios, tipografía, iconos, capas, movimiento |
| [`tailwind.md`](./tailwind.md) | Cómo está montado Tailwind aquí, por qué unos tokens viven en CSS y otros en TS, y las trampas que ya costaron un rato |
| [`components.md`](./components.md) | Cómo se construye un componente con el sistema, con ejemplos completos |

Empieza por esta página. Cubre el 90% del día a día en cinco minutos.

---

## El sistema en una página

### Un solo vocabulario de tamaños

`xs · sm · md · lg · xl · 2xl`. Significa lo mismo en todas partes: un botón
`md` y un campo `md` puestos en la misma fila miden 40px los dos y su texto es
el mismo. Si un componente expone `size`, sus valores salen de ahí.

El escalón por defecto es **`md`**.

### Dónde vive cada cosa

```
src/style/style.css   →  VALORES de color, tipografía, radios y sombras
                         (Tailwind genera una utilidad por token)

src/tokens/           →  RECETAS (qué token usa cada componente),
                         el espaciado y los números que JavaScript necesita
```

La regla para decidir dónde va algo nuevo: **¿lo necesita JavaScript como
número?** Si no, va solo al CSS. Los detalles y la única excepción —el
espaciado— están en [`tailwind.md`](./tailwind.md).

### Las cinco reglas

1. **No inventes valores.** Si algo "necesita" 18px de separación, casi siempre
   le tocan 16 o 24. La escala está en [`design-tokens.md`](./design-tokens.md).
2. **Los estilos van en `*.style.ts`**, no dentro del `.tsx`. Un archivo por
   componente, con `cva`.
3. **Las clases se escriben literales.** Tailwind escanea el código fuente y no
   ve una clase construida con plantillas: `` `gap-${n}` `` no existe.
4. **El tamaño se lee de la receta**, no se escribe a mano:
   `CONTROL_SIZE.md.heightClass`, no `"h-10"`.
5. **La tipografía es un token, no dos decisiones.** `text-body-md` fija tamaño,
   interlineado, grosor y tracking a la vez. No los elijas por separado.

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

Iconos, que se dimensionan por prop y no por clase:

```tsx
<ICON_TOKENS.PRODUCTS
    size={CONTROL_SIZE.md.iconSize}
    strokeWidth={ICON_STROKE.regular}
/>
```

### Qué está migrado

| Familia | Estado |
|---|---|
| `buttons/` — `GenericButton`, `LinkButton` | Migrado (escala `xs…2xl`) |
| `inputs/` — `TextField`, `InputSelector`, `TextAreaField` | Migrado (escala `sm…xl`) |
| `inputs/primitives/` — `InputGroup`, `Combobox` | Migrado y traducido desde shadcn |
| `avatars/` — `Avatar` | Migrado |
| `badges/` — `StatusBadge` | Migrado (escala `xs…2xl`, por defecto `sm`) |
| `cards/` — `MetricCard`, `ProductCard`, `ProductThumbnail` | Migrado (superficies fijas: `SURFACE_SIZE.xl` y `lg`) |
| `pagination/` — `Pagination` | Migrado (todo el pie en `CONTROL_SIZE.sm`) |
| `tabs/` — `FilterTabs` | Migrado (contador en `BADGE_SIZE.xs`; el alto es de pestaña, no de control) |
| `tables/` — `DataTable`, `DataTableCheckbox`, `TitleSubtitleCell` | Migrado (fila en `ROW_HEIGHT.md`) |
| `toggles/` — `Switch` | Migrado (la geometría del carril es suya; el resto, del sistema) |
| `sidebar/` — `Sidebar`, `SidebarButton`, `SidebarGroup`, `SidebarNavItem` | Migrado (armazón desde `SIDEBAR` y `Z_INDEX`) |
| `navbar/` — `Navbar` | Migrado (armazón desde `NAVBAR`; sin clases de shadcn) |

La migración está completa: no queda ninguna familia con valores propios. Lo
que quedó fuera de los tokens a propósito —geometrías cerradas como el carril
del `Switch` o la cadena horizontal del sidebar— va documentado en su
`*.style.ts` y resumido en [`components.md`](./components.md).

Fuera de `components/` sí quedan piezas sin migrar: los paneles, tablas y
gráficos de `features/main-dashboard`. No estorban —el sistema convive con
ellas—, pero son las que todavía usan `rounded-lg` donde el resto ya usa
`rounded-xl`.
