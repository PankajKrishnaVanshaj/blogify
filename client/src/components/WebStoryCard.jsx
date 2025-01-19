import Link from "next/link";
import React from "react";
import UserInfo from "./UserInfo";

const WebStoryCard = ({ webStory }) => {
  return (
    <div className="relative h-80 w-52 rounded-lg shadow-sm shadow-tertiary hover:shadow-primary overflow-hidden">
      <div className="absolute bottom-0 left-0 w-fit">
        {/* <div className="bg-white opacity-70 w-fit rounded-full mx-0.5 overflow-auto ">
          {webStory.createdBy && (
            <UserInfo user={webStory.createdBy} use="BlogCarousel" />
          )}
        </div> */}
        <h1 className="bg-black m-1 mt-0.5 hover:scale-105 duration-300 bg-opacity-50 rounded-md px-2 font-mono font-semibold text-primary cursor-pointer line-clamp-5 leading-3 py-0.5">
          <Link href={`/${webStory._id}/web-story`}>{webStory.title}</Link>
        </h1>
      </div>
      <div
        className="h-full w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/${webStory.coverImage})`,
        }}
      />
    </div>
  );
};

export default WebStoryCard;
