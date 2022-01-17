import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
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
  return(
    <>
      <Header />
      {console.log(post)}
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      
      <div className={commonStyles.wrapperContainer}>
        <div className={styles.container}>
          <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <time><FiCalendar/> {post.first_publication_date}</time>
              <p><FiUser/> {post.data.author}</p>
            </div>
            <div className={styles.merda}>
              {post.data.content.map(div => {
                <div>
                  <h2>{div.heading}</h2>
                </div>
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
    
  console.log(post)
    

  return {
    props: {
      post,
    },
    revalidate: 60*30 // 30 minutes
  }
};
