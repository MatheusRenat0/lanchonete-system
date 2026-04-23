# Sistema de Gestão para Rede de Lanchonete

Projeto acadêmico desenvolvido para a criação de um sistema de gestão voltado ao varejo alimentício, com ênfase em controle de estoque, ponto de venda (PDV) e integração entre unidades.

---

## Descrição do Projeto

O sistema visa solucionar gargalos operacionais críticos, como a gestão de perecíveis e a descentralização de dados financeiros.  
A plataforma consolida relatórios de vendas e fluxo de caixa de todas as filiais em um painel único para análise de rentabilidade.

---

## Funcionalidades Principais

### Backend e Regras de Negócio

- **Controle Automatizado de Estoque**  
  Monitoramento de validade e temperatura de itens perecíveis para minimizar riscos sanitários e perdas financeiras.

- **Gatilho de Reposição**  
  Geração automática de ordens de reposição assim que um produto atinge o estoque mínimo de segurança pré-configurado.

- **Segurança e Autenticação**  
  Uso de Spring Security com JWT para controle de acesso.  
  Operações críticas como estornos e abertura de gaveta exigem autenticação multifator ou biométrica.

- **Modo de Contingência Offline**  
  Capacidade de processar vendas durante quedas de conexão, com sincronização automática após o restabelecimento do sinal.

- **Rastreabilidade**  
  Manutenção de logs detalhados de todas as transações para fins de auditoria.

---

### Frontend e Interface

- **Ponto de Venda (PDV)**  
  Interface de latência ultra-baixa para processamento rápido de pagamentos e emissão de cupons fiscais.

- **Painel Gerencial**  
  Interface responsiva para visualização de inventário com alertas visuais para produtos próximos ao vencimento.

---

## Tecnologias Utilizadas

### Backend

- **Linguagem:** Java 21  
- **Framework:** Spring Boot  
- **Segurança:** Spring Security + JWT  
- **Persistência:** Hibernate + Spring Data JPA  

---

### Banco de Dados

- **Desenvolvimento:** H2 (banco em memória para testes)  
- **Produção:** MySQL  

---

### Frontend

- **Biblioteca:** React  
- **Build:** Vite  
- **Estilização:** Tailwind CSS  

---

## Arquitetura do Sistema

A solução foi construída sob uma arquitetura modular, facilitando a manutenção e permitindo integração futura com aplicativos de logística e plataformas de terceiros via APIs abertas.

---

## Modelagem de Dados (DER)

A estrutura lógica do banco de dados está dividida em três pilares:

1. **Estrutura Operacional**  
   Cadastro de unidades e funcionários (incluindo hash de biometria).

2. **Catálogo e Perecíveis**  
   Gestão de produtos e lotes com monitoramento de temperatura e validade.

3. **Transações**  
   Registro de vendas, itens de venda e identificação de transações realizadas em modo offline.

---

## Integrantes do Projeto

- Hendrew dos Santos Braz  
- Manuel Douglas Silva Alves  
- Matheus Renato Bento Estevo  
