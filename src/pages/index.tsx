// import { GetServerSideProps } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe';

import styles from './home.module.scss'

interface HomeProps{
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏Hey, welcome</span>
          <h1>New about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Avatar" />
      </main>
    </>
  )
}

/**
 * getStaticProps é usado para página estáticas SSR (Static Site Generation)
 * só posso usar dessa maneira em páginas que são iguais para todos que vão acessar a aplicação
 * e também são importantes para indexação no google SEO
*/

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1KZhUzHNjqmhZuZiOII25kIC')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
    // amount: (price.unit_amount / 100),
  }

  return {
    props: {
      product
    },
    // quanto tempo em segundos essa página vai se manter sem ser revalidada (reconstruida)
    revalidate: 60 * 60 * 24, // 24 hours
  }
};

/**
export const getServerSideProps: GetServerSideProps = async () => {

  const price = await stripe.prices.retrieve('price_1KZhUzHNjqmhZuZiOII25kIC')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
    // amount: (price.unit_amount / 100),
  }

  return {
    props: {
      product
    }
  }
};
*/

// https://dashboard.stripe.com/settings/branding