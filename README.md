
# This project as created following Ignite React Course (RocketSeat), Chapter III

<br/>

#### Modules

1. Fundamentos do Next.JS
- Nesse módulo entenderemos como o Next.js transforma a nossa maneira de desenvolver aplicações front-end e descobriremos conceitos importantes como SSR e SSG.
2. Back-end no Front-end
- Durante esse módulo entenderemos como o front-end se transformou nos últimos anos com a possibilidade de termos funções back-end (serverless) executando em um ambiente front-end.
3. Front-end JAMStack
- É muito comum o desenvolvimento de aplicações front-end que não estão conectadas a um único back-end hoje em dia, por isso, aqui vamos entender o conceito de JAMStack e como conectar nosso front-end com um CMS.

#### Para rodar o projeto
Execute o comando abaixo:
```
stripe listen --forward-to localhost:3000/api/webhooks
```


#### Use as chaves abaixo no seu arquivo *env.local*

```
#Stripe
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000/
STRIPE_WEBHOOKS_SECRET=

#GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

#FaundaDB
FAUNADB_KEY=

#Prismic CMS
PRIMISC_ACCESS_TOKEN=MC5ZakNHb3hJQUFDb0Fzczly.77-9Kzfvv73vv70H77-9X2lePyrvv73vv73vv73vv70x77-977-977-977-9amYi77-977-977-977-977-9QXXvv70
PRISMIC_ENDPOINT=https://ignewswy.prismic.io/api/v2
```