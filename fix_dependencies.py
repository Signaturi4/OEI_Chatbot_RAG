#!/usr/bin/env python3
"""
Fix script for dependency issues
"""
import subprocess
import sys
import os

def run_command(command):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def fix_dependencies():
    """Fix Python dependencies"""
    print("🔧 Fixing Python dependencies...")
    
    # Upgrade pip
    print("📦 Upgrading pip...")
    success, stdout, stderr = run_command("python -m pip install --upgrade pip")
    if not success:
        print(f"❌ Failed to upgrade pip: {stderr}")
        return False
    
    # Install/upgrade specific packages
    packages = [
        "openai>=1.0.0",
        "langchain-openai>=0.1.0",
        "langchain-community>=0.2.0",
        "langchain-core>=0.2.0",
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "supabase>=2.0.0",
        "python-dotenv>=1.0.0",
        "pydantic>=2.0.0"
    ]
    
    for package in packages:
        print(f"📦 Installing {package}...")
        success, stdout, stderr = run_command(f"pip install {package}")
        if not success:
            print(f"⚠️  Warning: Failed to install {package}: {stderr}")
        else:
            print(f"✅ Successfully installed {package}")
    
    return True

def test_imports():
    """Test if the backend can be imported"""
    print("\n🧪 Testing imports...")
    
    try:
        import main
        print("✅ Backend imports successfully!")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting dependency fix...")
    
    # Change to backend directory
    if os.path.exists("backend"):
        os.chdir("backend")
        print("📁 Changed to backend directory")
    
    # Fix dependencies
    if fix_dependencies():
        print("\n✅ Dependencies fixed!")
        
        # Test imports
        if test_imports():
            print("\n🎉 All fixes applied successfully!")
            print("You can now run: python -m uvicorn main:app --reload")
        else:
            print("\n⚠️  Dependencies fixed but imports still failing.")
            print("Try running: pip install -r requirements.txt")
    else:
        print("\n❌ Failed to fix dependencies.")
        print("Try running: pip install -r requirements.txt")

