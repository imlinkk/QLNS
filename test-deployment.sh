#!/bin/bash

# Production Deployment Test Script
# Run this before pushing to ensure everything works

echo "🧪 Testing HRM Application for Production Deployment"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name... "
    
    if eval $test_command > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1️⃣  PHP Syntax Check"
echo "----------------------------------------------------"

# Check all PHP files for syntax errors
echo "Scanning PHP files..."
PHP_FILES=$(find backend -name "*.php" 2>/dev/null)

if [ -z "$PHP_FILES" ]; then
    echo -e "${RED}❌ No PHP files found${NC}"
    ((TESTS_FAILED++))
else
    SYNTAX_OK=true
    for file in $PHP_FILES; do
        if ! php -l "$file" > /dev/null 2>&1; then
            echo -e "${RED}❌ Syntax error in: $file${NC}"
            php -l "$file"
            SYNTAX_OK=false
            ((TESTS_FAILED++))
        fi
    done
    
    if [ "$SYNTAX_OK" = true ]; then
        echo -e "${GREEN}✅ All PHP files have valid syntax${NC}"
        ((TESTS_PASSED++))
    fi
fi

echo ""
echo "2️⃣  File Structure Check"
echo "----------------------------------------------------"

# Check required files exist
run_test "index.html exists" "[ -f index.html ]"
run_test "backend/api.php exists" "[ -f backend/api.php ]"
run_test "backend/config/Database.php exists" "[ -f backend/config/Database.php ]"
run_test "frontend/app.js exists" "[ -f frontend/app.js ]"
run_test "assets/css/sitai.css exists" "[ -f assets/css/sitai.css ]"
run_test ".htaccess exists" "[ -f .htaccess ]"

echo ""
echo "3️⃣  Required Directories"
echo "----------------------------------------------------"

run_test "backend directory exists" "[ -d backend ]"
run_test "frontend directory exists" "[ -d frontend ]"
run_test "assets directory exists" "[ -d assets ]"
run_test "backend/models directory exists" "[ -d backend/models ]"
run_test "backend/controllers directory exists" "[ -d backend/controllers ]"
run_test "frontend/controllers directory exists" "[ -d frontend/controllers ]"

echo ""
echo "4️⃣  Database Configuration"
echo "----------------------------------------------------"

# Check if Database.php has production credentials
if grep -q "cdmidkxg_imlink_hrm" backend/config/Database.php 2>/dev/null; then
    echo -e "${GREEN}✅ Production database configured${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Warning: Database.php may not have production credentials${NC}"
    echo "   Current database name:"
    grep "DB_NAME" backend/config/Database.php | head -1
fi

echo ""
echo "5️⃣  Sensitive Files Check"
echo "----------------------------------------------------"

# Files that should NOT be deployed
SENSITIVE_FILES=("FTP.md" ".env" "credentials.txt" "passwords.txt")
FOUND_SENSITIVE=false

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${YELLOW}⚠️  Found sensitive file: $file (will be excluded)${NC}"
        FOUND_SENSITIVE=true
    fi
done

if [ "$FOUND_SENSITIVE" = false ]; then
    echo -e "${GREEN}✅ No sensitive files in root${NC}"
    ((TESTS_PASSED++))
fi

echo ""
echo "6️⃣  .htaccess Configuration"
echo "----------------------------------------------------"

if [ -f .htaccess ]; then
    if grep -q "RewriteEngine" .htaccess; then
        echo -e "${GREEN}✅ .htaccess has rewrite rules${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ .htaccess missing rewrite rules${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}❌ .htaccess file not found${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "7️⃣  JavaScript Modules Check"
echo "----------------------------------------------------"

JS_CONTROLLERS=$(find frontend/controllers -name "*.js" 2>/dev/null | wc -l)
JS_MODELS=$(find frontend/models -name "*.js" 2>/dev/null | wc -l)
JS_VIEWS=$(find frontend/views -name "*.js" 2>/dev/null | wc -l)

echo "Controllers: $JS_CONTROLLERS files"
echo "Models: $JS_MODELS files"
echo "Views: $JS_VIEWS files"

if [ $JS_CONTROLLERS -ge 8 ] && [ $JS_MODELS -ge 8 ]; then
    echo -e "${GREEN}✅ All JavaScript modules present${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Missing JavaScript modules${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "8️⃣  PHP Classes Check"
echo "----------------------------------------------------"

PHP_CONTROLLERS=$(find backend/controllers -name "*.php" 2>/dev/null | wc -l)
PHP_MODELS=$(find backend/models -name "*.php" 2>/dev/null | wc -l)

echo "Controllers: $PHP_CONTROLLERS files"
echo "Models: $PHP_MODELS files"

if [ $PHP_CONTROLLERS -ge 7 ] && [ $PHP_MODELS -ge 8 ]; then
    echo -e "${GREEN}✅ All PHP classes present${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Missing PHP classes${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "9️⃣  GitHub Workflow Check"
echo "----------------------------------------------------"

if [ -f .github/workflows/deploy-ftp.yml ]; then
    echo -e "${GREEN}✅ Deployment workflow configured${NC}"
    ((TESTS_PASSED++))
    
    # Check if workflow has FTP secrets configured
    if grep -q "FTP_SERVER\|FTP_USERNAME\|FTP_PASSWORD" .github/workflows/deploy-ftp.yml; then
        echo -e "${GREEN}✅ FTP secrets are referenced${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FTP secrets not configured in workflow${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}❌ Deployment workflow not found${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "🔟  File Size Check"
echo "----------------------------------------------------"

TOTAL_SIZE=$(du -sh . 2>/dev/null | awk '{print $1}')
echo "Total project size: $TOTAL_SIZE"

# Check for large files that might slow deployment
LARGE_FILES=$(find . -type f -size +5M 2>/dev/null)
if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✅ No files larger than 5MB${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Large files found:${NC}"
    echo "$LARGE_FILES"
fi

echo ""
echo "======================================================"
echo "📊 Test Results Summary"
echo "======================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}🚀 Ready for production deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Your message'"
    echo "3. git push origin fixByAlex"
    echo ""
    echo "Deployment will start automatically on GitHub Actions"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${RED}⚠️  Please fix the issues above before deploying${NC}"
    echo ""
    exit 1
fi
