import Image from "next/image";
import { GetStaticProps } from "next";

import { useKeenSlider } from 'keen-slider/react'
import Stripe from 'stripe'

import { stripe } from "../lib/stripe";
import { ButtonSeta, HomeContainer, Product } from "../styles/pages/home";

import 'keen-slider/keen-slider.min.css'
import Link from "next/link";
import Head from "next/head";

import setaIcon from '../assets/seta.svg'

import style from '../styles/Home.module.css'

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 700px)": {
        slides: { perView: 1, spacing: 48 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 2, spacing: 48 },
      },
    },
    slides: {
      perView: 1,
    }
  })

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => {
          return (
            <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
        <ButtonSeta>
          <Image src={setaIcon} width={45} height={45} alt="" />
        </ButtonSeta>
      </HomeContainer>

      {/* <HomeContainerMobile
        className="cards-responsive"
      >
        {products.map(product => {
          return (
            <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
              <Product>
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
        <ButtonSeta>
          <Image src={setaIcon} width={45} height={45} alt="" />
        </ButtonSeta>
      </HomeContainerMobile> */}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        // @ts-ignore
      }).format(price.unit_amount / 100)
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2 //2 hours
  }
}