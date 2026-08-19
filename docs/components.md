# Construir un componente

Cómo se arma un componente con el sistema, con ejemplos completos sacados del
propio proyecto. Para el catálogo de tokens, ver
[`design-tokens.md`](./design-tokens.md).

---

## Anatomía

Cada familia tiene su carpeta en `src/components`, y cada componente dos
archivos:

```
src/components/buttons/
├── GenericButton.tsx          ← estructura y comportamiento
├── generic-button.style.ts    ← todas las clases, en cva
├── LinkButton.tsx
└── link-button.style.ts
```

| Regla | Por qué |
|---|---|
| Componente en `PascalCase.tsx` | Es lo que se importa |
| Estilos en `kebab-case.style.ts` | Un archivo por componente, mismo nombre |
| Los props en `src/interfaces/components/` | Compartidos y reutilizables; el `.tsx` no declara los suyos |
| Export en `components/index.ts` | Punto de entrada único |

El `.tsx` no debería tener ni una clase suelta larga. Si estás escribiendo
`className="flex h-10 items-center rounded-lg border…"` dentro del JSX, eso va
al `.style.ts`.

Las familias con primitivos internos añaden una subcarpeta —`inputs/primitives`—
para separar lo que se usa en pantalla de lo que es material de construcción.

---

## El patrón

```ts
// status-badge.style.ts
import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva(
    [ /* base: lo que no cambia nunca */ ],
    {
        variants: { /* ejes independientes */ },
        compoundVariants: [ /* combinaciones especiales */ ],
        defaultVariants: { /* el estado por defecto */ },
    }
);
```

```tsx
// StatusBadge.tsx
export default function StatusBadge({ label, tone, size, className }: StatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({ tone, size }), className)}>
            {label}
        </span>
    );
}
```

Los ejes que casi siempre aparecen:

- **`size`** → sale entero de la receta (`CONTROL_SIZE`, `BADGE_SIZE`…)
- **`variant` / `tone`** → la identidad del componente: colores. Esto sí se
  escribe aquí, porque no lo comparte con nadie.

---

## Ejemplo 1: un botón

El eje `size` no escribe medidas: las toma de la receta. Como todas las clases
salen literales de `components.tokens.ts`, se pueden componer con una función
sin romper el escaneo de Tailwind.

```ts
// generic-button.style.ts
import { cva } from "class-variance-authority";
import { ControlSizeToken } from "@/interfaces";
import { CONTROL_SIZE, FOCUS_RING, TRANSITION } from "@/tokens";

const controlSize = (token: ControlSizeToken) => [
    token.heightClass,
    token.paddingXClass,
    token.gapClass,
    token.radiusClass,
    token.typographyClass,
];

export const genericButtonVariants = cva(
    [
        "inline-flex cursor-pointer select-none items-center justify-center",
        TRANSITION.colors,
        FOCUS_RING.default,
        "disabled:cursor-not-allowed",
    ],
    {
        variants: {
            variant: {
                primary: [
                    "bg-primary-main text-white",
                    "hover:bg-primary-dark",
                    "disabled:bg-neutral-400 disabled:text-white",
                ],
                ghost: [
                    "bg-transparent text-neutral-600",
                    "hover:bg-neutral-200",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
            },
            size: {
                sm: controlSize(CONTROL_SIZE.sm),
                md: controlSize(CONTROL_SIZE.md),
                lg: controlSize(CONTROL_SIZE.lg),
            },
            fullWidth: { true: "w-full", false: "w-auto" },
        },

        // Solo icono → cuadrado, y se anula el relleno horizontal: con el ancho
        // ya cerrado, el `px` solo estrecharía la caja hasta aplastar el icono.
        compoundVariants: [
            { iconOnly: true, size: "md", class: [CONTROL_SIZE.md.squareClass, "px-0"] },
        ],

        defaultVariants: { variant: "primary", size: "md", fullWidth: false },
    }
);
```

Y en el componente, el icono se dimensiona por prop porque lucide no entiende
clases:

```tsx
const sizeToken = size ?? "md";
const iconSize   = CONTROL_SIZE[sizeToken].iconSize;
const iconStroke = ICON_STROKE_BY_SIZE[sizeToken];

<StartIcon size={iconSize} strokeWidth={iconStroke} />
```

---

## Ejemplo 2: un campo compuesto

`TextField` se monta sobre `InputGroup`: el contenedor pinta el borde y los
estados, y el `<input>` va desnudo dentro. Los estados suben al contenedor con
`has-*` y bajan al control por selectores de slot.

```ts
size: {
    md: [
        CONTROL_SIZE.md.heightClass,   // directo de la receta
        CONTROL_SIZE.md.radiusClass,

        // Dentro de un slot hay que escribir la clase con su variante delante,
        // y eso no se puede componer: va literal, con el escalón de la receta.
        "[&_[data-slot=input-group-control]]:px-4",
        "[&_[data-slot=input-group-control]]:text-label-lg",
        "md:[&_[data-slot=input-group-control]]:text-label-md",
        "[&_svg]:size-4",
    ],
},

tone: {
    default: [
        "border-neutral-300 hover:border-neutral-400",
        "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/15",
    ],
},
```

Dos cosas que hay que saber de este patrón:

**El texto sube a 16px en móvil.** `text-label-lg md:text-label-md` no es un
capricho: por debajo de 16px iOS hace zoom automático al enfocar un campo. Todo
control con entrada de texto lo lleva.

**Los `data-slot` son contrato.** Los estilos llegan al control, a los adornos y
a los botones a través de ellos. Renombrarlos rompe los campos en silencio.

---

## Dónde van los tipos

Todo se importa desde `@/interfaces`. Dentro, el reparto es por **origen del
tipo**, no por quién lo usa:

```
src/interfaces/
├── components/       ← props de los componentes, un archivo por familia
│   ├── buttons.interfaces.ts
│   ├── cards.interfaces.ts
│   └── …
├── tokens/           ← la forma de las recetas del design system
├── menu.types.ts     ← dominio
└── data-table.types.ts  ← augmentación de @tanstack/react-table
```

La regla para decidir dónde va algo nuevo está en el sufijo: **`*.interfaces.ts`
son props de un componente y viven en `components/`; `*.types.ts` es todo lo
demás** —tipos de dominio, augmentación de una librería— y se queda en la raíz.

Los props se derivan del `cva` para no mantener dos listas:

```ts
// interfaces/components/buttons.interfaces.ts
import { VariantProps } from "class-variance-authority";
import { genericButtonVariants } from "@/components/buttons/generic-button.style";

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof genericButtonVariants> {
    label?: string;
    icon?: LucideIcon;
}

/** Se actualiza solo si cambian las variantes. */
export type ButtonSize = NonNullable<ButtonProps["size"]>;
```

---

## Elegir el tamaño

| Si el componente… | Expón |
|---|---|
| Es un control pulsable (botón, pestaña) | Los seis escalones |
| Acepta texto escrito (campo, selector) | `sm · md · lg · xl` — `xs` no admite texto legible y `2xl` convierte un campo en un cartel |
| Es decorativo (insignia, avatar) | Los seis |
| No cambia de tamaño (textarea) | Ninguno: el alto lo decide otra cosa, como `rows` |

```ts
// Recortar la escala sin salirse de ella
export type InputSize = Extract<SizeToken, "sm" | "md" | "lg" | "xl">;
```

---

## Checklist

Antes de dar un componente por terminado:

- [ ] Las clases están en `*.style.ts`, no en el `.tsx`
- [ ] `size` sale de una receta de `components.tokens.ts`
- [ ] Ni un valor arbitrario: nada de `text-[13px]` ni `p-[18px]`
- [ ] La tipografía es un token de la rampa, no `text-sm` suelto
- [ ] El foco usa `FOCUS_RING`, no un anillo propio
- [ ] Las transiciones usan `TRANSITION.*` (llevan `motion-reduce` incluido)
- [ ] Si lleva texto escribible, sube a 16px en móvil
- [ ] Si flota, la capa sale de `Z_INDEX`
- [ ] Los iconos salen de `ICON_TOKENS` y se dimensionan con `iconSize`
- [ ] Las props están tipadas en `src/interfaces/components/`
- [ ] Exportado desde `components/index.ts`

---

## Lo que enseñó la migración

Ya no queda ninguna familia pendiente. Lo que sigue es lo que costó descubrir
por el camino, que es lo que sirve para el siguiente componente.

**Hay geometría que no es la retícula.** Cuatro veces apareció el mismo patrón:
un puñado de medidas que solo funcionan juntas y que romperías al sustituirlas
una a una por tokens. El carril del `Switch` (24 de alto − 4 de borde y relleno
= 20 de perilla = 20 de recorrido). El alto de una pestaña subrayada. Y sobre
todo la **cadena horizontal del sidebar**: `SIDEBAR.paddingX` (12) + medio
icono (18/2) sitúa el riel del submenú en 21px, y de ese mismo 12 cuelgan la
sangría del título de sección y el desplazamiento del indicador de selección.
Se verifica midiendo: el centro del icono del padre y el borde del riel tienen
que dar el mismo número.

En estos casos se migra todo lo demás —tipografía, transiciones, foco, radios,
capas, elevación— y la geometría se deja junta, documentada y con el porqué al
lado. Un token mal aplicado aquí no rompe el build: descoloca dos píxeles y
nadie lo ve hasta que la línea deja de caer donde debe.

**Con una librería headless, el cuidado no está donde parece.** TanStack Table
no trae una sola clase, así que en `tables/` no hubo nada de la trampa 4 de
[`tailwind.md`](./tailwind.md) —especificidades prestadas—. Lo que sí hay es un
contrato propio: `meta.headerClassName` y `meta.cellClassName`, con los que una
columna afina su celda. Esas clases tienen que quedar **al final del `cn()`**
para que tailwind-merge las deje ganar sobre la base; si se meten dentro del
`cva`, una columna deja de poder ajustar su ancho y nadie se entera hasta que
alguien lo intenta.

**El alto de fila se declara, no se calcula.** `ROW_HEIGHT_CLASS.md` en el `td`
da los 48px del escalón y actúa como mínimo, así que las filas con celdas de
dos líneas crecen solas. Es mejor que despejar la ecuación del relleno: el
`py-3.5` que había salía de restarle el interlineado a la altura deseada, y se
descuadraba en cuanto la tipografía cambiaba.

**No todo componente pulsable toma su alto de `CONTROL_SIZE`.** `FilterTabs`
fue el primer caso: una pestaña subrayada no es una caja, es texto con una
línea debajo. Fijarle `h-10` centraría el texto y despegaría el subrayado, así
que el alto lo sigue poniendo el relleno vertical —que ya caía en la retícula
de 4px—. Todo lo demás sí sale del sistema: tipografía, transición, foco,
relleno horizontal y el contador, que es un `BADGE_SIZE.xs` con el radio
cambiado a píldora.

**Y el `gap` entre pestañas no era espaciado, era otra cosa.** Con hueco entre
ellas, el subrayado del hover se dibuja como un trozo suelto flotando entre dos
vacíos. La separación tiene que vivir dentro de cada pestaña —`px-3 sm:px-4`,
el relleno del control— para que los bordes inferiores se toquen y la línea se
lea continua. El relleno es simétrico también en la primera: quitarle el `pl`
para alinearla con el título de la página la deja descentrada respecto a su
propio subrayado, y eso se nota más que el desfase con el título. Regla
general: **si un elemento dibuja una línea que debe leerse continua con la de
su vecino, la separación va en relleno, nunca en `gap`.**

**Un componente cerrado puede borrar la mitad del CSS que traía.** El
`alert-dialog` de shadcn resolvía la cabecera con una rejilla y cuatro
variantes cruzadas (`has-data-[slot=…]:grid-rows-[auto_auto_1fr]`,
`sm:group-data-[size=default]/alert-dialog-content:place-items-start`…) para
que el icono se colocara al lado del texto en escritorio y encima en móvil.
Eso es el precio de exponer piezas sueltas: el CSS tiene que cubrir todas las
composiciones posibles. `ConfirmDialog` recibe icono, título y descripción por
props y tiene un solo formato, así que esas variantes dejan de hacer falta. La
regla que salió de ahí: **si la decisión ya está tomada, tómala en el
componente y no en el selector.**

**Dos ejes de color solo se cruzan donde hace falta.** El `Alert` tiene
`variant` —tintada o blanca— y `tone` —qué significa—, y el reflejo es escribir
las diez combinaciones. No: `variant` decide la superficie, `tone` decide el
icono y la barra de cuenta atrás, y solo se cruzan en la tintada, que es la
única donde el tono pinta el fondo. Cinco `compoundVariants` en vez de diez, y
el día que entre una tercera superficie no hay que repintar los cinco tonos
otra vez. La pregunta que lo resuelve es **qué parte cambia con cada eje**,
no cuántas combinaciones hay.

**Sobre un fondo tintado, el texto va a `-darker`.** Es la medida, no el gusto:
`-dark` sobre el `-lighter` de su propia familia se queda en 3,7:1 —el verde y
el ámbar son los que peor caen— y un párrafo necesita 4,5:1. En `-darker` la
peor pareja de las cinco da 6,9:1. Y por eso el título y la descripción del
aviso comparten color y se distinguen por grosor: bajarle la opacidad al
párrafo para apagarlo lo devuelve justo por debajo del umbral. La familia
entera acaba usando tres tonos con un papel fijo: `-lighter` el fondo, `-light`
el relleno del medallón, `-darker` todo lo que hay que leer. El `-dark` se
queda para la equis, que es un control y no un texto.

**Un icono puede ser el medallón.** El aviso no monta un círculo de color con
un glifo dentro —que es lo que hace el diálogo de confirmación—: dibuja el
propio icono de estado a 40px, relleno en `-light` y perfilado en `-darker`.
Sale gratis lo que de la otra forma habría que construir: **cada tono trae su
silueta** —círculo, triángulo, octógono—, y eso es lo que distingue un error de
una confirmación sin depender del color.

Con dos avisos: el tamaño sale de `CONTROL_SIZE` y no de `ICON_SIZE`, porque la
escala de iconos se corta en 24px a propósito —un icono acompaña a un texto y
esto no acompaña a nada—. Y el relleno **no** se puede aplicar al icono entero:
lucide no garantiza que el contorno sea el primer `path` del SVG, así que en
`OctagonX` el octógono se pinta encima de una de las aspas y el aspa
desaparece. Se dibuja dos veces —abajo la silueta con el trazo a cero, arriba
el dibujo completo sin relleno— y el orden de los `path` deja de importar. Eso
solo se ve mirando la pantalla: compila igual y el icono sale "casi" bien.

**Un componente que se desmonta solo necesita `key`.** El aviso se cierra —por
la equis o por temporizador—, termina su animación de salida y se pinta a sí
mismo como nada. Si quien lo muestra vuelve a renderizar el mismo elemento, no
pasa nada: React reutiliza la instancia cerrada y el segundo aviso no llega a
verse. Con una identidad nueva —el `id` de una lista, un contador— se monta de
verdad. Es la única aspereza de que el componente controle su propio ciclo, y
compensa: la alternativa es que cada pantalla que quiera un aviso monte también
el `useState` que lo esconde.

**Pausar es guardar lo que queda, no reiniciar.** El temporizador del aviso se
para con el puntero encima y sigue por donde iba al salir. Rearmarlo con los
cinco segundos completos es una línea más corta y está mal: un aviso por el que
se pasa dos veces no se iría nunca. El resto vive en una `ref` porque cambia en
la limpieza del efecto y no lo pinta nadie —la barra la anima el CSS, que se
congela con `data-paused` en el mismo momento—.

**El primitivo importa tanto como el estilo.** `Modal` se monta sobre
`Dialog` y `ConfirmDialog` sobre `AlertDialog`, que es el mismo diálogo con una
diferencia: la alerta no se cierra al pulsar fuera. Un clic despistado no puede
ser la respuesta a "¿seguro que quieres borrar esto?". Base UI ni siquiera
expone ahí el `disablePointerDismissal` del diálogo normal, y eso es una pista:
cuando la librería quita una prop, está diciendo cuál es el componente correcto
para el caso.

**Pendiente de las tarjetas:** al migrar `cards/` el radio de superficie subió
a `rounded-xl` (`RADIUS_SEMANTIC.surface`). Los paneles que aún no están
migrados —`RecentOrdersTable`, `TopProductsCard`, `SalesChartSection`— siguen
en `rounded-lg`, así que en el dashboard conviven dos radios. Se cierra solo
cuando les toque el turno; no hay que tocarlos antes.

El procedimiento que funcionó con los ya migrados:

1. **Mide lo que hay.** Anota altos, radios y tamaños de texto actuales, y
   busca a qué escalón corresponden. Casi todo coincide: la escala se eligió a
   partir de lo que ya existía.
2. **Sustituye los valores por tokens**, empezando por los que coinciden.
3. **Decide qué hacer con los que no.** Un `h-9` (36px) que no está en la
   escala es una decisión, no un descuido: o sube a 40 o baja a 32, y se anota
   el cambio.
4. **Busca los call sites** antes de tocar la API. Cambiar `small/medium/large`
   por `sm/md/lg` es un cambio de contrato.
5. **Verifica en pantalla, no solo en el build.** Un `tsc` verde no dice nada
   sobre si una clase se está aplicando: puede estar perdiendo una guerra de
   especificidad contra otra.

Sobre el punto 5: mídelo en el navegador con `getComputedStyle`. Más de un
problema de esta migración —el tamaño de icono que nunca se aplicaba, la
tipografía que perdía contra `text-sm`— compilaba perfectamente.
