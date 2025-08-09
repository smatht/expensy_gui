# Expensy - Gestor de Gastos e Ingresos

Una aplicación de escritorio desarrollada en Python usando Kivy para gestionar gastos e ingresos personales.

## Características

- Formulario para registro de gastos e ingresos
- Campos de descripción, monto, tipo (gasto/ingreso), fecha y categoría
- Validación de datos
- Almacenamiento temporal en archivo JSON local
- Interfaz de usuario intuitiva y responsive

## Categorías disponibles

- Hogar
- Comidas y bebidas
- Salud y cuidado personal
- Supermercado

## Instalación y ejecución

1. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

2. Ejecutar la aplicación:
```bash
python main.py
```

## Funcionalidades

### Campos del formulario:
- **Descripción**: Texto descriptivo del gasto o ingreso (máximo 255 caracteres)
- **Monto**: Valor numérico (float) del monto
- **Tipo**: Selector entre "Gasto" e "Ingreso" usando toggle buttons
- **Fecha**: Selectores separados para día, mes y año
- **Categoría**: Selector con las categorías predefinidas

### Validaciones:
- Descripción obligatoria
- Monto obligatorio y mayor a 0
- Formato numérico válido para el monto

### Funciones:
- **Guardar**: Valida y guarda el registro
- **Limpiar**: Resetea todos los campos del formulario

## Notas técnicas

- Los datos se guardan temporalmente en un archivo `expenses.json`
- En futuras iteraciones se implementará la conexión con endpoints web
- Las categorías están definidas como constantes y se cargarán desde una API en versiones futuras
