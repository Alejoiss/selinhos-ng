# Instruções do Copilot para SeloClubeAdminNg

## Visão Geral do Projeto
- **Framework:** Angular 20+ (componentes standalone, Angular CLI)
- **UI:** Tailwind CSS, ng-zorro-antd
- **Estrutura:**
    - `src/app/components/`: Componentes de UI compartilhados (ex: `internal-header`, `breadcrumb`, `aside-menu`)
    - `src/app/pages/`: Páginas de funcionalidades, agrupadas por domínio (ex: `home`, `login`, `company`, `campaigns`)
    - `src/app/models/`: Classes TypeScript para modelos de domínio (ex: `Campaign`, `Company`, `Plan`)
    - `src/app/services/`: Lógica de negócio e comunicação com API (um serviço por domínio)
    - `src/app/guards/`, `src/app/interceptors/`: Guards de rota e interceptadores HTTP
    - `src/environments/`: URLs de API e configurações de ambiente

## Padrões & Convenções Principais
- **Componentes Standalone:** Todos os componentes Angular usam o padrão `standalone: true` (veja o array `imports` no `@Component`).
- **Header & Breadcrumb:** Páginas usam `InternalHeader` com um objeto de configuração (veja `internal-header-configs.ts`) para título, descrição e breadcrumbs.
- **Testes:** Cada componente/serviço/modelo possui um arquivo `.spec.ts` correspondente usando o TestBed do Angular.
- **URLs de API:** Use `environment.apiUrl` para endpoints do backend. Alterne entre `environment.ts` (dev) e `environment.prod.ts` (prod).
- **Estilização:** Use classes Tailwind nos templates e `styles.scss` para overrides globais. ng-zorro-antd é usado para widgets de UI.
- **Roteamento:** Guards de rota estão em `guards/`. Use os guards `profile-permission` e `logged-user` para controle de acesso.
- **Responsividade:** Utilize as classes utilitárias do Tailwind para garantir que a UI seja responsiva.
- **Máscaras de Formulário:** Utilize máscaras de entrada para campos como CPF/CNPJ, telefones e datas, garantindo a formatação correta dos dados. Quando possível, utilize bibliotecas como ngx-mask para facilitar a implementação.
- **Validadores de Formulário:** Utilize validadores reativos do Angular para garantir a integridade dos dados nos formulários. Crie validadores personalizados quando necessário para regras específicas de negócio. Os validadores criados, devem ser armazenados um arquivo 'src/utils/validators.ts', para facilitar a manutenção e reutilização.
- **Formatação**: Toda formatação de código deve ser feita seguindo o arquivo de configuração '.editorconfig' presente na raiz do projeto. Espaçamento padrão são de 4 espaços por nível de indentação.
- **Condicionais e Loops em Templates:** Use o novo sistema de diretivas estruturais do Angular (control flow) para condicionais e loops, garantindo melhor performance e legibilidade.
    - Todo loop deve utilizar a diretiva `@for` com a cláusula `track` para otimizar a renderização de listas.
- **Ícones:** Utilize a biblioteca Phosphor Icons para ícones em toda a aplicação, garantindo consistência visual.

## Fluxos de Trabalho do Desenvolvedor
- **Iniciar Servidor de Dev:** `ng serve` (ou `npm start`)
- **Rodar Testes Unitários:** `ng test` (ou `npm test`)
- **Build para Produção:** `ng build`
- **Testes E2E:** `ng e2e` (framework não incluído por padrão)
- **Gerar Componente:** `ng generate component <nome>`

## Integração & Fluxo de Dados
- **Serviços:** Cada domínio (ex: `campaign`, `company`) possui um serviço para chamadas de API, injetado em páginas/componentes.
- **Comunicação entre Componentes:** Use `@Input`/`@Output` para fluxo de dados entre componentes pai/filho.
- **UI Orientada por Configuração:** Headers e breadcrumbs das páginas são configurados via objetos em `internal-header-configs.ts`.

## Exemplos
- Veja `src/app/pages/home/campaigns/campaigns.ts` para uma página típica usando um serviço, configuração de header e tabela ng-zorro-antd.
- Veja `src/app/components/internal-header/internal-header.ts` e `internal-header-configs.ts` para o padrão de header/breadcrumb.
- Veja `src/app/models/campaign/campaign.ts` para convenções de modelos.

## Dependências Externas
- **ng-zorro-antd:** Componentes de UI
- **Tailwind CSS:** Estilização utilitária
- **Angular CLI:** Build/test/scaffold

## Notas Especiais
- **Nenhum framework de teste end-to-end incluído por padrão.**
- **Todos os novos componentes devem ser standalone e importados explicitamente.**
- **Breadcrumbs e headers devem ser configurados para todas as novas páginas.**

Para mais informações, veja `README.md` e `src/app/components/internal-header/internal-header-configs.ts`.
