import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client'
import { fauna } from "../../services/fauna"
import { stripe } from "../../services/stripe"
import {query as q} from 'faunadb'

type User ={
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST'){

        // pega o usuario do cookie na sessao
        const session = await getSession({req})

        // procura o email enviado no banco FaunaDB
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        // if o usuario existe no fauna mas ainda não tem o id que vem do stripe
        // então ele vai criar inserir no stripe esse cliente
        if(!customerId){
            // insere esse email na tabela de clientes do stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metada
            })

            // insere o id do cliente que vem do stripe, no banco faundaDB
            // faz mapeamento do mesmo cliente entre as duas plataformas, stripe e faunadb
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1KZhUzHNjqmhZuZiOII25kIC', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id});
    }else{
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
} 