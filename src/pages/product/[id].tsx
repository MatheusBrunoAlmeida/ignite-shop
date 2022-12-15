import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";

export default function Product(){
    return(
        <ProductContainer>
            <ImageContainer>

            </ImageContainer>

            <ProductDetails>
                <h1>Camiseta x</h1>
                <span>R$ 79,90</span>

                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est laudantium porro eius autem ab ea recusandae quisquam. Sit, autem dolorum unde doloribus molestias delectus assumenda optio culpa beatae exercitationem. Aperiam!</p>

                <button>
                    Comprar agora 
                </button>
            </ProductDetails>
        </ProductContainer>
    )
}