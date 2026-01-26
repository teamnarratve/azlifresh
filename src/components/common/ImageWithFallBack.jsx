"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback = ({
  src,
  img,
  fallback = fallbackImage,
  alt = "image",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <>
      <Image
        src={imgSrc}
        onError={() => setImgSrc(fallback)}
        alt={alt}
          className="object-cover object-center"

        {...props} // className and style are passed through here
      />
    </>
  );
};

export default ImageWithFallback;
