import Link from "next/link";
import { ImageContainer, SuccsessContainer } from "../styles/pages/success";

export default function Succsees() {
    return (
        <SuccsessContainer>
            <h1>Compra efetuada!</h1>

            <ImageContainer>

            </ImageContainer>

            <p>Uhuul <strong>Diego Fernandes</strong>, sua <strong>Camiseta Beyond the Limits</strong> já está a caminho da sua casa. </p>

            <Link href="/">
                Voltar ao catálago
            </Link>
        </SuccsessContainer>
    )
}