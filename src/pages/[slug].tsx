import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import Image from "next/image";
import { LoadingPage } from "~/components/Loading";


const ProfileFeed = (props: {userId: string}) => {

  const {data, isLoading} = api.posts.getPostsByUSerId.useQuery({ userId: props.userId });

  if(isLoading) return <LoadingPage/>

  if(!data || data.length === 0 ) return <div>User has not posted</div>

  return <div className="flex flex-col">
    {data.map((fullPost) => (<PostView key={fullPost.post.id} {...fullPost}/>))}
  </div>

}


const ProfilePage: NextPage<{username: string}> = ({username}) => {
  const {data} = api.profile.getUserByUsername.useQuery({
    username: "mirobelak"
  });

  if(!data) return <div>Something went wrong</div>


  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-36 bg-slate-600 relative">
          <Image src={data.profileImageUrl} alt="profile image" width={128} height={128} className="-mb-[64px] rounded-full border-4 border-black  absolute bottom-0 left-0 ml-4 bg-black"/>
          </div>
          <div className="h-[64px} mt-[64px]"></div>
          <div className="p-4 text-2xl font-bold">@{data.username}</div>
          <div className="border-b border-slate-400 w-full"></div>
          <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
};

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import  superjson  from 'superjson';
import PostView from "~/components/postView";


export const getStaticProps : GetStaticProps = async(context) => {

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

const slug  = context.params?.slug;

if(typeof slug !== "string") throw new Error("Slug is not a string");

const username = slug.replace("@", "")

await ssg.profile.getUserByUsername.prefetch({username});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  } 
  
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};


export default ProfilePage;
