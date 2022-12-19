import { GetStaticPaths, GetStaticProps } from "next";
import { stripe } from "../../lib/stripe";
import Stripe from 'stripe'
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from 'axios'
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        defaultPriceId: string;
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    async function handleBuyButton() {
        try {
            setIsCreatingCheckoutSession(true);

            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            })

            const { checkoutUrl } = response.data;

            window.location.href = checkoutUrl;
        } catch (err) {
            setIsCreatingCheckoutSession(false);

            alert('Falha ao redirecionar ao checkout!')
        }
    }
    const { isFallback } = useRouter()

    if (isFallback) {
        return <p>Loading...</p>
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>

            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>

                    <button
                        onClick={handleBuyButton}
                        disabled={isCreatingCheckoutSession}
                    >
                        Comprar agora
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_N0rzONebjsjTpU' } }
        ],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    // @ts-ignore
    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    });

    const price = product.default_price as Stripe.Price;

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    // @ts-ignore
                }).format(price.unit_amount / 100),
                description: product.description,
                defaultPriceId: price.id
            }
        },
        revalidate: 60 * 60 * 1 //2 hours
    }
}
