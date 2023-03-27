import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        className="h-14 w-14 rounded-full"
        src={author.profileImageUrl}
        alt="users profile picture"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL={author.profileImageUrl}
      />
      <div className="flex flex-col gap-2">
        <div className="flex text-slate-300">
          <Link href={`@${author.username}`}>
            <span>{author.username}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              -{dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
