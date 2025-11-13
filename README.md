# Arc Blocks Explorer

Frontend moderno para visualização de blocos da rede Arc em tempo real, similar ao mempool.space do Bitcoin.

🔗 **Repositório**: [https://github.com/6u5t4v05ouz4/Arc-Blocks-Explorer](https://github.com/6u5t4v05ouz4/Arc-Blocks-Explorer)

## 🚀 Funcionalidades

- **Visualização em Tempo Real**: Atualização automática a cada 800ms (acompanha ~5 blocos/segundo)
- **Modo Terminal**: Visualização rápida em formato de tabela com os últimos 15 blocos
- **Modo Cards**: Visualização em cards (desabilitado por padrão para melhor performance)
- **Renderização Otimizada**: Apenas novos blocos são adicionados, mantendo blocos antigos intactos
- **Navegação de Blocos**: Visualize blocos anteriores e posteriores ao bloco atual
- **Detalhes Completos**: Modal com informações detalhadas de cada bloco
- **Design Moderno**: Interface escura e responsiva
- **Busca por Altura**: Encontre blocos específicos pela altura
- **Indicadores Visuais**: Cores e animações para diferentes estados
- **Modo Automático**: Segue automaticamente o bloco mais recente

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

