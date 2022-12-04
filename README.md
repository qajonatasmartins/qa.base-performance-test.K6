# qa.base-performance-test.K6

Prova de conceito na utilização do K6, Grafana e InfluxDb para testes de performance.

## Informations

K6 é uma incrível estrutura de teste de carga de código aberto escrita em Go. É altamente eficiente e capaz de gerar altas cargas com centenas de conexões simultâneas.

O K6 pode ser usado independentemente como uma ferramenta de linha de comando para executar testes de carga, ou combinado com outras ferramentas para diferentes visualizações e análises.

O K6 usa um motor EcmaScript 5.1 JavaScript incorporado (uma implementação goja pura) para definir o script de teste. Cada 'usuário virtual' tem uma instância separada do motor goja carregado como seu contexto e executa a função 'padrão' exportada continuamente para o prazo definido.

## Pre-requisitos

- Instalar o [K6](https://k6.io/docs/getting-started/installation/)
- Instalar o [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Up Containers

1. Inicie o docker desktop
2. Execute o comando `docker-compose up -d influxdb grafana` dentro da raiz do projeto.

## Install project

Execute `yarn install`

Obs.: Se não tiver o "yarn", então instale na sua maquina.

## Execution tests

Execute o comando `yarn run smoke` --> Smoke ta no arquivo package.json na seção de scripts

## View results (veja os resultados)

1. Abra o navegador
2. Cole a url `http://localhost:3000/d/k6/k6-load-testing-results?orgId=1&refresh=5s`

**Obs.:** De acordo com as execuções os graficos são atualizados.

## project structure

- **dashboards**: Na pasta contém o arquivo .json para ser importado na criação do ambiente e montar o layout padrão do dashboard que iremos visualizar as execuções dos testes de performance.
  - O arquivos .json com layout do dashboard pode ser encontrado no [link](https://grafana.com/grafana/dashboards/?search=k6). O layout utilizado foi o [6 Load Testing Results](https://grafana.com/grafana/dashboards/2587-k6-load-testing-results/)
  - Há apenas duas pequenas modificações: 
    - A fonte de dados está configurada para usar a fonte de dados InfluxDB criada pelo Docker.
    - O período de tempo está definido para "agora-5m", o que eu sinto que é uma visão melhor para a maioria dos testes.
- **docker-compose.yml**: O arquivo de configuração do docker-compose. O arquivo define 3 servidores e 2 redes, combinando-os em 1 solução composta por um servidor web (grafana) de visualização, Bando de dados (InfluxDb) e cliente de teste de performance (k6).
  -  Executa o servidor web grafana na porta 3000
  -  Executa o banco de dados InfluxDb na porta 8086
  -  Executa o K6 em uma base ad-hoc para executar um script de teste de carga
- **grafana-dashboard.yaml**: Configura o Grafana para carregar um painel K6 do diretório /var/lib/grafana/dashboards
- **grafana-datasource.yaml**: Configura o Grafana para usar o InfluxDB como fonte de dados, usando o nome host configurado em 'influxdb' com composição de docker para se conectar ao banco de dados através da rede docker local na porta 8086

**Obs.:** Observe que os painéis de arquivo do painel K6/k6-load-testing-results_rev3.json, o grafana-datasource.yaml e grafana-dashboard.yaml estão todos montados no recipiente do docker Grafana usando a propriedade 'volumes' em docker-com.yml.

Referência: [Belo teste de carga com K6 e Docker Compose](https://medium.com/swlh/beautiful-load-testing-with-k6-and-docker-compose-4454edb3a2e3)

[O que é o teste de carga em testes de software? Exemplos, como fazer, importância, diferenças](http://tryqa.com/what-is-load-testing-in-software/)

## [Métricas](https://k6.io/docs/using-k6/metrics/)

### Métricas básicas

| Nome da métrica    | Modelo   | Descrição                                                                                                                                                                                                      |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vus                | Medidor  | Número atual de usuários virtuais ativos                                                                                                                                                                       |
| vus_max            | Medidor  | Número máximo possível de usuários virtuais (os recursos VU são pré-alocados, garantindo que o desempenho não seja afetado ao aumentar o nível de carga)                                                       |
| iterations         | Contador | O número agregado de vezes que as VUs executaram o script JS (opredefiniçãofunção).                                                                                                                            |
| iteration_duration | Trend    | O tempo que levou para completar uma iteração completa, incluindo o tempo gasto emconfiguraredestruir. Para calcular a duração da função da iteração para o cenário específico, tente esta solução alternativa |
| dropped_iterations | Contador | O número de iterações que não foram iniciadas devido à falta de VUs (para os executores de taxa de chegada) ou falta de tempo (maxDuration expirado nos executores baseados em iteração).                      |
| data_received      | Contador | A quantidade de dados recebidos. Este exemplo aborda como rastrear dados de um URL individual .                                                                                                                |
| data_sent          | Contador | A quantidade de dados enviados. Rastreie dados de um URL individual para rastrear dados de um URL individual.                                                                                                  |
| checks             | rate     | A taxa de verificações bem-sucedidas.                                                                                                                                                                          |

### Métricas integradas específicas de HTTP

| Nome da métrica          | Modelo | Descrição                                                                                                                                                                                                                                      |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| http_reqs                |        | Quantas solicitações HTTP totais k6 foram geradas                                                                                                                                                                                              |
| http_req_blocked         |        | Tempo gasto bloqueado (aguardando um slot de conexão TCP livre) antes de iniciar a solicitação.float                                                                                                                                           |
| http_req_connecting      |        | Tempo gasto estabelecendo a conexão TCP com o host remoto.float                                                                                                                                                                                |
| http_req_tls_handshaking |        | Tempo gasto na sessão TLS de handshake com host remoto                                                                                                                                                                                         |
| http_req_sending         |        | Tempo gasto enviando dados para o host remoto.float                                                                                                                                                                                            |
| http_req_waiting         |        | Tempo gasto aguardando resposta do host remoto (também conhecido como “tempo para o primeiro byte” ou “TTFB”).float                                                                                                                            |
| http_req_receiving       |        | Tempo gasto recebendo dados de resposta do host remoto.float                                                                                                                                                                                   |
| http_req_duration        |        | Tempo total para o pedido. É igual ahttp_req_enviando + http_req_waiting + http_req_receiving(ou seja, quanto tempo o servidor remoto levou para processar a solicitação e responder, sem os tempos iniciais de consulta/conexão de DNS).float |
| http_req_failed          |        | A taxa de solicitações com falha de acordo com setResponseCallback .                                                                                                                                                                           |

### Acessando horários HTTP de um script

Para acessar as informações de tempo de uma solicitação HTTP individual, o objeto Response.timings fornece o tempo gasto nas várias fases doEM:

- **blocked**: equals to http_req_blocked.
- **connecting**: equals to http_req_connecting.
- **tls_handshaking**: equals to http_req_tls_handshaking.
- **sending**: equals to http_req_sending.
- **waiting**: equals to http_req_waiting.
- **receiving**: equals to http_req_receiving.
- **duration**: equals to http_req_duration.

### Tipos de métrica

- **Counter**: Uma métrica que soma cumulativamente os valores adicionados.
- **Gauge**: Uma métrica que armazena os valores mínimo, máximo e último adicionados a ela.
- **Rate**: Uma métrica que rastreia a porcentagem de valores adicionados diferentes de zero.
- **Trend**: Uma métrica que permite calcular estatísticas sobre os valores agregados (min, max, média e percentis).

## Tipos de testes

- **smoke testing**: Tem como objetivo verificar se o seu sistema pode lidar com carga mínima, sem problemas.
- **load testing**: Tem como objetivo (principalmente preocupado) em avaliar o desempenho do seu sistema em termos de usuários ou solicitações simultâneas por segundo.
- **stress testing**: Está preocupado em avaliar os limites do seu sistema e estabilidade sob condições extremas.
  - **spike testing**: O teste de pico é uma variação de um teste de estresse, mas não aumenta gradualmente a carga. Em vez disso, atinge uma carga extrema em um período muito curto de tempo. Enquanto um teste de estresse permite que o SUT (System Under Test) aumente gradualmente sua infraestrutura, um teste de pico não.
  **O que é teste de pico?**
  O teste de pico é um tipo de teste de estresse que sobrecarrega imediatamente o sistema com um aumento extremo de carga.
- **soak/endurance testing**: O teste informa sobre a confiabilidade e o desempenho do seu sistema por um longo período de tempo.

## Validações

- [checks](https://k6.io/docs/using-k6/checks/)
- [thresholds](https://k6.io/docs/using-k6/thresholds/)

## Configure project performance testing

[Passo a passo](https://k6.io/docs/testing-guides/automated-performance-testing/)

## Continuous Integration and Continuous Delivery

[By automating load testing with your CI / CD tools, you can quickly see when a code change has introduced a performance regression.](https://k6.io/docs/integrations/#continuous-integration-and-continuous-delivery)

## Outras informações de teste de performance

- [Testes de Performance e os Percentis](https://www.juliodelima.com.br/percentis-e-sua-importancia-nos-testes-de-performance/#:~:text=Percentil%20%C3%A9%20uma%20medida%20utilizada,resultados%20dos%20testes%20de%20performance.)
- [AS MÉTRICAS DE PERFORMANCE QUE VOCÊ DEVERIA ACOMPANHAR EM SUA APLICAÇÃO](https://blog.onedaytesting.com.br/metricas-de-performance/)

### create a `package.json` file

`npm init --yes`

### install the k6 types as dev dependency

`npm install --save-dev @types/k6`