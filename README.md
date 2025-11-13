# Arc Blocks Explorer

Frontend moderno para visualização de blocos da rede Arc em tempo real, similar ao mempool.space do Bitcoin.

## 🚀 Funcionalidades

- **Visualização em Tempo Real**: Atualização automática a cada 2 segundos
- **Navegação de Blocos**: Visualize 3 blocos anteriores e 3 posteriores ao bloco atual
- **Detalhes Completos**: Modal com informações detalhadas de cada bloco
- **Design Moderno**: Interface escura e responsiva
- **Busca por Altura**: Encontre blocos específicos pela altura
- **Indicadores Visuais**: Cores e animações para diferentes estados

## 🛠️ Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- Axios

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes React
├── hooks/          # Custom hooks
├── services/       # Cliente API
├── types/          # Tipos TypeScript
└── utils/          # Utilitários e formatação
```

## 🔌 API

O projeto utiliza a API do ArcScan:
- Base URL: `https://testnet.arcscan.app/api/v2`
- Endpoints:
  - `GET /main-page/blocks` - Blocos mais recentes
  - `GET /blocks/{height}` - Bloco específico por altura

## 📝 Licença

MIT

