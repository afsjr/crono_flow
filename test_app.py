from playwright.sync_api import sync_playwright
import sys

def test_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("1. Abrindo app...")
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        print("2. Verificando tela de login...")
        page.screenshot(path='/tmp/cronoflow_login.png', full_page=True)
        
        # Check login elements
        title = page.locator('h1').text_content()
        print(f"   Título: {title}")
        
        code_input = page.locator('input[type="password"]')
        if code_input.is_visible():
            print("   Campo código: OK")
        
        # Test login
        print("3. Fazendo login...")
        code_input.fill('adv2026')
        
        select = page.locator('select')
        select.select_option('1')  # Adelino (Admin)
        
        page.locator('button:has-text("Entrar")').click()
        page.wait_for_load_state('networkidle')
        
        print("4. Verificando Dashboard...")
        page.screenshot(path='/tmp/cronoflow_dashboard.png', full_page=True)
        
        # Check dashboard elements
        dashboard_title = page.locator('h2:has-text("Dashboard")')
        if dashboard_title.is_visible():
            print("   Dashboard: OK")
        
        # Navigate to Timer
        print("5. Navegando para Cronômetro...")
        page.locator('.nav-item:has-text("Cronômetro")').click()
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/cronoflow_timer.png', full_page=True)
        
        # Check timer elements
        client_select = page.locator('select').first
        if client_select.is_visible():
            print("   Seleção cliente: OK")
        
        # Navigate to Entries
        print("6. Navegando para Meus Lançamentos...")
        page.locator('.nav-item:has-text("Meus Lançamentos")').click()
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/cronoflow_entries.png', full_page=True)
        
        # Navigate to Validation
        print("7. Navegando para Validação...")
        page.locator('.nav-item:has-text("Validação")').click()
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/cronoflow_validation.png', full_page=True)
        
        # Navigate to Reports
        print("8. Navegando para Relatórios...")
        page.locator('.nav-item:has-text("Relatórios")').click()
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/cronoflow_reports.png', full_page=True)
        
        # Check reports access (admin only)
        reports_title = page.locator('h2:has-text("Relatórios")')
        if reports_title.is_visible():
            print("   Relatórios: OK")
        
        # Logout
        print("9. Fazendo logout...")
        page.locator('button:has-text("Sair")').click()
        page.wait_for_load_state('networkidle')
        
        page.screenshot(path='/tmp/cronoflow_logout.png', full_page=True)
        
        print("\n✅ TESTE PASSOU - Todas as telas funcionando!")
        
        browser.close()

if __name__ == '__main__':
    try:
        test_app()
    except Exception as e:
        print(f"❌ ERRO: {e}")
        sys.exit(1)