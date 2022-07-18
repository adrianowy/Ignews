import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import styles from './../post.module.scss'
import { useSession } from "next-auth/client"
import { useEffect } from "react";
import router from "next/router";


interface PostPreviewProps{
    post : {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps){

    const [session] = useSession()

    useEffect(()=>{
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    },[session])


    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content}} />
                    
                    <div className={styles.continueReading}>
                        Wanna continues reading ?
                        <Link href="/">
                            <a href="">Subscribe now!</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [
            // {
            //     params: { slug: 'id-do-post' }
            // }
        ],
        fallback: 'blocking'
        /**
         * fallback, opções: true, false, blocking
         * true --> se alguem tentar acessar o post que ainda ñ foi gerado de forma estatica, eu quero q vc carregue o conteudo do post no lado do browser (cliente) e não é bom para SEO
         * false --> se o post não foi gerado a parte estática ainda, vai retornar 404
         * blocking --> se ainda não foi gerado na parte estática, vai gerar no lado do servidor
         */
        
    };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug } = params;

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('publication', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    };

    return {
        props: {
            post,
        },
        redirect: 60 * 30,
    }
}