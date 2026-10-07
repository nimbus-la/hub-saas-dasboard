/**
 * Textos de la autenticación
 *
 * La pantalla de inicio de sesión: su panel de bienvenida, el formulario y los
 * avisos que el backend no redacta. El botón de cerrar sesión no está aquí:
 * vive en la barra superior y su texto con ella, en `navigation`.
 */


export const auth = {

    /* ====================================================================== */
    /*  Metadatos de las rutas                                                */
    /* ====================================================================== */

    metadata: {
        login: {
            title: "Iniciar sesión · Vorea",
            description: "Accede al panel de control de tu negocio.",
        },
    },


    /* ====================================================================== */
    /*  Formulario                                                            */
    /* ====================================================================== */

    login: {
        title: "Bienvenidos",
        subtitle: "Ingresa tus datos para acceder a tu cuenta.",

        fields: {
            tenantSlug: {
                label: "Empresa",
                placeholder: "Ingresa tu nombre de empresa",
            },
            username: {
                label: "Usuario",
                placeholder: "Ingresa tu usuario",
            },
            password: {
                label: "Contraseña",
                placeholder: "Ingresa tu contraseña",
            },
        },

        submit: "Iniciar sesión",
        submitting: "Iniciando sesión...",

        /**
         * Cuando el backend rechaza las credenciales sin redactar el motivo.
         * No dice cuál de los tres campos falló a propósito: decirlo ayudaría
         * a adivinar usuarios.
         */
        invalidCredentials: "La empresa, el usuario o la contraseña no son correctos.",
    },


    /* ====================================================================== */
    /*  Panel de bienvenida                                                   */
    /* ====================================================================== */

    showcase: {
        title: "Gestiona tu equipo y tus operaciones sin esfuerzo.",
        description:
            "Inicia sesión para acceder al panel de control de tu CRM y gestionar tu equipo.",
        previewAlt: "Vista previa del dashboard de Vorea",
    },
} as const;