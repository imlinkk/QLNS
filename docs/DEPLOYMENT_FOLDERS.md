# 📦 Các Folder Không Deploy Lên Production

Các folder sau đây **CHỈ dùng cho Development** và **KHÔNG** được deploy lên production server:

## 🚫 Folders Không Deploy

### 1. `/tests/` - Test Files

**Lý do:** Chứa các file test, debug, API testing

```
tests/
├── api_test.php
├── check_production.php
├── debug_request.php
├── test_api_call.html
├── test_db_connection.php
├── test_direct.php
├── test_login.html
└── test.php
```

### 2. `/docs/` - Documentation

**Lý do:** Tài liệu kỹ thuật cho developer, không cần thiết cho production

```
docs/
├── BACKEND_COMPLETE.md
├── FRONTEND_MVC.md
├── SETUP.md
└── STRUCTURE.md
```

### 3. `/CICDHow/` - CI/CD Documentation

**Lý do:** Hướng dẫn setup CI/CD, chứa thông tin nhạy cảm

```
CICDHow/
├── CICD_SETUP.md
├── CICDAccount (chứa credentials)
├── DEPLOYMENT.md
└── GITHUB_SECRETS.md
```

### 4. `/setup/` - Setup Scripts

**Lý do:** Script setup database và deployment, chỉ dùng lần đầu

```
setup/
├── install_db.php
├── setup_database.bat
└── test-deployment.sh
```

### 5. `/archive/` - Old/Archived Files

**Lý do:** Code cũ đã không dùng, giữ lại để tham khảo

```
archive/
├── assets_old/
└── modules_old/
```

---

## ✅ Folders Được Deploy

Chỉ những folder sau được deploy lên production:

```
/ (root)
├── index.html
├── index.php
├── backend/          ✅ API backend
│   ├── api.php
│   ├── autoload.php
│   ├── Config/
│   ├── Controllers/
│   ├── Core/
│   ├── Models/
│   └── Routes/
├── frontend/         ✅ JavaScript MVC
│   ├── app.js
│   ├── controllers/
│   ├── core/
│   ├── models/
│   └── views/
└── assets/          ✅ CSS, images, static files
    └── css/
```

---

## 🔧 Cấu Hình Trong Workflow

File: `.github/workflows/deploy.yml`

```yaml
- name: Prepare Files
  run: |
    # Remove unnecessary folders
    rm -rf deploy/tests
    rm -rf deploy/docs
    rm -rf deploy/CICDHow
    rm -rf deploy/setup
    rm -rf deploy/archive
    rm -rf deploy/.git
    rm -rf deploy/.github
    rm -f deploy/.gitignore
    rm -f deploy/README.md
```

---

## 📝 Lưu Ý

- Các folder này **VẪN được commit vào Git** để team có thể sử dụng
- **Chỉ bị loại bỏ** khi deploy lên production server
- Workflow `test.yml` sẽ chạy test trên các nhánh develop/feature
- Workflow `deploy.yml` chỉ chạy trên nhánh `main`

---

**Updated:** November 13, 2025
