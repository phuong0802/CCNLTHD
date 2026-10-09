# Sơ đồ Cơ sở Dữ liệu - Mermaid ERD

## Sơ đồ ERD đầy đủ

```mermaid
erDiagram
    users ||--o{ tasks : "owns"
    
    users {
        int id PK "Khóa chính, tự tăng"
        varchar username UK "Tên đăng nhập (unique)"
        varchar email UK "Email (unique)"
        varchar password_hash "Mật khẩu đã băm (bcrypt)"
        timestamp created_at "Thời điểm tạo tài khoản"
    }
    
    tasks {
        int id PK "Khóa chính, tự tăng"
        int user_id FK "Khóa ngoại tham chiếu users.id"
        varchar title "Tiêu đề công việc"
        text description "Mô tả chi tiết (nullable)"
        enum status "TODO, IN_PROGRESS, COMPLETED"
        enum priority "LOW, MEDIUM, HIGH"
        date due_date "Hạn hoàn thành (nullable)"
        timestamp created_at "Thời điểm tạo"
        timestamp updated_at "Thời điểm cập nhật"
    }
```

---

## Sơ đồ đơn giản (cho slide thuyết trình)

```mermaid
erDiagram
    users ||--o{ tasks : owns
    
    users {
        int id
        string username
        string email
        string password_hash
    }
    
    tasks {
        int id
        int user_id
        string title
        string description
        string status
        string priority
        date due_date
    }
```

---

## Sơ đồ với index và constraints

```mermaid
erDiagram
    users ||--o{ tasks : "1 user có nhiều tasks"
    
    users {
        int id PK "AUTO_INCREMENT"
        varchar(50) username UK "NOT NULL"
        varchar(100) email UK "NOT NULL"
        varchar(255) password_hash "NOT NULL"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    tasks {
        int id PK "AUTO_INCREMENT"
        int user_id FK "ON DELETE CASCADE"
        varchar(255) title "NOT NULL"
        text description "NULL"
        enum status "DEFAULT 'TODO'"
        enum priority "DEFAULT 'MEDIUM'"
        date due_date "NULL"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "ON UPDATE CURRENT_TIMESTAMP"
    }
```

---

## Sơ đồ với mô tả quan hệ

```mermaid
erDiagram
    users ||--o{ tasks : "Một user sở hữu nhiều tasks"
    
    users {
        int id "ID tự tăng"
        varchar username "Unique, 3-50 ký tự"
        varchar email "Unique, format email"
        varchar password_hash "Bcrypt hashed, saltRounds=10"
        timestamp created_at
    }
    
    tasks {
        int id "ID tự tăng"
        int user_id "Tham chiếu users.id"
        varchar title "Bắt buộc, max 255 chars"
        text description "Tùy chọn"
        enum status "TODO|IN_PROGRESS|COMPLETED"
        enum priority "LOW|MEDIUM|HIGH"
        date due_date "Tùy chọn, format YYYY-MM-DD"
        timestamp created_at "Auto-generated"
        timestamp updated_at "Auto-update on change"
    }
```

---

## Sơ đồ với dữ liệu mẫu (cho demo)

```mermaid
erDiagram
    users ||--o{ tasks : owns
    
    users {
        int id
        varchar username
        varchar email
        varchar password_hash
        timestamp created_at
    }
    
    tasks {
        int id
        int user_id
        varchar title
        text description
        enum status
        enum priority
        date due_date
        timestamp created_at
        timestamp updated_at
    }
```

**Dữ liệu mẫu:**

**Bảng users:**
| id | username | email |
|----|----------|-------|
| 1 | nguyenvana | nguyenvana@example.com |
| 2 | tranthib | tranthib@example.com |

**Bảng tasks:**
| id | user_id | title | status | priority |
|----|---------|-------|--------|----------|
| 1 | 1 | Hoàn thành báo cáo Express.js | IN_PROGRESS | HIGH |
| 2 | 1 | Nghiên cứu Middleware | COMPLETED | MEDIUM |
| 3 | 2 | Học Node.js cơ bản | COMPLETED | HIGH |

---

## Sơ đồ với các index

```mermaid
erDiagram
    users ||--o{ tasks : "user_id FK"
    
    users {
        int id PK
        varchar username "idx_users_username"
        varchar email "idx_users_email"
        varchar password_hash
        timestamp created_at
    }
    
    tasks {
        int id PK
        int user_id "idx_tasks_user_id, idx_tasks_user_status"
        varchar title
        text description
        enum status "idx_tasks_status, idx_tasks_user_status"
        enum priority "idx_tasks_priority, idx_tasks_user_priority"
        date due_date "idx_tasks_due_date"
        timestamp created_at "idx_tasks_created_at"
        timestamp updated_at
    }
```

**Các index được tạo:**
- `idx_users_username` trên `users.username`
- `idx_users_email` trên `users.email`
- `idx_tasks_user_id` trên `tasks.user_id`
- `idx_tasks_status` trên `tasks.status`
- `idx_tasks_priority` trên `tasks.priority`
- `idx_tasks_due_date` trên `tasks.due_date`
- `idx_tasks_created_at` trên `tasks.created_at`
- `idx_tasks_user_status` trên `(user_id, status)` - composite
- `idx_tasks_user_priority` trên `(user_id, priority)` - composite

---

## Sơ đồ tiếng Việt (cho báo cáo)

```mermaid
erDiagram
    NguoiDung ||--o{ CongViec : "sở hữu"
    
    NguoiDung {
        int id "Mã người dùng"
        varchar ten_dang_nhap "Tên đăng nhập"
        varchar email "Địa chỉ email"
        varchar mat_khau_da_bam "Mật khẩu đã mã hóa"
        timestamp ngay_tao "Ngày tạo tài khoản"
    }
    
    CongViec {
        int id "Mã công việc"
        int nguoi_dung_id "Mã người sở hữu"
        varchar tieu_de "Tiêu đề công việc"
        text mo_ta "Mô tả chi tiết"
        enum trang_thai "Trạng thái (TODO/IN_PROGRESS/COMPLETED)"
        enum muc_uu_tien "Mức độ ưu tiên (LOW/MEDIUM/HIGH)"
        date han_hoan_thanh "Hạn hoàn thành"
        timestamp ngay_tao "Ngày tạo"
        timestamp ngay_cap_nhat "Ngày cập nhật"
    }
```

---

## Cách sử dụng trong báo cáo

### Trong file Markdown:

Chỉ cần copy code block trên và paste vào file `.md`:

\`\`\`mermaid
erDiagram
    users ||--o{ tasks : owns
    ...
\`\`\`

### Trong GitHub/GitLab:
Các nền tảng này tự động render Mermaid diagrams.

### Trong Word/PowerPoint:
1. Vào https://mermaid.live/
2. Paste code Mermaid vào
3. Export as PNG/SVG
4. Chèn vào Word/PowerPoint

### Trong LaTeX:
Sử dụng package `mermaid-cli`:
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagram.mmd -o diagram.png
```

---

## Giải thích ký hiệu

### Quan hệ (Cardinality):

| Ký hiệu | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| `||--o{` | One-to-Many | 1 user có nhiều tasks |
| `||--||` | One-to-One | 1 user có 1 profile |
| `}o--o{` | Many-to-Many | Many users - Many roles |

### Chú thích trường:

| Chú thích | Ý nghĩa |
|-----------|---------|
| `PK` | Primary Key (Khóa chính) |
| `FK` | Foreign Key (Khóa ngoại) |
| `UK` | Unique Key (Ràng buộc duy nhất) |

---

## Sơ đồ mở rộng (cho hướng phát triển tương lai)

```mermaid
erDiagram
    users ||--o{ tasks : owns
    users ||--o{ comments : writes
    tasks ||--o{ comments : has
    tasks }o--o{ tags : tagged_with
    
    users {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        timestamp created_at
    }
    
    tasks {
        int id PK
        int user_id FK
        varchar title
        text description
        enum status
        enum priority
        date due_date
        timestamp created_at
        timestamp updated_at
    }
    
    comments {
        int id PK
        int task_id FK
        int user_id FK
        text content
        timestamp created_at
    }
    
    tags {
        int id PK
        varchar name UK
    }
    
    task_tags {
        int task_id FK
        int tag_id FK
    }
```

---

## Lưu ý khi sử dụng

1. **Chọn sơ đồ phù hợp:**
   - Báo cáo chi tiết → Dùng sơ đồ đầy đủ với constraints
   - Slide thuyết trình → Dùng sơ đồ đơn giản
   - Demo → Dùng sơ đồ với dữ liệu mẫu

2. **Render Mermaid:**
   - GitHub/GitLab tự động render
   - Markdown viewers như Typora, VS Code preview
   - Online: https://mermaid.live/

3. **Export:**
   - PNG cho Word/PowerPoint
   - SVG cho chất lượng cao
   - PDF cho in ấn

---

## Tool hỗ trợ

- **Mermaid Live Editor**: https://mermaid.live/
- **VS Code Extension**: Markdown Preview Mermaid Support
- **CLI**: `npm install -g @mermaid-js/mermaid-cli`

---

Chúc bạn thành công với báo cáo! 🚀
