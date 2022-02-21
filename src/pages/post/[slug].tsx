import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

//export default function Post({post}:PostProps) {
  export default function Post({post}:PostProps) {
//   // TODO
 var qtdPalavras;
 post.data.content.reduce((tudo, atual)=>{
  
  let arrayTexto1 = RichText.asText(tudo.body)
  let arrayTexto2= RichText.asText(atual.body)
  let qtdArray1 = arrayTexto1.split(" ")
  let qtdArray2 = arrayTexto2.split(" ")

  //console.log(qtdArray1.length, qtdArray2.length)
  qtdPalavras = Number(qtdArray1.length) + Number(qtdArray2.length)
  return tudo
 })

 console.log(qtdPalavras)
 const minLeitura = Math.ceil(Number(qtdPalavras)/200)
 console.log(minLeitura)

  return(
    <>
      <Header />
      {/* {console.log(post.data.content)} */}
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      
      <div className={commonStyles.wrapperContainer}>
        <div className={styles.container}>
          <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <time><FiCalendar/> {post.first_publication_date}</time>
              <p><FiUser/> {post.data.author}</p>
              <p><FiClock/></p>
            </div>
            <div className={styles.content}>
              {post.data.content.map((content, index) => {
                let body = RichText.asHtml(content.body)
                return (
                  <>
                    <h2 key={index}>{content.heading}</h2>
                    <div dangerouslySetInnerHTML={{__html:body}}></div>
                    {/* {content.body.map((body, index) => (
                      <p key={index} dangerouslySetInnerHTML={{__html:body.text}}></p>
                    ))} */}
                  </>
                )
              })}
            </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
   const prismic = getPrismicClient();
   //const posts = await prismic.query();

   // TODO
   return {
     paths: [],
     fallback: true,
   }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "dd MMM yyyy",
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content
    }
  }
    
  //console.log(JSON.stringify(post, null, 2));
    

  return {
    props: {
      post,
    },
  }
};
