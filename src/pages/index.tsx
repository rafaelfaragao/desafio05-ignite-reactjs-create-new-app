import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../components/Header';

import { FiUser, FiCalendar } from "react-icons/fi";

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}:HomeProps) {
  // TODO
  
  return(
    <>
      <Header />
      
      <main className={commonStyles.wrapperContainer}>
        <div className={styles.posts}>
          {postsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <h3>{post.data.subtitle}</h3>
                <div className={styles.postInfo}>
                  <time><FiCalendar/> {post.first_publication_date}</time>
                  <p><FiUser/> {post.data.author}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        { postsPagination.next_page && <a className={styles.maisPosts}>Carregar mais posts</a>}
      </main>
    </>

  );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.query(
      Prismic.predicates.at('document.type', 'posts'), {
        fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
        pageSize: 3,
      }
    );

    const results = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          "dd MMM yyyy",
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      };
    });
    const next_page = postsResponse.next_page
    
    const postsPagination = {
      next_page,
      results
    }
    //console.log(results, next_page);
    //console.log(JSON.stringify(postsResponse.results, null, 2))

    return { 
      props: {
        postsPagination
      }
    }
   // TODO
};
