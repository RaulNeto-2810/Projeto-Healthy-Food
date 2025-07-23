## 🛠️ Configuração do Ambiente

### Backend (Django)

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie um ambiente virtual Python:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Linux/macOS:
  ```bash
  source venv/bin/activate
  ```

4. Instale as dependências:
```bash
pip install -r requirements.txt
```

5. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

6. Execute as migrações:
```bash
python manage.py migrate
```

7. Inicie o servidor:
```bash
python manage.py runserver
```

### Frontend (React)

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```