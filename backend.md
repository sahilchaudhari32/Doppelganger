# StyleForge Backend Requirements Specification

Based on the Phase 2 Hub & Spoke Community Model frontend, this document outlines the definitive requirements for the backend infrastructure. It is divided into two parts: the **Pure Backend API** and the **Database Design**.

---

## PART 1: PURE BACKEND (API ENDPOINTS)

### 1. Authentication & User Identity
- **`POST /api/auth/register`**
  - **Purpose:** Create a new user account.
  - **Payload:** `{ username, email, password }`
  - **Response:** `{ token, user: { id, username, email } }`
- **`POST /api/auth/login`**
  - **Purpose:** Authenticate an existing user.
  - **Payload:** `{ email, password }`
  - **Response:** `{ token, user: { id, username, email, biometrics: null, savedOutfits: [] } }`
- **`GET /api/users/me`**
  - **Purpose:** Hydrate the frontend `AuthContext` on page load.
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Full User object with populated `biometrics` and `savedOutfits` arrays.

### 2. Biometric Data (Smart Mirror Gateway)
- **`PUT /api/users/me/biometrics`**
  - **Purpose:** Update the user's physical coordinate vector. The frontend intercepts Virtual Try-On requests if this data is absent.
  - **Headers:** `Authorization: Bearer <token>`
  - **Payload:** `{ height, weight, shoulderWidth, waist }`
  - **Response:** `{ success: true, biometrics: { ...updated_data } }`

### 3. Style Generation & AI Engine
- **`POST /api/analyze/upload`**
  - **Purpose:** Process inspiration image and return generated style vectors and recommendations.
  - **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
  - **Payload:** Form data containing `image`.
  - **Response:** 
    ```json
    {
      "analysis_result": { "detected_styles": ["cyberpunk"], "color_palette": ["#FF00FF"] },
      "recommendations": [ ...array of generated product/design objects... ]
    }
    ```

### 4. Social & Wardrobe Network
- **`POST /api/users/me/saved`**
  - **Purpose:** Save an AI-generated or community design to the user's private wardrobe.
  - **Payload:** `{ design_id }`
- **`DELETE /api/users/me/saved/:designId`**
  - **Purpose:** Remove an item from the private wardrobe.
- **`POST /api/designs/:designId/publish`**
  - **Purpose:** Push a privately owned/generated design to the public Community Feed.
- **`GET /api/community/feed`**
  - **Purpose:** Fetch a paginated list of published designs.
  - **Query:** `?page=1&limit=20&sort=newest`

### 5. Virtual Try-On Engine
- **`POST /api/try-on/generate`**
  - **Purpose:** Pass the user's server-stored biometrics and the target `product_id` to the 3D rendering pipeline.
  - **Payload:** `{ product_id }`
  - **Response:** Returns a URL to the generated 3D model snippet or static rendering of the final fit.

---

## PART 2: DATABASE DESIGN (MySQL Primary + MongoDB Hybrid Consideration)

The primary database is **MySQL**. The relational structure is well-suited for Users, Authentication, and Social/Community features (Likes, Feed generation). However, handling complex embedding vectors from the AI engine might be better suited for **MongoDB** (or a specialized vector DB) if MySQL proves too rigid for similarity searches. 

Here is the recommended schema mapping:

### 1. `users` Table (MySQL)
Stores core identity and authentication.
* `id` (INT / UUID, Primary Key)
* `username` (VARCHAR(50), Unique)
* `email` (VARCHAR(255), Unique)
* `password_hash` (VARCHAR(255))
* `level` (INT, Default: 1)
* `joined_date` (DATETIME, Default: CURRENT_TIMESTAMP)
* `biometrics_height` (FLOAT, Nullable)
* `biometrics_weight` (FLOAT, Nullable)
* `biometrics_shoulder` (FLOAT, Nullable)
* `biometrics_waist` (FLOAT, Nullable)
*(Note: Separating biometrics into distinct columns is standard for MySQL rather than using a JSON blob, allowing for easier querying if needed, e.g., "find users with height > 180").*

### 2. `designs` Table (MySQL)
Represents individual fashion items (either system catalog or user-published).
* `id` (INT / UUID, Primary Key)
* `name` (VARCHAR(255))
* `image_url` (VARCHAR(500))
* `author_id` (INT, Foreign Key -> users.id. Nullable if system-generated)
* `is_published` (BOOLEAN, Default: FALSE)
* `likes_count` (INT, Default: 0)
* `created_at` (DATETIME, Default: CURRENT_TIMESTAMP)

### 3. `design_tags` Junction Table (MySQL)
Since designs have arrays of tags (e.g., ["cyber-chrome", "outerwear"]), a relational junction table is required in MySQL.
* `design_id` (Foreign Key -> designs.id)
* `tag_name` (VARCHAR(50))
*(Composite Primary Key: design_id, tag_name)*

### 4. `saved_wardrobes` Junction Table (MySQL)
Maps users to the designs they have saved (many-to-many relationship).
* `user_id` (Foreign Key -> users.id)
* `design_id` (Foreign Key -> designs.id)
* `saved_at` (DATETIME, Default: CURRENT_TIMESTAMP)

### 5. `community_feed` View / Table (MySQL)
To serve the `/community` route quickly without heavy JOINs, you can create a Materialized View or a specific cached table summarizing published designs.
* `design_id` (Foreign Key -> designs.id)
* `author_username` (VARCHAR - Denormalized for speed)
* `published_at` (DATETIME)

---

### *ARCHITECTURAL NOTE: When to consider MongoDB / NoSQL?*

While **MySQL** handles the above perfectly, the **AI generation engine** relies heavily on high-dimensional features/tags output by the AI model. 

**If you need to perform "Find visually similar outfits" operations:**
1. **Option A (Pure MySQL):** Store the vector as a `JSON` data type. However, calculating cosine similarity directly inside a MySQL query across millions of rows is extremely slow.
2. **Option B (Hybrid MongoDB/Vector DB) [RECOMMENDED]:** Keep Users/Auth/Wardrobes in MySQL, but store the actual generated `Products/Designs` in MongoDB (which supports fast unstructured document lookups and arrays natively). Better yet, use a dedicated vector database (like Pinecone, Qdrant, or Atlas Vector Search on MongoDB) *specifically* to index the `aesthetic_vector` so the recommendation engine runs in milliseconds instead of lagging the SQL server.
