# Node Selynt
*Open-source alternative to PM2 Plus*  
*Alternativa open-source ao PM2 Plus*

> **Nota / Note:** Projeto **não afiliado** ao PM2/pm2.io.  
> **Not affiliated** with PM2/pm2.io.

---

## 🇧🇷 Português

### MOTIVAÇÃO
O **Node Selynt** nasce como continuação comunitária do **pm2-webui**, que ficou **sem manutenção por anos**, deixando **dependências desatualizadas** e **risco de segurança** em pacotes. Este repositório visa:
- Atualizar e auditar dependências;
- Corrigir bugs pendentes;
- Modernizar a interface;
- Manter releases estáveis e seguras.

### RECURSOS
- Login seguro :white_check_mark:
- Gerenciamento de aplicações :white_check_mark:
- Visualizador de logs :white_check_mark:
- Interface responsiva :white_check_mark:
- Deploy manual e automático (webhooks do GitHub)
- Gerenciamento de variáveis de ambiente

### USO
```bash
git clone https://github.com/craftgamesof/node-selynt
cd node-selynt
npm install
cp env.example .env
npm run setup-admin-user   # Necessário para login
npm start
````

### DESENVOLVIMENTO

```bash
npm run start:dev
```

### TODO

* [ ] suporte a caminhos relativos
* [ ] usar fs-extra para operações de filesystem
* [ ] usar [jsonfile](https://www.npmjs.com/package/jsonfile) para configs
* [ ] substituir exec.util por [execa](https://www.npmjs.com/package/execa)
* [ ] adicionar gestão de env via formulário
* [ ] logs em tempo real
* [ ] visualizador de logs de deploy
* [ ] abortar deploy
* [ ] gatilhos de deploy
* [ ] terminal web
* [ ] estratégias de zero-downtime (blue-green, rolling etc.)
* [ ] provedor Docker*

### CAPTURAS DE TELA

![Node Selynt Login](/screenshots/login.png?raw=true "Node Selynt Login")
![Node Selynt Dashboard](/screenshots/dashboard.png?raw=true "Node Selynt Dashboard")
![Node Selynt App](/screenshots/app.png?raw=true "Node Selynt App")

### LICENÇA

MIT — Copyright (c) 2025 **Craft Games**
Trabalho original © 2022 **Surya T**

---

## 🇺🇸 English

### MOTIVATION

**Node Selynt** is a community-driven continuation of **pm2-webui**, which went **unmaintained for years**, leaving **outdated dependencies** and **security risk** across packages. This repository aims to:

* Update and audit dependencies;
* Fix long-standing bugs;
* Modernize the UI;
* Ship stable and secure releases.

### FEATURES

* Secure login :white_check_mark:
* Application management :white_check_mark:
* Log viewer :white_check_mark:
* Responsive UI :white_check_mark:
* Manual and automatic deployment (GitHub webhooks)
* Environment variables management

### USAGE

```bash
git clone https://github.com/craftgamesof/node-selynt
cd node-selynt
npm install
cp env.example .env
npm run setup-admin-user   # Required for login
npm start
```

### FOR DEVELOPMENT

```bash
npm run start:dev
```

### TODO

* [ ] support relative paths
* [ ] use fs-extra for filesystem ops
* [ ] use [jsonfile](https://www.npmjs.com/package/jsonfile) for config
* [ ] replace exec.util with [execa](https://www.npmjs.com/package/execa)
* [ ] add form-based env management
* [ ] realtime logs
* [ ] deployment log viewer
* [ ] deployment abort
* [ ] deployment triggers
* [ ] web terminal
* [ ] zero-downtime strategies (blue-green, rolling, etc.)
* [ ] docker provider*

### SCREENSHOTS

![Node Selynt Login](/screenshots/login.png?raw=true "Node Selynt Login")
![Node Selynt Dashboard](/screenshots/dashboard.png?raw=true "Node Selynt Dashboard")
![Node Selynt App](/screenshots/app.png?raw=true "Node Selynt App")

### LICENSE

MIT — Copyright (c) 2025 **Craft Games**
Original work © 2022 **Surya T**