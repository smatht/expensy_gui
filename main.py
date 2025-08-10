from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.spinner import Spinner
from kivy.uix.togglebutton import ToggleButton
from kivy.uix.popup import Popup
from kivy.uix.scrollview import ScrollView
from kivy.graphics import Color, RoundedRectangle, Line
from kivy.metrics import dp, sp
from kivy.config import Config
from kivy.utils import get_color_from_hex
from datetime import datetime, date
import calendar
from expensy_client import ExpensyClient

# Color palette - Dark modern theme
COLORS = {
    "background": get_color_from_hex("#1a1a1a"),
    "card_background": get_color_from_hex("#2d2d2d"),
    "input_background": get_color_from_hex("#404040"),
    "primary": get_color_from_hex("#6366f1"),
    "success": get_color_from_hex("#10b981"),
    "danger": get_color_from_hex("#ef4444"),
    "warning": get_color_from_hex("#f59e0b"),
    "text_primary": get_color_from_hex("#ffffff"),
    "text_secondary": get_color_from_hex("#9ca3af"),
    "border": get_color_from_hex("#4b5563"),
    "accent": get_color_from_hex("#8b5cf6"),
}

# Categorías como constantes
CATEGORIES = ["Hogar", "Comidas y bebidas", "Salud y cuidado personal", "Supermercado"]

# Fuente de los datos
SOURCE_FIELD = "ingreso manual"

# Configuración para dispositivos móviles
Config.set("graphics", "width", "375")
Config.set("graphics", "height", "667")
Config.set("graphics", "resizable", False)
Config.set("graphics", "clear_color", "#1a1a1a")


class ModernCard(BoxLayout):
    """Card container with modern styling"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.padding = dp(20)
        self.spacing = dp(15)

        with self.canvas.before:
            Color(*COLORS["card_background"])
            self.rect = RoundedRectangle(pos=self.pos, size=self.size, radius=[dp(12)])

        self.bind(pos=self.update_rect, size=self.update_rect)

    def update_rect(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size


class ModernTextInput(TextInput):
    """Modern styled text input"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_color = COLORS["input_background"]
        self.foreground_color = COLORS["text_primary"]
        self.cursor_color = COLORS["primary"]
        self.selection_color = COLORS["primary"][:3] + [0.3]
        self.padding = [dp(15), dp(12)]
        self.font_size = sp(16)

        with self.canvas.before:
            Color(*COLORS["border"])
            self.border_line = Line(width=1)

        self.bind(pos=self.update_border, size=self.update_border)
        self.bind(focus=self.on_focus_change)

    def update_border(self, *args):
        self.border_line.rounded_rectangle = (*self.pos, *self.size, dp(8))

    def on_focus_change(self, instance, focus):
        with self.canvas.before:
            if focus:
                Color(*COLORS["primary"])
            else:
                Color(*COLORS["border"])
            self.border_line = Line(width=2 if focus else 1)
            self.border_line.rounded_rectangle = (*self.pos, *self.size, dp(8))


class SimpleModernButton(Button):
    """Ultra-simple modern button that always works"""

    def __init__(self, button_type="primary", **kwargs):
        super().__init__(**kwargs)

        color_map = {
            "primary": COLORS["primary"],
            "success": COLORS["success"],
            "danger": COLORS["danger"],
            "secondary": COLORS["border"],
        }

        # Simple approach - just use background_color
        self.background_normal = ""
        self.background_down = ""
        self.color = COLORS["text_primary"]
        self.font_size = sp(16)
        self.bold = True

        # Set the background color directly
        self.background_color = color_map.get(button_type, COLORS["primary"])


class ModernButton(SimpleModernButton):
    """Modern styled button with canvas rendering"""

    def __init__(self, button_type="primary", **kwargs):
        super().__init__(button_type, **kwargs)

        # Store base color for canvas rendering
        color_map = {
            "primary": COLORS["primary"],
            "success": COLORS["success"],
            "danger": COLORS["danger"],
            "secondary": COLORS["border"],
        }
        self.base_color = color_map.get(button_type, COLORS["primary"])

        # Try canvas rendering, fallback to background_color
        try:
            self.bind(pos=self.update_canvas, size=self.update_canvas)
            self.bind(state=self.update_canvas)

            from kivy.clock import Clock

            Clock.schedule_once(self.update_canvas, 0.1)
        except Exception:
            # If canvas fails, keep the simple background_color
            pass

    def update_canvas(self, *args):
        """Try to draw with canvas, fallback to background_color"""
        try:
            if self.width <= 1 or self.height <= 1:
                return

            self.canvas.before.clear()
            with self.canvas.before:
                if self.state == "down":
                    pressed_color = [c * 0.8 for c in self.base_color[:3]] + [
                        self.base_color[3]
                    ]
                    Color(*pressed_color)
                    self.background_color = pressed_color
                else:
                    Color(*self.base_color)
                    self.background_color = self.base_color
                self.bg_rect = RoundedRectangle(
                    pos=(self.x, self.y), size=(self.width, self.height), radius=[dp(8)]
                )
        except Exception:
            # Canvas failed, ensure background_color is set
            self.background_color = self.base_color


class ModernLabel(Label):
    """Modern styled label"""

    def __init__(self, label_type="primary", **kwargs):
        super().__init__(**kwargs)

        if label_type == "title":
            self.color = COLORS["text_primary"]
            self.font_size = sp(24)
            self.bold = True
        elif label_type == "subtitle":
            self.color = COLORS["text_primary"]
            self.font_size = sp(18)
            self.bold = True
        elif label_type == "secondary":
            self.color = COLORS["text_secondary"]
            self.font_size = sp(14)
        else:  # primary
            self.color = COLORS["text_primary"]
            self.font_size = sp(16)


class ModernSpinner(Spinner):
    """Modern styled spinner"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_normal = ""
        self.background_down = ""
        self.background_color = COLORS["input_background"]
        self.color = COLORS["text_primary"]
        self.font_size = sp(16)
        self.halign = "left"
        self.text_size = (None, None)
        self.padding = [dp(15), dp(12)]

        # Set background and border
        self.canvas.before.clear()
        with self.canvas.before:
            Color(*COLORS["input_background"])
            self.bg_rect = RoundedRectangle(
                pos=self.pos, size=self.size, radius=[dp(8)]
            )
            Color(*COLORS["border"])
            self.border_line = Line(width=1)

        self.bind(pos=self.update_canvas, size=self.update_canvas)
        self.bind(text_size=self.update_text_size)
        # Schedule canvas update after widget is built
        from kivy.clock import Clock

        Clock.schedule_once(lambda dt: self.update_canvas(), 0.1)

    def update_canvas(self, *args):
        # Only update if widget has been sized
        if self.width <= 1 or self.height <= 1:
            return
        self.canvas.before.clear()
        with self.canvas.before:
            Color(*COLORS["input_background"])
            self.bg_rect = RoundedRectangle(
                pos=(self.x, self.y), size=(self.width, self.height), radius=[dp(8)]
            )
            Color(*COLORS["border"])
            self.border_line = Line(width=1)
            self.border_line.rounded_rectangle = (
                self.x,
                self.y,
                self.width,
                self.height,
                dp(8),
            )

    def update_text_size(self, *args):
        if self.width > 0:
            self.text_size = (self.width - dp(30), None)


class ModernToggleButton(ToggleButton):
    """Modern styled toggle button with clear selection state"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_normal = ""
        self.background_down = ""
        self.color = COLORS["text_primary"]
        self.font_size = sp(16)
        self.bold = True

        # Set initial colors based on state
        self.update_colors()

        self.bind(pos=self.update_canvas, size=self.update_canvas)
        self.bind(state=self.update_canvas)
        # Schedule canvas update after widget is built
        from kivy.clock import Clock

        Clock.schedule_once(self.update_canvas, 0.1)

    def update_colors(self):
        """Update colors based on toggle state"""
        if self.state == "down":
            # Selected state - bright blue
            self.background_color = COLORS["primary"]
        else:
            # Unselected state - dark background
            self.background_color = COLORS["input_background"]

    def update_canvas(self, *args):
        """Update canvas and background color"""
        # Update background color first (guaranteed fallback)
        self.update_colors()

        # Only update canvas if widget has been sized
        if self.width <= 1 or self.height <= 1:
            return
        # Try canvas rendering for rounded corners
        try:
            self.canvas.before.clear()
            with self.canvas.before:
                # Background color based on state
                if self.state == "down":
                    Color(*COLORS["primary"])
                else:
                    Color(*COLORS["input_background"])

                self.bg_rect = RoundedRectangle(
                    pos=(self.x, self.y), size=(self.width, self.height), radius=[dp(8)]
                )

                # Border
                Color(*COLORS["border"])
                self.border_rect = Line(width=1)
                self.border_rect.rounded_rectangle = (
                    self.x,
                    self.y,
                    self.width,
                    self.height,
                    dp(8),
                )
        except Exception:
            # Canvas failed, background_color is already set
            pass


class ModernExpenseToggle(ModernToggleButton):
    """Toggle button specifically for expenses (red theme)"""

    def update_colors(self):
        """Update colors with expense-specific theme"""
        if self.state == "down":
            # Selected expense - red/danger color
            self.background_color = COLORS["danger"]
        else:
            # Unselected state - dark background
            self.background_color = COLORS["input_background"]

    def update_canvas(self, *args):
        """Update canvas with expense colors"""
        self.update_colors()
        if self.width <= 1 or self.height <= 1:
            return
        try:
            self.canvas.before.clear()
            with self.canvas.before:
                if self.state == "down":
                    Color(*COLORS["danger"])
                else:
                    Color(*COLORS["input_background"])

                self.bg_rect = RoundedRectangle(
                    pos=(self.x, self.y), size=(self.width, self.height), radius=[dp(8)]
                )

                Color(*COLORS["border"])
                self.border_rect = Line(width=1)
                self.border_rect.rounded_rectangle = (
                    self.x,
                    self.y,
                    self.width,
                    self.height,
                    dp(8),
                )
        except Exception:
            pass


class ModernIncomeToggle(ModernToggleButton):
    """Toggle button specifically for income (green theme)"""

    def update_colors(self):
        """Update colors with income-specific theme"""
        if self.state == "down":
            # Selected income - green/success color
            self.background_color = COLORS["success"]
        else:
            # Unselected state - dark background
            self.background_color = COLORS["input_background"]

    def update_canvas(self, *args):
        """Update canvas with income colors"""
        self.update_colors()
        if self.width <= 1 or self.height <= 1:
            return
        try:
            self.canvas.before.clear()
            with self.canvas.before:
                if self.state == "down":
                    Color(*COLORS["success"])
                else:
                    Color(*COLORS["input_background"])

                self.bg_rect = RoundedRectangle(
                    pos=(self.x, self.y), size=(self.width, self.height), radius=[dp(8)]
                )

                Color(*COLORS["border"])
                self.border_rect = Line(width=1)
                self.border_rect.rounded_rectangle = (
                    self.x,
                    self.y,
                    self.width,
                    self.height,
                    dp(8),
                )
        except Exception:
            pass


class DatePickerWidget(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = "horizontal"
        self.selected_date = datetime.now().date()

        # Button que muestra la fecha seleccionada
        self.date_button = ModernButton(
            text=self.selected_date.strftime("%d/%m/%Y"),
            size_hint_x=0.75,
            button_type="secondary",
        )
        self.date_button.bind(on_press=self.open_date_picker)
        self.add_widget(self.date_button)

        # Button para fecha de hoy
        today_button = ModernButton(text="HOY", size_hint_x=0.25, button_type="primary")
        today_button.bind(on_press=self.set_today)
        self.add_widget(today_button)

    def set_today(self, instance):
        """Establecer la fecha de hoy"""
        self.selected_date = datetime.now().date()
        self.date_button.text = self.selected_date.strftime("%d/%m/%Y")

    def open_date_picker(self, instance):
        """Abrir el selector de fecha"""
        content = BoxLayout(orientation="vertical", spacing=dp(10), padding=dp(10))

        # Título
        title_label = ModernLabel(
            text="Seleccionar Fecha",
            size_hint_y=None,
            height=dp(40),
            label_type="subtitle",
        )
        content.add_widget(title_label)

        # Controles de navegación del mes/año
        nav_layout = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(50)
        )

        # Botón mes anterior
        prev_month_btn = ModernButton(
            text="<", size_hint_x=0.2, button_type="secondary"
        )
        prev_month_btn.bind(on_press=lambda x: self.change_month(-1))
        nav_layout.add_widget(prev_month_btn)

        # Spinner para mes
        months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ]
        self.month_spinner = ModernSpinner(
            text=months[self.selected_date.month - 1], values=months, size_hint_x=0.4
        )
        nav_layout.add_widget(self.month_spinner)

        # Spinner para año
        current_year = self.selected_date.year
        years = [str(year) for year in range(current_year - 5, current_year + 2)]
        self.year_spinner = ModernSpinner(
            text=str(self.selected_date.year), values=years, size_hint_x=0.2
        )
        nav_layout.add_widget(self.year_spinner)

        # Botón mes siguiente
        next_month_btn = ModernButton(
            text=">", size_hint_x=0.2, button_type="secondary"
        )
        next_month_btn.bind(on_press=lambda x: self.change_month(1))
        nav_layout.add_widget(next_month_btn)

        content.add_widget(nav_layout)

        # Grid del calendario
        self.calendar_grid = GridLayout(cols=7, spacing=dp(2))

        # Días de la semana
        weekdays = ["L", "M", "X", "J", "V", "S", "D"]
        for day in weekdays:
            label = ModernLabel(
                text=day, size_hint_y=None, height=dp(30), label_type="secondary"
            )
            self.calendar_grid.add_widget(label)

        self.update_calendar_grid()
        content.add_widget(self.calendar_grid)

        # Botones de acción
        button_layout = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(50), spacing=dp(10)
        )

        cancel_button = ModernButton(
            text="Cancelar", size_hint_x=0.5, button_type="danger"
        )

        ok_button = ModernButton(text="Aceptar", size_hint_x=0.5, button_type="success")

        button_layout.add_widget(cancel_button)
        button_layout.add_widget(ok_button)
        content.add_widget(button_layout)

        # Crear popup
        self.date_popup = Popup(
            title="Seleccionar Fecha",
            content=content,
            size_hint=(0.9, 0.8),
            auto_dismiss=False,
        )

        # Bind events
        cancel_button.bind(on_press=self.date_popup.dismiss)
        ok_button.bind(on_press=self.confirm_date)
        self.month_spinner.bind(text=self.on_month_year_change)
        self.year_spinner.bind(text=self.on_month_year_change)

        self.date_popup.open()

    def change_month(self, delta):
        """Cambiar mes"""
        # Convertir nombres de meses en español
        months_es = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ]
        current_month = months_es.index(self.month_spinner.text) + 1
        current_year = int(self.year_spinner.text)

        new_month = current_month + delta
        new_year = current_year

        if new_month > 12:
            new_month = 1
            new_year += 1
        elif new_month < 1:
            new_month = 12
            new_year -= 1

        self.month_spinner.text = months_es[new_month - 1]
        self.year_spinner.text = str(new_year)
        self.update_calendar_grid()

    def on_month_year_change(self, instance, value):
        """Actualizar calendario cuando cambia mes o año"""
        self.update_calendar_grid()

    def update_calendar_grid(self):
        """Actualizar el grid del calendario"""
        # Limpiar días anteriores
        children_to_remove = [
            child for child in self.calendar_grid.children if isinstance(child, Button)
        ]
        for child in children_to_remove:
            self.calendar_grid.remove_widget(child)

        # Obtener mes y año seleccionados
        months_es = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ]
        month = months_es.index(self.month_spinner.text) + 1
        year = int(self.year_spinner.text)

        # Obtener primer día del mes y número de días
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # Calcular días a mostrar
        start_weekday = first_day.weekday()  # 0 = Monday

        # Agregar días vacíos al inicio
        for _ in range(start_weekday):
            empty_label = Label(text="")
            self.calendar_grid.add_widget(empty_label)

        # Agregar días del mes
        for day in range(1, last_day.day + 1):
            day_date = date(year, month, day)

            # Determinar el tipo de botón según si está seleccionado
            button_type = "primary" if day_date == self.selected_date else "secondary"

            day_button = ModernButton(
                text=str(day), size_hint_y=None, height=dp(40), button_type=button_type
            )

            day_button.bind(on_press=lambda x, d=day_date: self.select_date(d))
            self.calendar_grid.add_widget(day_button)

    def select_date(self, selected_date):
        """Seleccionar una fecha específica"""
        self.selected_date = selected_date
        self.update_calendar_grid()

    def confirm_date(self, instance):
        """Confirmar la fecha seleccionada"""
        self.date_button.text = self.selected_date.strftime("%d/%m/%Y")
        self.date_popup.dismiss()

    def get_date(self):
        """Obtener la fecha seleccionada"""
        return self.selected_date


class ExpenseForm(BoxLayout):
    def __init__(self, categories=None, client=None, **kwargs):
        super().__init__(**kwargs)
        # Use the client passed from the app
        self.client = client or ExpensyClient()
        
        # Store categories in memory
        self.categories = categories or [
            {"id": 1, "name": "Hogar"},
            {"id": 2, "name": "Comidas y bebidas"},
            {"id": 3, "name": "Salud y cuidado personal"},
            {"id": 4, "name": "Supermercado"},
        ]
        # Extract category names for the spinner
        self.category_names = [cat["name"] for cat in self.categories]
        # Create a mapping from name to id for later use
        self.category_name_to_id = {cat["name"]: cat["id"] for cat in self.categories}
        self.orientation = "vertical"
        self.spacing = dp(2)
        self.padding = dp(20)
        # Establecer el fondo de la app
        with self.canvas.before:
            Color(*COLORS["background"])
            self.rect = RoundedRectangle(pos=self.pos, size=self.size)
        self.bind(pos=self.update_bg, size=self.update_bg)

        # Título
        title = ModernLabel(
            text="$ EXPENSY",
            size_hint_y=None,
            height=dp(60),
            label_type="title",
            halign="center",
        )
        title.text_size = (None, None)
        self.add_widget(title)

        subtitle = ModernLabel(
            text="Gestiona tus gastos e ingresos",
            size_hint_y=None,
            height=dp(30),
            label_type="secondary",
            halign="center",
        )
        subtitle.text_size = (None, None)
        self.add_widget(subtitle)

        # Card container para el formulario
        form_card = ModernCard(orientation="vertical")
        # Crear scroll view para el formulario
        scroll = ScrollView()
        form_layout = BoxLayout(
            orientation="vertical",
            spacing=dp(20),
            size_hint_y=None,
            padding=[0, dp(10), 0, dp(10)],
        )
        form_layout.bind(minimum_height=form_layout.setter("height"))

        # Campo Descripción
        desc_section = BoxLayout(
            orientation="vertical", spacing=dp(8), size_hint_y=None, height=dp(80)
        )
        # Contenedor para alineación izquierda
        desc_label_container = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(25)
        )
        desc_label = ModernLabel(text="Descripción", label_type="primary")
        desc_label.size_hint_x = None
        desc_label.width = dp(100)
        desc_label.size_hint_y = None
        desc_label.height = dp(25)

        desc_label_container.add_widget(desc_label)
        desc_label_container.add_widget(BoxLayout())  # Spacer para empujar
        desc_section.add_widget(desc_label_container)

        self.description_input = ModernTextInput(
            multiline=False,
            size_hint_y=None,
            height=dp(50),
            hint_text="Describe el gasto o ingreso",
        )
        desc_section.add_widget(self.description_input)
        form_layout.add_widget(desc_section)

        # Tipo: Gasto o Ingreso
        type_section = BoxLayout(
            orientation="vertical", spacing=dp(8), size_hint_y=None, height=dp(80)
        )
        # Contenedor para alineación izquierda
        type_label_container = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(25)
        )
        type_label = ModernLabel(text="Tipo", label_type="primary")
        type_label.size_hint_x = None
        type_label.width = dp(60)
        type_label.size_hint_y = None
        type_label.height = dp(25)

        type_label_container.add_widget(type_label)
        type_label_container.add_widget(BoxLayout())  # Spacer
        type_section.add_widget(type_label_container)

        type_layout = BoxLayout(
            orientation="horizontal", spacing=dp(10), size_hint_y=None, height=dp(50)
        )

        # Crear botones de toggle personalizados
        self.expense_toggle = ModernExpenseToggle(
            text="Gasto", group="type", state="down", size_hint_x=0.5
        )
        self.income_toggle = ModernIncomeToggle(
            text="Ingreso", group="type", size_hint_x=0.5
        )

        type_layout.add_widget(self.expense_toggle)
        type_layout.add_widget(self.income_toggle)
        type_section.add_widget(type_layout)
        form_layout.add_widget(type_section)

        # Campo Monto
        amount_section = BoxLayout(
            orientation="vertical", spacing=dp(8), size_hint_y=None, height=dp(80)
        )
        # Contenedor para alineación izquierda
        amount_label_container = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(25)
        )
        amount_label = ModernLabel(text="Monto", label_type="primary")
        amount_label.size_hint_x = None
        amount_label.width = dp(70)
        amount_label.size_hint_y = None
        amount_label.height = dp(25)

        amount_label_container.add_widget(amount_label)
        amount_label_container.add_widget(BoxLayout())  # Spacer
        amount_section.add_widget(amount_label_container)

        self.amount_input = ModernTextInput(
            multiline=False,
            size_hint_y=None,
            height=dp(50),
            input_filter="float",
            hint_text="0.00",
        )
        amount_section.add_widget(self.amount_input)
        form_layout.add_widget(amount_section)

        # Campo Fecha
        date_section = BoxLayout(
            orientation="vertical", spacing=dp(8), size_hint_y=None, height=dp(80)
        )
        # Contenedor para alineación izquierda
        date_label_container = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(25)
        )
        date_label = ModernLabel(text="Fecha", label_type="primary")
        date_label.size_hint_x = None
        date_label.width = dp(70)
        date_label.size_hint_y = None
        date_label.height = dp(25)

        date_label_container.add_widget(date_label)
        date_label_container.add_widget(BoxLayout())  # Spacer
        date_section.add_widget(date_label_container)

        self.date_picker = DatePickerWidget(size_hint_y=None, height=dp(50))
        date_section.add_widget(self.date_picker)
        form_layout.add_widget(date_section)

        # Campo Categoría
        category_section = BoxLayout(
            orientation="vertical", spacing=dp(8), size_hint_y=None, height=dp(80)
        )
        # Contenedor para alineación izquierda
        category_label_container = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(25)
        )
        category_label = ModernLabel(text="Categoría", label_type="primary")
        category_label.size_hint_x = None
        category_label.width = dp(90)
        category_label.size_hint_y = None
        category_label.height = dp(25)

        category_label_container.add_widget(category_label)
        category_label_container.add_widget(BoxLayout())  # Spacer
        category_section.add_widget(category_label_container)

        self.category_spinner = ModernSpinner(
            text=self.category_names[0],
            values=self.category_names,
            size_hint_y=None,
            height=dp(50),
        )
        category_section.add_widget(self.category_spinner)
        form_layout.add_widget(category_section)

        scroll.add_widget(form_layout)
        form_card.add_widget(scroll)
        self.add_widget(form_card)

        # Botones
        button_layout = BoxLayout(
            orientation="horizontal", size_hint_y=None, height=dp(60), spacing=dp(15)
        )

        save_button = ModernButton(
            text="GUARDAR", size_hint_x=0.6, button_type="success"
        )
        save_button.bind(on_press=self.save_record)

        clear_button = ModernButton(
            text="LIMPIAR", size_hint_x=0.4, button_type="secondary"
        )
        clear_button.bind(on_press=self.clear_form)

        button_layout.add_widget(save_button)
        button_layout.add_widget(clear_button)
        self.add_widget(button_layout)

    def update_bg(self, *args):
        """Update background rectangle"""
        self.rect.pos = self.pos
        self.rect.size = self.size

    def save_record(self, instance):
        # Validate required fields
        if not self.description_input.text.strip():
            self.show_popup("Error", "La descripción es obligatoria")
            return

        if not self.amount_input.text.strip():
            self.show_popup("Error", "El monto es obligatorio")
            return

        try:
            amount = float(self.amount_input.text)
            if amount <= 0:
                self.show_popup("Error", "El monto debe ser mayor a 0")
                return
        except ValueError:
            self.show_popup("Error", "El monto debe ser un número válido")
            return

        # Get selected date
        selected_date = self.date_picker.get_date()

        # Get category ID from the selected category name
        selected_category_name = self.category_spinner.text
        category_id = self.category_name_to_id.get(selected_category_name, 1)

        # Prepare record data for the API
        record_data = {
            "description": self.description_input.text.strip(),
            "amount": amount,
            "source": SOURCE_FIELD,
            "date": selected_date.strftime("%Y-%m-%d"),
            "category": category_id
        }

        try:
            # Create record using ExpensyClient
            self.client.create_record(record_data)
            
            # Show success message
            message = f"""Registro guardado exitosamente:

Descripción: {record_data['description']}
Monto: ${record_data['amount']:.2f}
Fecha: {selected_date.strftime("%d/%m/%Y")}
Categoría: {selected_category_name}"""

            self.show_popup("Éxito", message)
            self.clear_form(None)
            
        except Exception as e:
            # Show error message
            error_message = f"Error al guardar el registro: {str(e)}"
            self.show_popup("Error", error_message)

    def clear_form(self, instance):
        """Limpiar todos los campos del formulario"""
        self.description_input.text = ""
        self.amount_input.text = ""
        self.expense_toggle.state = "down"
        self.income_toggle.state = "normal"

        # Restablecer fecha a hoy
        self.date_picker.set_today(None)

        # Restablecer categoría
        self.category_spinner.text = self.category_names[0]

    def show_popup(self, title, message):
        """Mostrar popup con mensaje moderno"""
        content = ModernCard(orientation="vertical")

        # Icono según el tipo
        if "éxito" in title.lower():
            icon = "[OK]"
        elif "error" in title.lower():
            icon = "[!]"
        else:
            icon = "[i]"

        title_with_icon = ModernLabel(
            text=f"{icon} {title}",
            label_type="subtitle",
            size_hint_y=None,
            height=dp(40),
            halign="center",
        )
        title_with_icon.text_size = (dp(300), None)
        content.add_widget(title_with_icon)

        label = ModernLabel(
            text=message,
            text_size=(dp(300), None),
            halign="center",
            valign="middle",
            label_type="primary",
        )
        content.add_widget(label)

        close_button = ModernButton(
            text="CERRAR", size_hint_y=None, height=dp(50), button_type="primary"
        )
        content.add_widget(close_button)

        popup = Popup(
            title="",
            content=content,
            size_hint=(0.85, 0.6),
            auto_dismiss=False,
            separator_height=0,
        )

        close_button.bind(on_press=popup.dismiss)
        popup.open()


class ExpensyApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.categories = []
        self.categories_loaded = False
        # Initialize ExpensyClient once for the entire app
        self.client = ExpensyClient()

    def load_categories(self):
        """Load categories from the REST API"""
        try:
            self.categories = self.client.get_categories()
            self.categories_loaded = True
            print(f"Loaded {len(self.categories)} categories from API")
        except Exception as e:
            print(f"Error loading categories: {e}")
            # Fallback to default categories
            self.categories = [
                {"id": 1, "name": "Hogar"},
                {"id": 2, "name": "Comidas y bebidas"},
                {"id": 3, "name": "Salud y cuidado personal"},
                {"id": 4, "name": "Supermercado"},
            ]
            self.categories_loaded = True

    def build(self):
        self.title = "Expensy - Gestor de Gastos e Ingresos"
        # Load categories before building the UI
        self.load_categories()
        return ExpenseForm(categories=self.categories, client=self.client)


if __name__ == "__main__":
    ExpensyApp().run()
