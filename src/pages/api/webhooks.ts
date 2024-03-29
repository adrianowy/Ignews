import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer (readable: Readable) {
    const chunks = [];

    for await (const chunk of readable){
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

// evento de retorno do stripe
const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

const webhooksApi = async(req: NextApiRequest, res: NextApiResponse) => {

    if(req.method === 'POST'){
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOKS_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        const { type } = event;

        if(relevantEvents.has(type)){
            try {
                switch(type){

                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':

                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        );

                    break;


                    // evento de quanto o usuario finalizou uma compra dentro do stripe
                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        );

                    break;

                    default:
                        throw new Error('Unhandle event.');

                }
            } catch (err) {
                // sentry or bugsnag (ferramenta de monitoramento de aplicações nodejs)
                return res.json({error: `Webhook handler failed.`})
            }
        }

        res.status(200).json({received: true});
    }else{
        res.setHeader('Allow','POST');
        res.status(405).end('Method not allowed');

    }
}

export default webhooksApi;