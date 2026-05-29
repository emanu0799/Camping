# Campinho

Protótipo mobile-first para organizar camping em grupo.

## O que já existe

- App estático em `index.html`
- Checklist clicável
- Galeria de fotos simulada
- Grupo e tarefas
- Vinculo local do aparelho por nome + codigo da viagem
- Configuração PWA para instalar pelo navegador

## Rodar localmente

```powershell
node server.js
```

Depois abra:

```text
http://localhost:8787
```

## Banco Neon

1. Crie um projeto no Neon.
2. Copie a connection string.
3. Crie um arquivo `.env` baseado em `.env.example`.
4. Rode o SQL de `database/schema.sql` no editor SQL do Neon.

## Git

Quando o Git estiver instalado:

```powershell
git init
git checkout -b codex/neon-setup
git add .
git commit -m "Initial Campinho prototype with Neon schema"
```

Para publicar, crie um repositório no GitHub e conecte o remote:

```powershell
git remote add origin https://github.com/SEU_USUARIO/campinho.git
git push -u origin codex/neon-setup
```
