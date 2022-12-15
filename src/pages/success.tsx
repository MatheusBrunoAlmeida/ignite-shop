import { GetServerSideProps } from "next";
import Link from "next/link";
import { stripe } from "../lib/stripe";
import { ImageContainer, SuccsessContainer } from "../styles/pages/success";

import Stripe from 'stripe'
import Image from "next/image";
import Head from "next/head";

interface SuccsessProps {
    custumerName: string;
    product: {
        name: string;
        imageUrl: string;
    }
}

export default function Succsees({ custumerName, product }: SuccsessProps) {
    return (
        <>
            <Head>
                <title>Compra efetuada | Ignite Shop</title>

                <meta name="robots" content="noindex" />
            </Head>

            <SuccsessContainer>
                <h1>Compra efetuada!</h1>

                <ImageContainer>
                    <Image src={product.imageUrl} width={120} height={110} alt="" />
                </ImageContainer>

                <p>Uhuul <strong> {custumerName} </strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa. </p>

                <Link href="/">
                    Voltar ao catálago
                </Link>
            </SuccsessContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    if (!query.session_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const sessiondId = String(query.session_id);

    const session = await stripe.checkout.sessions.retrieve(sessiondId, {
        expand: ['line_items', 'line_items.data.price.product']
    })

    const custumerName = session.customer_details?.name;
    // @ts-ignore
    const product = session.line_items?.data[0].price.product as Stripe.Product


    return {
        props: {
            custumerName,
            product: {
                name: product.name,
                imageUrl: product.images[0]
            }
        }
    }
}