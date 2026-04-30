# Diagrama UML de la Base de Datos - PixelMarket

Este documento contiene la representación visual y técnica de la base de datos del proyecto **PixelMarket**, detallando las entidades, sus atributos y las relaciones entre ellas.

## Modelo de Clases (Mermaid)

```mermaid
classDiagram
    class User {
        +id : bigint
        +name : string
        +email : string
        +password : string
        +google_id : string?
        +avatar : string?
        +dino_high_score : int
        +email_verified_at : timestamp?
        +timestamps()
    }

    class Game {
        +id : bigint
        +name : string
        +description : text?
        +cover_image : string?
        +is_visible : boolean
        +timestamps()
    }

    class Store {
        +id : bigint
        +name : string
        +timestamps()
    }

    class GamePrice {
        +id : bigint
        +game_id : bigint (FK)
        +store_id : bigint (FK)
        +price : decimal
        +url_link : string
        +timestamps()
    }

    class Genre {
        +id : bigint
        +name : string
        +timestamps()
    }

    class Wishlist {
        +user_id : bigint (FK)
        +game_id : bigint (FK)
        +timestamps()
    }

    class GameGenre {
        +game_id : bigint (FK)
        +genre_id : bigint (FK)
    }

    %% Relaciones
    User "1" -- "*" Wishlist : tiene en
    Game "1" -- "*" Wishlist : aparece en
    Game "1" -- "*" GamePrice : tiene
    Store "1" -- "*" GamePrice : ofrece
    Game "1" -- "*" GameGenre : se clasifica en
    Genre "1" -- "*" GameGenre : contiene

    %% Relaciones Lógicas (Muchos a Muchos)
    User "*" -- "*" Game : Wishlist
    Game "*" -- "*" Genre : GameGenre
```

## Descripción de las Entidades

### 1. Usuarios (`users`)
Gestiona la autenticación y el perfil del usuario.
- Soporta inicio de sesión tradicional y **Google OAuth**.
- Almacena el `dino_high_score` para el minijuego integrado.

### 2. Videojuegos (`games`)
La entidad central del catálogo.
- Contiene metadatos como el nombre, descripción y la imagen de portada.
- El campo `is_visible` permite al administrador ocultar artículos sin borrarlos.

### 3. Precios y Tiendas (`game_prices` & `stores`)
- **Store:** Almacena los nombres de las tiendas (Steam, Epic, etc.).
- **GamePrice:** Es una tabla relacional que vincula un juego con una tienda, añadiendo el precio actual y el enlace directo de compra extraído por el scraper.

### 4. Géneros (`genres`)
Define las categorías de los juegos. Se relaciona con los juegos mediante una tabla pivote (`game_genre`), permitiendo que un juego tenga múltiples etiquetas (ej: "Acción", "Aventura", "RPG").

### 5. Lista de Deseos (`wishlists`)
Relación muchos a muchos que permite a los usuarios guardar sus juegos preferidos para consultas rápidas.
